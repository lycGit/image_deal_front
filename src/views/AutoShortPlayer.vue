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
          <video v-if="image.videoUrl" :src="image.videoUrl" controls class="video-preview"></video>
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
  
  console.log('========== 开始串行生成图片 ==========')
  
  // 依次处理每个episode
  for (let i = 0; i < plotConfig.episodes.length; i++) {
    currentEpisode.value = i
    const episode = plotConfig.episodes[i]
    console.log(`\n>>> 开始处理 Episode ${episode.episode} (${i + 1}/${plotConfig.episodes.length})`)
    
    await processEpisode(episode)
    console.log(`<<< Episode ${episode.episode} 处理完成，等待 ${i + 1 < plotConfig.episodes.length ? '下一个...' : '全部完成'}`)
  }
  
  console.log('========== 所有集数生成完成 ==========')
  isGenerating.value = false
  alert('所有集数生成完成！')
}

// 处理单个episode
const processEpisode = async (episode) => {
  try {
    console.log(`[Episode ${episode.episode}] 步骤1: 生成提示词...`)
    // 生成提示词
    const prompt = generatePrompt(episode)
    console.log(`[Episode ${episode.episode}] 原始提示词:`, prompt.substring(0, 50) + '...')
    
    console.log(`[Episode ${episode.episode}] 步骤2: 优化提示词...`)
    // 优化提示词
    const optimizedPrompt = await optimizePrompt(prompt)
    console.log(`[Episode ${episode.episode}] 优化后提示词:`, optimizedPrompt.substring(0, 50) + '...')
    
    console.log(`[Episode ${episode.episode}] 步骤3: 创建Promise等待WebSocket响应...`)
    // 创建一个Promise来等待WebSocket响应（图片生成）
    const imagePromise = new Promise((resolve) => {
      pendingPromises.value.push({ type: 'image', resolve })
    })
    
    console.log(`[Episode ${episode.episode}] 步骤4: 发送WebSocket消息（图片生成）...`)
    // 发送websocket消息（图片生成）
    const imageMessage = JSON.stringify({
      'msg': optimizedPrompt,
      'userId': userId,
      'targetUserId': 'user_py_llm',
      'action': 'text2image'
    })
    eventBus.emit('websocket-AutoShortPlayer', imageMessage)
    
    // 添加临时记录
    const tempImageId = Date.now()
    generatedImages.value.push({
      id: tempImageId,
      episode: episode.episode,
      url: null,
      prompt: prompt,
      videoUrl: null
    })
    
    console.log(`[Episode ${episode.episode}] 步骤5: 等待WebSocket响应（图片生成）...`)
    // 等待图片生成完成
    const imageResult = await imagePromise
    console.log(`[Episode ${episode.episode}] 步骤6: 图片生成完成！`, imageResult)
    
    // 自动下载图片
    // if (imageResult && imageResult.imageUrl) {
    //   await downloadImage(imageResult.imageUrl, `episode${episode.episode}.png`)
    // }
    
    console.log(`[Episode ${episode.episode}] 步骤7: 创建Promise等待视频生成...`)
    // 创建一个Promise来等待WebSocket响应（视频生成）
    const videoPromise = new Promise((resolve) => {
      pendingPromises.value.push({ type: 'video', resolve })
    })
    
    console.log(`[Episode ${episode.episode}] 步骤8: 发送WebSocket消息（视频生成）...`)
    // 发送websocket消息（图生视频）
    const videoMessage = JSON.stringify({
      'msg': episode.剧情,
      'imageUrl': imageResult.imageUrl,
      'userId': userId,
      'targetUserId': 'user_py_llm',
      'action': 'image2video'
    })
    eventBus.emit('websocket-AutoShortPlayer', videoMessage)
    
    console.log(`[Episode ${episode.episode}] 步骤9: 等待WebSocket响应（视频生成）...`)
    // 等待视频生成完成
    const videoResult = await videoPromise
    console.log(`[Episode ${episode.episode}] 步骤10: 视频生成完成！`, videoResult)
    
    // 自动下载视频
    if (videoResult && videoResult.videoUrl) {
      await downloadVideo(videoResult.videoUrl, `episode${episode.episode}.mp4`)
    }
    
  } catch (error) {
    console.error(`[Episode ${episode.episode}] 处理失败:`, error)
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
      const optimizationPrompt = `请将以下中文绘画提示词优化为专业、详细、适合AI图像生成的英文提示词，必须严格保留原意和主要元素，只返回最佳的一个英文结果，不要返回任何解释、说明或原文：${originalPrompt}`
      
      // 添加重试机制，最多尝试10次
      let optimizedResult = '';
      const maxRetries = 3;
      let retryCount = 0;
      let isSuccess = false;
      
      while (retryCount < maxRetries && !isSuccess) {
        optimizedResult = await deepseekApi.chat(optimizationPrompt, options);
        console.log(`DeepSeek API优化提示词结果 (尝试 ${retryCount + 1}):`, optimizedResult);
        
        // 检查结果是否包含失败标志字符串
        if (!optimizedResult.includes('cute anime girl') && !optimizedResult.includes('Cute anime girl')) {
          isSuccess = true;
        } else {
          retryCount++;
          console.log(`优化失败，重新尝试 (${retryCount}/${maxRetries})...`);
        }
      }
      
      console.log('最终优化提示词结果:', optimizedResult);
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
    // 处理图片生成响应
    if (data.imageUrl) {
      // 找到第一个url为null的图片记录
      const tempImageIndex = generatedImages.value.findIndex(img => !img.url)
      
      if (tempImageIndex !== -1) {
        // 更新临时记录，添加图片URL
        const imageUrl = data.imageUrl
        generatedImages.value[tempImageIndex] = {
          ...generatedImages.value[tempImageIndex],
          url: imageUrl,
          description: data.description,
        }
        console.log('已更新图片记录:', generatedImages.value[tempImageIndex])
        
        // 取出队列中的第一个Promise并解析（图片类型）
        if (pendingPromises.value.length > 0) {
          const pendingItem = pendingPromises.value.shift()
          if (pendingItem && pendingItem.type === 'image') {
            pendingItem.resolve({ imageUrl })
          }
        }
      }
    }
    
    // 处理视频生成响应
    if (data.videoUrl) {
      // 找到第一个videoUrl为null的图片记录
      const tempVideoIndex = generatedImages.value.findIndex(img => img.url && !img.videoUrl)
      
      if (tempVideoIndex !== -1) {
        // 更新记录，添加视频URL
        const videoUrl = data.videoUrl
        generatedImages.value[tempVideoIndex] = {
          ...generatedImages.value[tempVideoIndex],
          videoUrl: videoUrl,
        }
        console.log('已更新视频记录:', generatedImages.value[tempVideoIndex])
        
        // 取出队列中的第一个Promise并解析（视频类型）
        if (pendingPromises.value.length > 0) {
          const pendingItem = pendingPromises.value.shift()
          if (pendingItem && pendingItem.type === 'video') {
            pendingItem.resolve({ videoUrl })
          }
        }
      }
    }
  } catch (error) {
    console.error('解析消息失败:', error)
  }
}

// 下载图片功能
const downloadImage = async (url, filename) => {
  try {
    console.log(`开始下载图片: ${url}, 文件名: ${filename}`)
    
    // 使用fetch获取图片数据，解决跨域问题
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    // 创建一个a标签
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename || 'image.png'
    
    // 触发点击事件
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理blob URL
    window.URL.revokeObjectURL(blobUrl)
    
    console.log(`图片下载成功: ${filename}`)
  } catch (error) {
    console.error('下载图片失败:', error)
    // 如果fetch方式失败，尝试直接使用链接打开
    window.open(url, '_blank')
  }
}

// 下载视频功能
const downloadVideo = async (url, filename) => {
  try {
    console.log(`开始下载视频: ${url}, 文件名: ${filename}`)
    
    // 使用fetch获取视频数据，解决跨域问题
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    // 创建一个a标签
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename || 'video.mp4'
    
    // 触发点击事件
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理blob URL
    window.URL.revokeObjectURL(blobUrl)
    
    console.log(`视频下载成功: ${filename}`)
  } catch (error) {
    console.error('下载视频失败:', error)
    // 如果fetch方式失败，尝试直接使用链接打开
    window.open(url, '_blank')
  }
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

.video-preview {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin-top: 10px;
}
</style>