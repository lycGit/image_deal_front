<template>
  <div class="view-container">
    <!-- 内容区域 -->
    <div class="content">
      <!-- 生成的图片展示区域 -->
      <div class="scrollable-content">
        <div class="image-display" v-if="generatedImages.length > 0">
          <div class="message-group" v-for="(image, index) in generatedImages" :key="image.id || index">
            <div class="message-header">
              <div class="bot-info">
                <img src="@/assets/downloaded-image.png"  alt="Bot Avatar" class="bot-avatar" />
                <span class="bot-name">Midjourney Bot</span>
                <span class="message-time">{{ formatTime(image.timestamp) }}</span>
              </div>
              <div class="prompt-text">{{ image.prompt }}</div>
            </div>
            <div class="image-grid">
              <div class="image-item">
                <!-- 图片加载中显示占位符 -->
                <img v-if="image.url" :src="image.url" :alt="'生成图片 ' + (index + 1)" />
                <div v-else class="image-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>图片生成中...</span>
                </div>
                <!-- <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2FO1CN01JIwhKu1Bs319GOBwE_%21%210-0-cib.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1768186848&t=d9a63a0a1b717aeb22faa3150adcaa7b" :alt="'生成图片 ' + (index + 1)" /> -->
                
                <div class="image-actions" v-if="image.url">
                  <button class="action-button">
                    <i class="fas fa-download"></i>
                  </button>
                  <button class="action-button">
                    <i class="fas fa-heart"></i>
                  </button>
                  <button class="action-button">
                    <i class="fas fa-share"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- 空状态提示 -->
        <div class="empty-state" v-else>
          <i class="fas fa-paint-brush empty-icon"></i>
          <p>输入提示词开始创作</p>
        </div>
      </div>
          <PasswordModal
            :show-modal="showPasswordModal"
            @close="closePasswordModal"
            @success="handleAuthorizeSuccess"
          />
    </div>

    <!-- 固定在底部的输入框 -->
    <div class="prompt-box-container">
      <!-- <div class="mode-switch">
        <button 
          class="mode-button active"
          @click="switchMode('text')"
        >
          文生图
        </button>
        <button 
          class="mode-button"
          @click="switchMode('image')"
        >
          图生图
        </button>
      </div> -->
      <div class="prompt-box">
        <div class="prompt-input">
          <input 
            type="text" 
            v-model="prompt"
            placeholder="请输入提示词,支持中文、英文" 
            @keyup.enter="handleEnter"
          />
          <div class="input-actions">
            <!-- <button class="action-icon">
              <i class="fas fa-sliders-h"></i>
            </button> -->
            <!-- <button class="action-icon">
              <i class="fas fa-sync-alt"></i>
            </button> -->
            <button class="send-button" @click="handleSubmit">
              绘画 <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

// 在script部分导入PasswordModal组件
<script setup>
import { ref , onMounted, onUnmounted } from 'vue'
import eventBus from '../eventBus'
import PasswordModal from '../components/PasswordModal.vue'; // 添加这行导入
import { getRemainingPoints, getExchangeCode, setRemainingPoints, consumePoints, getValidDays, getObtainedTime } from '../js/localStorageUtil'; // 导入获取剩余积分、兑换码、设置剩余积分和消耗积分的方法
import { getConfigValue } from '../js/configUtil'; // 导入获取配置值的方法
import { getUserId } from '../js/userIdUtil'; // 导入用户ID工具
import { createDeepSeekApi } from '../js/deepseekApiUtil'; // 导入DeepSeek API工具类

// 响应式状态
const prompt = ref('')
const generatedImages = ref([])
// const currentMode = ref('text')
// const instance = getCurrentInstance();
// const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091 

// 获取用户ID
const userId = getUserId();

// 方法
// const switchMode = (mode) => {
//   currentMode.value = mode
// }

