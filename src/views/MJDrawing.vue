<template>
  <div class="view-container">
    <!-- 内容区域 -->
    <div class="content">
      <!-- 生成的图片展示区域 -->
      <div class="scrollable-content">
        <div class="image-display" v-if="generatedImages.length > 0">
          <div class="message-group" v-for="(image, index) in generatedImages" :key="index">
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
                <img :src="image.url" :alt="'生成图片 ' + (index + 1)" />
                <!-- <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2FO1CN01JIwhKu1Bs319GOBwE_%21%210-0-cib.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1768186848&t=d9a63a0a1b717aeb22faa3150adcaa7b" :alt="'生成图片 ' + (index + 1)" /> -->
                
                <div class="image-actions">
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

// 响应式状态
const prompt = ref('')
const generatedImages = ref([])
// const currentMode = ref('text')
// const instance = getCurrentInstance();
// const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091 

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

// 修改handleSubmit函数
const handleSubmit = async () => {
  console.log("prompt33:--", prompt)

  // 先检查是否已授权
  const authorized = localStorage.getItem('isAuthorized');
  if (authorized !== 'true') {
    showPasswordModal.value = true;
    return; // 未授权时显示弹窗并终止函数执行
  }

  if (!prompt.value.trim()) return

  const message = JSON.stringify({'msg': prompt.value.trim(), 'userId': 'lyc2', 'targetUserId': 'user_py_llm', 'action': 'flux-midjourney-mix2-lora'});
  eventBus.emit('websocket-MJDrawing', message);
  prompt.value = '' // 清空输入框
}

const handleMessage = (data) => { 
  console.log('MJDrawing 收到 WebSocket 消息:', data)
  try {
      // 解析 JSON 字符串为对象
    // const parsedData = JSON.parse(data)
    console.log('MJDrawing 收到 imageUrl:', data.imageUrl)
  //  resultImage.value = "http://120.27.130.190:8091/api/files/download/12e927bc-7b6a-47c4-92a4-44d43c960bbf_tmptj_v5o71.png" 
    // const parsedData = JSON.parse(data)
    // if (parsedData.imageUrl) {
      generatedImages.value.push({
      url: data.imageUrl,        // 假设后端返回的图片URL字段为imageUrl
      // url:  "http://120.27.130.190:8091/api/files/download/12e927bc-7b6a-47c4-92a4-44d43c960bbf_tmptj_v5o71.png" ,     
      description: data.description, // 假设后端返回的描述字段为description
      timestamp: Date.now(),
      prompt: prompt.value
    })
    // }
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