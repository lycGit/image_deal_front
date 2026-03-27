<template>
  <div class="auto-short-player">
    <h1>自动短视频生成</h1>
    <button class="start-button" @click="startGenerate" :disabled="isGenerating">
      {{ isGenerating ? '生成中...' : '开始生成' }}
    </button>
    <div class="progress" v-if="isGenerating">
      <p>正在处理第 {{ currentEpisode + 1 }} 集，共 {{ totalEpisodes }} 集</p>
    </div>
    <div class="result" v-if="generatedImages.length > 0">
      <h2>生成结果</h2>
      <div class="image-grid">
        <div class="image-item" v-for="(image, index) in generatedImages" :key="image.id">
          <img :src="image.url" :alt="`Episode ${image.episode}`" />
          <p>Episode {{ image.episode }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import eventBus from '../eventBus'
import { getUserId } from '../js/userIdUtil'
import { createDeepSeekApi } from '../js/deepseekApiUtil'

// 导入配置文件
import plotConfig from '../config/plot.json'
import roleConfig from '../config/role.json'

// 响应式状态
const isGenerating = ref(false)
const currentEpisode = ref(0)
const totalEpisodes = ref(plotConfig.episodes.length)
const generatedImages = ref([])
const pendingPromises = ref([]) // 使用队列存储Promise，按顺序处理

// 获取用户ID
const userId = getUserId()

// 开始生成
const startGenerate = async () => {
  if (isGenerating.value) return
  
  isGenerating.value = true
  currentEpisode.value = 0
  generatedImages.value = []
  pendingPromises.value = []
  
  // 依次处理每个episode
  for (let i = 0; i < plotConfig.episodes.length; i++) {
    currentEpisode.value = i
    await processEpisode(plotConfig.episodes[i])
    console.log(`Episode ${plotConfig.episodes[i].episode} 处理完成，继续下一个`)
  }
  
  isGenerating.value = false
  alert('所有集数生成完成！')
}

// 处理单个episode
const processEpisode = async (episode) => {
  try {
    // 生成提示词
    const prompt = generatePrompt(episode)
    console.log(`Episode ${episode.episode} 提示词:`, prompt)
    
    // 优化提示词
    const optimizedPrompt = await optimizePrompt(prompt)
    console.log(`Episode ${episode.episode} 优化后提示词:`, optimizedPrompt)
    
    // 创建一个Promise来等待WebSocket响应
    const promise = new Promise((resolve) => {
      pendingPromises.value.push(resolve)
    })
    
    // 发送websocket消息（不需要tempId和episode字段）
    const message = JSON.stringify({
      'msg': optimizedPrompt,
      'userId': userId,
      'targetUserId': 'user_py_llm',
      'action': 'text2image'
    })
    eventBus.emit('websocket-AutoShortPlayer', message)
    
    // 添加临时记录
    generatedImages.value.push({
      id: Date.now(),
      episode: episode.episode,
      url: null,
      prompt: prompt
    })
    
    // 等待WebSocket响应
    await promise
    console.log(`Episode ${episode.episode} 图片生成完成`)
    
  } catch (error) {
    console.error(`处理Episode ${episode.episode}失败:`, error)
  }
}

// 生成提示词
const generatePrompt = (episode) => {
  let prompt = ''
  
  // 处理角色
  if (episode.角色 && episode.角色.length > 0 && episode.角色[0] !== '无') {
    episode.角色.forEach(roleName => {
      const role = roleConfig['角色形象提示词'].find(r => r.角色 === roleName)
      if (role) {
        prompt += `【${roleName}】：${role.形象描述}，`
      }
    })
  }
  
  // 添加背景画面提示词
  if (episode.背景画面提示词) {
    prompt += episode.背景画面提示词
  }
  
  return prompt
}

// 优化提示词
const optimizePrompt = async (originalPrompt) => {
  try {
    // 从环境变量获取API密钥
    const apiKey = 'sk-bea5f7598f4a4c7195fe0063779e6f64'
    if (apiKey) {
      const deepseekApi = createDeepSeekApi(apiKey)
      
      // 自定义请求选项
      const options = {
        model: 'deepseek-chat',
        maxTokens: 1000,
        temperature: 0.8
      }
      
      // 发送提示词优化请求
      const optimizationPrompt = `请将以下中文绘画提示词参考
cute anime girl with massive fluffy fennec ears and a big fluffy tail
blonde messy long hair blue eyes wearing a maid outfit with a long black
gold leaf pattern dress and a white apron mouth open placing a fancy
black forest cake with candles on top of a dinner table of an old dark
Victorian mansion lit by candlelight with a bright window to the foggy
forest and very expensive stuff everywhere there are paintings on the walls
这个样式和结构优化为更专业、更详细的英文绘画提示词，适合AI图像生成：${originalPrompt}，
同时只需要返回最佳的一个优化后的英文提示词结果就行，不要返回改写说明等对于生成图片无用的内容`
      const optimizedResult = await deepseekApi.chat(optimizationPrompt, options)
      
      console.log('DeepSeek API优化提示词结果:', optimizedResult)
      return optimizedResult
    }
  } catch (error) {
    console.error('提示词优化失败:', error)
    // 优化失败不影响原有功能，继续使用原始提示词
  }
  return originalPrompt
}

// 处理WebSocket消息
const handleMessage = (data) => {
  console.log('AutoShortPlayer 收到 WebSocket 消息:', data)
  try {
    if (data.imageUrl) {
      // 找到第一个url为null的图片记录
      const tempImageIndex = generatedImages.value.findIndex(img => !img.url)
      
      if (tempImageIndex !== -1) {
        // 更新临时记录，添加图片URL
        generatedImages.value[tempImageIndex] = {
          ...generatedImages.value[tempImageIndex],
          url: data.imageUrl,
          description: data.description,
        }
        console.log('已更新图片记录:', generatedImages.value[tempImageIndex])
        
        // 自动下载图片
        downloadImage(data.imageUrl, `episode${generatedImages.value[tempImageIndex].episode}.png`)
        
        // 取出队列中的第一个Promise并解析
        if (pendingPromises.value.length > 0) {
          const resolve = pendingPromises.value.shift()
          resolve()
        }
      }
    }
  } catch (error) {
    console.error('解析消息失败:', error)
  }
}

// 下载图片功能
const downloadImage = (url, filename) => {
  // 创建一个a标签
  const link = document.createElement('a')
  link.href = url
  link.download = filename || 'image.png'
  link.target = '_blank'
  
  // 触发点击事件
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  console.log('AutoShortPlayer onMounted')
  eventBus.on('websocket-message', handleMessage)
})

onUnmounted(() => {
  console.log('AutoShortPlayer onUnmounted')
  eventBus.off('websocket-message', handleMessage)
})
</script>

<style scoped>
.auto-short-player {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.start-button {
  display: block;
  margin: 0 auto 30px;
  padding: 15px 30px;
  font-size: 18px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover:not(:disabled) {
  background-color: #45a049;
}

.start-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.progress {
  text-align: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.result {
  margin-top: 40px;
}

.result h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.image-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
}

.image-item img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
}

.image-item p {
  margin: 0;
  font-weight: bold;
  color: #333;
}
</style>