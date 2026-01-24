<template>
  <div class="view-container">
    <div class="left-panel">
      <div class="header">AI绘画</div>
      
      <!-- 创意描述输入区域 -->
      <div class="section">
        <div class="section-title">创意描述</div>
        <div class="input-wrapper">
          <textarea
            v-model="prompt"
            placeholder="请输入创意描述"
            :maxlength="500"
          ></textarea>
          <div class="word-count">{{ prompt.length }}/500</div>
        </div>
      </div>
    
      <!-- 参考图片上传区域 -->
      <div class="section">
        <div class="section-title">参考图/热图</div>
        <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
          <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
          <div class="upload-content" v-if="!referenceImage">
            <div class="upload-icon">+</div>
            <div class="upload-text">点击/拖拽图片,高宽不小于300px</div>
          </div>
          <img v-else :src="referenceImage" class="reference-image" alt="参考图片" />
        </div>
      </div>
    
      <!-- 参数设置区域 -->
      <!-- <div class="section">
        <div class="section-title">参数设置</div>
        <div class="ratio-grid">
          <button 
            v-for="ratio in ratios" 
            :key="ratio.value"
            class="ratio-button"
            :class="{ active: selectedRatio === ratio.value }"
            @click="selectRatio(ratio.value)"
          >
            {{ ratio.label }}
          </button>
        </div>
      </div> -->
    
      <!-- 生成按钮 -->
      <button 
        class="generate-button"
        :disabled="!canGenerate"
        @click="handleGenerate"
      >
        <span v-if="!loading">开始生成</span>
        <span v-else>生成中...</span>
      </button>
    </div>
    
    <!-- 添加右侧展示区域 -->
    <div class="right-panel">
      <!-- <div class="top-bar">
        <div class="status-text">没有更多了</div>
        <div class="actions">
          <button class="action-button">案例</button>
          <button class="action-button">我的作品</button>
          <button class="action-button">下载</button>
        </div>
      </div> -->
      
      <div class="gallery">
        <!-- 加载中状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">图片生成中，大约需要30秒，请稍候...</div>
        </div>
        
        <!-- 生成结果 -->
        <div v-else>
          <div v-for="(item, index) in generatedItems" :key="index" class="image-group">
            <div class="group-title">
              <span class="item-index">{{ index + 1 }}</span>
              {{ item.description }}
            </div>
            <div class="image-container">
              <div class="image-wrapper">
                <img :src="item.url" :alt="item.description" />
                <!-- 下载按钮 -->
                <div class="image-actions">
                  <button class="download-button" @click="downloadImage(item.url, item.description)">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
                <!-- <div class="image-actions">
                  <button class="image-action">垫图</button>
                  <button class="image-action">生成视频</button>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import eventBus from '../eventBus'
import { getRemainingPoints, consumePoints } from '../js/localStorageUtil'; // 导入获取剩余积分和消耗积分的方法
import { getConfigValue } from '../js/configUtil'; // 导入获取配置值的方法
import { getUserId } from '../js/userIdUtil'; // 导入用户ID工具
import { showAlert } from '../js/alertUtil'; // 导入公共弹窗工具类

const prompt = ref('')
const referenceImage = ref(null)
const fileInput = ref(null)
const selectedRatio = ref('1:1')
const instance = getCurrentInstance();
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091

// 获取用户ID
const userId = getUserId();

const ratios = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '3:2', value: '3:2' },
  { label: '2:3', value: '2:3' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' }
]

// 添加loading状态管理
const loading = ref(false)
const generatedItems = ref([])

// 本地存储键名
const STORAGE_KEY = 'kl_drawing_generated_items'
const MAX_ITEMS = 10

// 从本地存储加载数据
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      generatedItems.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('从本地存储加载数据失败:', error)
  }
}