const handleEnter = () => {
  handleSubmit()
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 发送绘画请求
const handleSubmit = async () => {
  console.log("prompt33:--", prompt)
  if (!prompt.value.trim()) return
  
  // 检查剩余积分
  const remainingPoints = getRemainingPoints();
  // 从配置中获取TEXT_TO_IMAGE的积分消耗值
  const textToImagePoints = Number(getConfigValue('TEXT_TO_IMAGE')) || 5; // 默认值为5
  if (!remainingPoints || remainingPoints < textToImagePoints) {
    alert('积分余额不足，需要至少' + textToImagePoints + '积分才能生成图片, 请输入兑换码充值积分');
    return; // 积分不足时终止函数执行
  }
  // 获取有效天数
  const validDays = getValidDays();
  // 获取获取时间
  const obtainedTime = getObtainedTime();
  // 检查有效天数
  if (validDays && validDays > 0 && obtainedTime) {
    // 将obtainedTime转换为Date对象
    const obtainedDate = new Date(obtainedTime);
    // 获取当前时间
    const currentDate = new Date();
    // 计算差值（毫秒）
    const diffMilliseconds = currentDate - obtainedDate;
    // 转换为天数（精确到秒）
    const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);
    // 如果差值大于有效天数，则提示过期
    if (diffDays > validDays) {
      alert('兑换码已过期，请重新购买');
      return; // 兑换码已过期时终止函数执行
    }
  } else if (!validDays || validDays <= 0) {
    alert('兑换码无效，请重新输入');
    return; // 兑换码已过期时终止函数执行
  }

  console.log("remainingPoints--",textToImagePoints);
  // 消耗积分
  const points = textToImagePoints; // 消耗的积分值，现在从配置中获取
  // 不阻塞用户使用
  consumePoints(points);

  // 点击提交后立即将prompt添加到显示列表中
  const originalPrompt = prompt.value.trim();
  let currentPrompt = originalPrompt;
  const tempImageId = Date.now(); // 使用时间戳作为临时ID
  
  // 添加临时图片记录，包含原始prompt但没有图片URL
  generatedImages.value.push({
    id: tempImageId,
    url: null,
    description: '',
    timestamp: Date.now(),
    prompt: originalPrompt // 显示原始提示词
  });
  
  // 调用DeepSeek API优化提示词
  try {
    // 从环境变量获取API密钥
    const apiKey = 'sk-bea5f7598f4a4c7195fe0063779e6f64';
    if (apiKey) {
      const deepseekApi = createDeepSeekApi(apiKey);
      
      // 自定义请求选项
      const options = {
        model: 'deepseek-chat',
        maxTokens: 1000,
        temperature: 0.8
      };
      
      // 发送提示词优化请求
      const optimizationPrompt = `请将以下中文绘画提示词参考
cute anime girl with massive fluffy fennec ears and a big fluffy tail
blonde messy long hair blue eyes wearing a maid outfit with a long black
 gold leaf pattern dress and a white apron mouth open placing a fancy
 black forest cake with candles on top of a dinner table of an old dark
 Victorian mansion lit by candlelight with a bright window to the foggy
 forest and very expensive stuff everywhere there are paintings on the walls
这个样式和结构优化为更专业、更详细的英文绘画提示词，适合AI图像生成：${originalPrompt}，
同时只需要返回最佳的一个优化后的英文提示词结果就行，不要返回改写说明等对于生成图片无用的内容`;
      const optimizedResult = await deepseekApi.chat(optimizationPrompt, options);
      
      console.log('DeepSeek API优化提示词结果:', optimizedResult);
      // 更新为优化后的提示词
      currentPrompt = optimizedResult;
    }
  } catch (error) {
    console.error('提示词优化失败:', error);
    // 优化失败不影响原有功能，继续使用原始提示词
  }
  
  // 使用优化后的提示词发送websocket消息
  const message = JSON.stringify({'msg': currentPrompt, 'userId': userId, 'targetUserId': 'user_py_llm', 'action': 'text2image', 'tempId': tempImageId});
  eventBus.emit('websocket-MJDrawing', message);
  prompt.value = '' // 清空输入框
};

const handleMessage = (data) => { 
  console.log('MJDrawing 收到 WebSocket 消息:', data)
  try {
    console.log('MJDrawing 收到 imageUrl:', data.imageUrl)
    
    // 查找临时图片记录
    // 优先使用tempId查找
    let tempImageIndex = generatedImages.value.findIndex(img => img.id === data.tempId);
    
    // 如果没有找到tempId，尝试通过其他方式匹配
    if (tempImageIndex === -1) {
      // 查找最近添加的无URL的图片记录
      tempImageIndex = generatedImages.value.findLastIndex(img => !img.url);
    }
    
    if (tempImageIndex !== -1) {
      // 更新临时记录，添加图片URL
      generatedImages.value[tempImageIndex] = {
        ...generatedImages.value[tempImageIndex],
        url: data.imageUrl,
        description: data.description,
      };
      console.log('已更新临时图片记录:', generatedImages.value[tempImageIndex]);
    } else {
      // 如果没有找到临时记录（可能是直接从后端推送的消息），则添加新记录
      console.warn('未找到临时图片记录，创建新记录:', data);
      generatedImages.value.push({
        id: Date.now(),
        url: data.imageUrl,
        description: data.description,
        timestamp: Date.now(),
        prompt: data.prompt || '提示词不能为空'
      });
    }
  } catch (error) {
    console.error('解析消息失败，数据不是有效的 JSON 字符串:', error)
  }
}

onMounted(() => { 
  console.log('MJDrawing onMounted') 
  eventBus.on('websocket-message', handleMessage) 
})

onUnmounted(() => { 
  console.log(' MJDrawing onUnmounted') 
  eventBus.off('websocket-message', handleMessage) 
})

const showPasswordModal = ref(false);

// const openPasswordModal = () => {
//   showPasswordModal.value = true;
// };

const closePasswordModal = () => {
  showPasswordModal.value = false;
};

const handleAuthorizeSuccess = () => {
  // 授权成功后的操作
  console.log('授权成功，可以执行需要权限的操作了');
};

</script>

<style scoped>
.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.prompt-box-container {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  background-color: #1e1f22;
  padding: 16px 20px;
  z-index: 10;
  border-radius: 8px;
  margin: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.prompt-input {
  display: flex;
  gap: 12px;
  align-items: center;
  background-color: #313338;
  border-radius: 6px;
  padding: 8px 12px;
}

.prompt-input input {
  flex: 1;
  background: none;
  border: none;
  padding: 8px;
  color: #ffffff;
  font-size: 14px;
}

.prompt-input input:focus {
  outline: none;
}

.input-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.mode-switch {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
}

.mode-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.send-button {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 140px 20px;
}

.message-group {
  margin-bottom: 32px;
  background-color: #1e1f22;
  border-radius: 8px;
  overflow: hidden;
}

.message-header {
  padding: 16px;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.bot-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ffffff;
  object-fit: contain;
  padding: 2px;
}

.bot-name {
  color: #ffffff;
  font-weight: 500;
}

.message-time {
  color: #8e9297;
  font-size: 12px;
}

.prompt-text {
  color: #dcddde;
  font-size: 14px;
  line-height: 1.4;
}

.image-grid {
  padding: 0 16px 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 修改为4列 */
  gap: 12px;  /* 减小间距 */
}

.image-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;  /* 添加宽高比 */
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 图片加载中样式 */
.image-loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #2b2d31;
  color: #8e9297;
  font-size: 14px;
}

.image-loading i {
  font-size: 24px;
  margin-bottom: 8px;
  color: #4776e6;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8e9297;
  padding: 24px;
}

.empty-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>