// 保存到本地存储
const saveToStorage = () => {
  try {
    // 确保只保存最新的MAX_ITEMS张图片
    if (generatedItems.value.length > MAX_ITEMS) {
      generatedItems.value = generatedItems.value.slice(0, MAX_ITEMS)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generatedItems.value))
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

// 计算是否可以生成图片
const canGenerate = computed(() => prompt.value.trim().length > 0 && referenceImage.value && !loading.value)

const selectRatio = (ratio) => {
  selectedRatio.value = ratio
}

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) handleFile(file)
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) handleFile(file)
}

const handleFile = (file) => {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (e) => {
    referenceImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleGenerate = async () => {
  if (!canGenerate.value) return  
  
  // 检查剩余积分
  const remainingPoints = getRemainingPoints();
  // 从配置中获取IMAGE_TO_IMAGE的积分消耗值
  const imageToImagePoints = Number(getConfigValue('IMAGE_TO_IMAGE')) || 5; // 默认值为5
  
  if (!remainingPoints || remainingPoints < imageToImagePoints) {
    showAlert('积分余额不足，需要至少' + imageToImagePoints + '积分才能生成图片, 请输入兑换码充值积分');
    return; // 积分不足时终止函数执行
  }
  
  // 消耗积分
  const points = imageToImagePoints; // 消耗的积分值，现在从配置中获取
  consumePoints(points);

  try {
    // 设置loading状态
    loading.value = true
    
    // 创建 FormData 对象
    const formData = new FormData()
    let uploadedImageUrl = null
    
    // 如果有参考图片，添加到 formData
    if (referenceImage.value) {
      const base64Data = referenceImage.value.split(',')[1]
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())
      formData.append('file', blob, 'reference.jpg')
      uploadedImageUrl = URL.createObjectURL(blob)
    }
    
    // 添加其他参数
    formData.append('description', prompt.value)
    formData.append('category', 'KL_DRAWING')
    formData.append('tags', selectedRatio.value)

    const response = await fetch(`${baseUrl}/api/files/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    // const result = await response.text()
    const result = await response.json()
    console.log('上传成功:', result)
    console.log('上传图片地址:', uploadedImageUrl)
    const message = JSON.stringify({'msg': prompt.value, 'imageUrl': result.imageUrl1,  'userId': userId, 'targetUserId': 'user_py_llm', 'action': 'image_edit'});
    eventBus.emit('websocket-Image2Image', message);

    // 添加到生成记录
    // generatedItems.value.unshift({
    //   url: uploadedImageUrl || '/placeholder-image.png', // 如果没有上传图片则使用占位图
    //   description: prompt.value,
    //   timestamp: Date.now()
    // })

    // 清空输入
    // prompt.value = ''
    // referenceImage.value = null

  } catch (error) {
    console.error('生成失败:', error)
    showAlert('生成失败，请重试')
    loading.value = false
  }
}

const handleMessage = (data) => { 
  console.log('收到 WebSocket 消息:', data)
  try {
    if (data.imageUrl) {
      // 添加到生成记录
      generatedItems.value.unshift({
        url: data.imageUrl || '/placeholder-image.png', // 如果没有上传图片则使用占位图
        description: prompt.value,
        timestamp: Date.now()
      })
      // 保存到本地存储
      saveToStorage()
    }
  } catch (error) {
    console.error('解析消息失败，数据不是有效的 JSON 字符串:', error)
  } finally {
    // WebSocket消息处理完成后，确保loading状态为false
    loading.value = false
  }
}

// 下载图片函数
const downloadImage = async (imageUrl, description) => {
  try {
    // 创建下载链接
    const link = document.createElement('a')
    link.href = imageUrl
    // 使用描述作为文件名，替换特殊字符，添加时间戳确保唯一性
    const fileName = `${description.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_${Date.now()}.jpg`
    link.download = fileName
    // 触发下载
    document.body.appendChild(link)
    link.click()
    // 清理
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载图片失败:', error)
    showAlert('下载失败，请重试')
  }
}

onMounted(() => { 
  console.log(' WebSocket onMounted') 
  // 从本地存储加载数据
  loadFromStorage()
  eventBus.on('websocket-message', handleMessage) 
})

onUnmounted(() => { 
  console.log(' WebSocket onUnmounted') 
  eventBus.off('websocket-message', handleMessage) 
})
</script>

<style scoped>
.view-container {
  height: 100%;
  background-color: #1a1b1e;
  display: flex;
}

/* 调整左侧面板布局，确保按钮始终可见 */
.left-panel {
  width: 33.333%;
  padding: 24px;
  border-right: 1px solid #2f3136;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 100vh;
  overflow-y: auto;
}

.header {
  font-size: 24px;
  color: #4776E6;
  font-weight: 500;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 14px;
  color: #8e9297;
}

.input-wrapper {
  position: relative;
}

textarea {
  width: 100%;
  height: 240px;
  background-color: #2f3136;
  border: 1px solid #40444b;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: #4776E6;
}

.word-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 12px;
  color: #8e9297;
}

/* 修改上传区域样式，限制最大高度 */
.upload-area {
  background-color: #2f3136;
  border: 1px dashed #40444b;
  border-radius: 8px;
  min-height: 150px;
  max-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  padding: 16px;
}

.upload-area:hover {
  border-color: #4776E6;
}

.upload-content {
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 150px;
}

.upload-icon {
  font-size: 24px;
  color: #8e9297;
}

.upload-text {
  color: #8e9297;
  font-size: 14px;
}

.reference-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 260px;
  object-fit: contain;
}

.ratio-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ratio-button {
  background-color: #2f3136;
  border: 1px solid #40444b;
  padding: 12px 8px;
  border-radius: 8px;
  color: #8e9297;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.ratio-button:hover {
  border-color: #4776E6;
}

.ratio-button.active {
  background-color: #4776E6;
  border-color: #4776E6;
  color: #ffffff;
}

/* 确保生成按钮始终在底部并保持间距 */
.generate-button {
  margin-top: auto;
  margin-bottom: 44px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
  flex-shrink: 0;
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hidden {
  display: none;
}

/* 美化下载按钮样式 */
.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(71, 118, 230, 0.3);
}

.action-button:active {
  transform: translateY(0);
}

.right-panel {
  flex: 1;
  height: 100vh;
  padding: 20px;
  padding-bottom: 64px; /* 增加底部内边距，确保内容距离页面底部44px */
  overflow-y: auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-text {
  color: #8e9297;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 44px; /* 直接添加底部margin，确保距离页面底部44px */
}

/* 加载中状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(71, 118, 230, 0.2);
  border-left: 4px solid #4776E6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #8e9297;
  font-size: 16px;
}

.image-group {
  min-height: calc(33.333vh - 20px);
  background-color: #2a2c34;
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;  /* 添加动画效果 */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.group-title {
  padding: 16px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #40444b;
}

/* 修改复制图标样式为序号样式 */
.item-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background-color: #4776E6;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 2px;
  margin-right: 8px;
}

.copy-icon {
  width: 16px;
  height: 16px;
  background-color: #8e9297;
  border-radius: 2px;
  margin-right: 8px;
  display: inline-block;
}

.image-container {
  padding: 16px;
  display: flex;
  justify-content: center;
}

/* 修改右侧图片展示样式，确保完整展示 */
.image-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;  /* 修改为100%，增加一倍宽度 */
  max-width: 800px;  /* 增加最大宽度 */
  margin: 0 auto;
  padding: 8px;  /* 减少内边距 */
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  max-height: 600px;
}

/* 图片操作按钮样式 */
.image-actions {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 12px;
}

.download-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: rgba(71, 118, 230, 0.9);
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.4);
  z-index: 10;
}

.download-button:hover {
  background-color: rgba(59, 98, 204, 1);
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(71, 118, 230, 0.6);
}

.download-button:active {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(71, 118, 230, 0.5);
}
</style>