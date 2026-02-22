<template>
  <div class="view-container">
    <div class="left-panel">
      <div class="header">头像模板选择</div>

      <!-- 头像选择区域 -->
      <div class="section">
        <div class="avatar-selection">
          <!-- 男性头像区域 -->
          <div class="avatar-section">
            <div class="avatar-section-title">男性证件照模板</div>
            <div class="avatar-grid male-avatars">
              <div 
                v-for="(avatar, index) in artPhotos" 
                :key="'male-' + index"
                class="avatar-item"
                :class="{ active: selectedAvatarImage === avatar.image }"
                @click="selectAvatar(avatar.prompt1, avatar.image, avatar.description)"
              >
                <img :src="avatar.image" :alt="avatar.description" />
                <!-- <img src="/images/headerTemplate/male-1.jpg" :alt="avatar.description" /> -->
                <div class="avatar-tooltip">{{ avatar.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <!-- 参考图片上传区域 -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">参考图/热图</div>
        </div>
        <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
          <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
          <div class="upload-content" v-if="!referenceImage">
            <div class="upload-icon">+</div>
            <div class="upload-text">点击/拖拽图片,高宽不小于300px</div>
          </div>
          <img v-else :src="referenceImage" class="reference-image" alt="参考图片" />
        </div>
      </div>
    
    
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
      <!-- 顶部栏 -->
      <div class="top-bar">
        <div class="right-buttons">
          <button class="top-button redeem-button" @click="openModal">输入兑换码</button>
        </div>
      </div>
      
      <div class="gallery">
        <!-- 加载中状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">图片生成中，大约耗时20~40秒，请稍候...</div>
          <div class="loading-text">{{ currentLoadingMessage }}</div>
        </div>
        
        <!-- 空状态提示 -->
        <div v-else-if="generatedItems.length === 0" class="empty-state">
          <div class="empty-icon">📸</div>
          <div class="empty-title">还没有生成图片</div>
          <div class="empty-description">
            <p>请按照以下步骤生成您的证件照：</p>
            <ul class="empty-steps">
              <li>1. 选择您喜欢的头像模板</li>
              <li>2. 选择证件照背景颜色</li>
              <li>3. 上传参考图片</li>
              <li>4. 点击"开始生成"按钮</li>
            </ul>
          </div>
        </div>
        
        <!-- 生成结果 -->
        <div v-else>
          <div v-for="(item, index) in generatedItems" :key="index" class="image-group">
            <div class="group-title">
              <span class="item-index">{{ index + 1 }}</span>
              {{ item.title }}
            </div>
            <div class="image-container">
              <div class="image-wrapper">
                <img :src="item.url" :alt="item.description" />
                <!-- 下载和裁剪按钮 -->
                <div class="image-actions">
                  <button class="download-button" @click="downloadImage(item.url, item.description)">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 引入密码弹窗组件 -->
  <PasswordModal
    :show-modal="showPasswordModal"
    @close="closeModal"
    @success="handleAuthorizeSuccess"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import eventBus from '../eventBus'
import { getRemainingPoints, consumePoints } from '../js/localStorageUtil'; // 导入获取剩余积分和消耗积分的方法
import { getConfigValue } from '../js/configUtil'; // 导入获取配置值的方法
import { getUserId } from '../js/userIdUtil'; // 导入用户ID工具
import { showAlert } from '../js/alertUtil'; // 导入公共弹窗工具类
import PasswordModal from '../components/PasswordModal.vue'; // 导入密码弹窗组件
import artPhotoData from '../config/artPhoto.json'; // 导入男性头像配置数据


// 弹窗状态
const showPasswordModal = ref(false);

const prompt = ref('')
const referenceImage = ref(null)
const fileInput = ref(null)
const selectedRatio = ref('1:1')
const selectedAvatarImage = ref('') // 存储当前选中的头像图片URL
const selectedAvatarDescription = ref('') // 存储当前选中的头像描述
const instance = getCurrentInstance();
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091


// 获取用户ID
const userId = getUserId();

// 打开弹窗
const openModal = () => {
  showPasswordModal.value = true;
};

// 关闭弹窗
const closeModal = () => {
  showPasswordModal.value = false;
};

// 处理授权成功
const handleAuthorizeSuccess = () => {
  console.log('授权成功');
};

// 男性头像数据（从配置文件导入）
const artPhotos = ref(artPhotoData)

// 选择头像模板
const selectAvatar = (avatarPrompt, avatarImage, avatarDescription) => {
  prompt.value = avatarPrompt
  selectedAvatarImage.value = avatarImage
  selectedAvatarDescription.value = avatarDescription
}

// 添加loading状态管理
const loading = ref(false)
const generatedItems = ref([])

// 滚动文案配置
const loadingMessages = [
  '图片上传中...',
  '图片预处理中...',
  '意图理解中...',
  '条件生成...',
  '反思修正...'
]
const currentLoadingMessage = ref(loadingMessages[0])
let loadingMessageTimer = null
let loadingMessageIndex = 0
// 超时定时器
let timeoutTimer = null

// 本地存储键名
const STORAGE_KEY = 'headshot_drawing_generated_items'
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

// 打开图片裁剪页面

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


// 启动滚动文案
const startLoadingMessage = () => {
  loadingMessageIndex = 0
  currentLoadingMessage.value = loadingMessages[0]
  loadingMessageTimer = setInterval(() => {
    loadingMessageIndex = (loadingMessageIndex + 1) % loadingMessages.length
    currentLoadingMessage.value = loadingMessages[loadingMessageIndex]
  }, 10000) // 每10秒切换一次
}

// 停止滚动文案
const stopLoadingMessage = () => {
  if (loadingMessageTimer) {
    clearInterval(loadingMessageTimer)
    loadingMessageTimer = null
  }
}
const handleGenerate = async () => {
  if (!canGenerate.value) return  

    // 检查剩余积分
  const remainingPoints = getRemainingPoints();
  // 从配置中获取IMAGE_TO_IMAGE的积分消耗值
  const imageToImagePoints = Number(getConfigValue('HEADER_IMAGE')) || 5; // 默认值为5
  
  if (!remainingPoints || remainingPoints < imageToImagePoints) {
    showAlert('积分余额不足，需要至少' + imageToImagePoints + '积分才能生成图片, 请输入兑换码充值积分');
    return; // 积分不足时终止函数执行
  }
  
  try {
    // 设置loading状态
    loading.value = true
    // 启动滚动文案
    startLoadingMessage()    
    // 创建 FormData 对象
    const formData = new FormData()
    let uploadedImageUrl = null
    
    // 如果有参考图片，添加到 formData
    if (referenceImage.value) {
      // 先压缩图片到300KB以下
      const compressedImage = await compressImage(referenceImage.value, 300)
      const base64Data = compressedImage.split(',')[1]
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
    
    // 设置1分钟超时提示
    timeoutTimer = setTimeout(() => {
      if (loading.value) {
        showAlert('服务器繁忙，请稍后再试或刷新浏览器重试');
        stopLoadingMessage(); loading.value = false;
      }
    }, 120000); // 1分钟 = 60000毫秒

  } catch (error) {
    console.error('生成失败:', error)
    showAlert('生成失败，请重试')
    stopLoadingMessage(); loading.value = false
    // 清除超时定时器
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
    }
  }
}

const handleMessage = (data) => { 
  console.log('收到 WebSocket 消息:', data)
  try {
    if (data.imageUrl) {
      // 从配置中获取IMAGE_TO_IMAGE的积分消耗值
      const imageToImagePoints = Number(getConfigValue('HEADER_IMAGE')) || 5; // 默认值为5
       // 消耗积分
      const points = imageToImagePoints; // 消耗的积分值，现在从配置中获取
      consumePoints(points);
      // 添加到生成记录
      generatedItems.value.unshift({
        url: data.imageUrl || '/placeholder-image.png', // 如果没有上传图片则使用占位图
        description: prompt.value,
        title: selectedAvatarDescription.value, // 存储选中的头像模板description
        timestamp: Date.now()
      })

      // 保存到本地存储
      saveToStorage()
      
      // 预加载图片到浏览器缓存
    }
  } catch (error) {
    console.error('解析消息失败，数据不是有效的 JSON 字符串:', error)
  } finally {
    // WebSocket消息处理完成后，确保loading状态为false
    stopLoadingMessage(); loading.value = false
    // 清除超时定时器
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
  }
}

// 图片压缩函数
const compressImage = (imageUrl, maxSizeKB = 300) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous' // 允许跨域加载
      
      img.onload = () => {
        // 创建canvas元素
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // 检查图片尺寸，如果长或宽大于750，则按比例缩放到750以内
        let width = img.width
        let height = img.height
        const maxDimension = 750
        
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
          console.log(`图片尺寸从 ${img.width}x${img.height} 缩放到 ${width}x${height}`)
        }
        
        // 设置canvas尺寸为调整后的尺寸
        canvas.width = width
        canvas.height = height
        
        // 绘制图片到canvas
        ctx.drawImage(img, 0, 0, width, height)
        
        // 初始压缩质量
        let quality = 0.95
        let compressedDataUrl = ''
        
        // 循环压缩直到达到目标大小
        while (quality > 0.1) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
          
          // 计算数据URL的大小（大约）
          // 数据URL格式: data:image/jpeg;base64,[base64数据]
          // base64编码后的数据大小约为原始二进制大小的1.33倍
          const base64Data = compressedDataUrl.split(',')[1]
          const estimatedSizeKB = (base64Data.length * 3) / (4 * 1024) // 估算大小
          
          if (estimatedSizeKB <= maxSizeKB) {
            console.log(`图片压缩完成，压缩后大小约${estimatedSizeKB.toFixed(2)}KB，尺寸:${width}x${height}，质量:${quality.toFixed(2)}`)
            resolve(compressedDataUrl)
            return
          }
          
          // 降低质量继续压缩
          quality -= 0.1
        }
        
        // 如果质量低于0.1仍然过大，返回当前压缩结果
        console.log('图片压缩到最低质量:', (compressedDataUrl.split(',')[1].length * 3 / (4 * 1024)).toFixed(2), 'KB')
        resolve(compressedDataUrl)
      }
      
      img.onerror = (error) => {
        console.error('图片加载失败，无法压缩:', error)
        // 加载失败时返回原始图片URL
        resolve(imageUrl)
      }
      
      // 开始加载图片
      img.src = imageUrl
    } catch (error) {
      console.error('压缩图片失败:', error)
      // 发生错误时返回原始图片URL
      resolve(imageUrl)
    }
  })
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

/* 参考图/热图标题和提示按钮容器 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* 提示按钮样式 */
.hint-button {
  background-color: rgba(71, 118, 230, 0.1);
  border: 1px solid #FF9900;
  border-radius: 6px;
  color: #FF9900;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-button:hover {
  background-color: rgba(255, 153, 0, 0.2);
  transform: translateY(-1px);
}

.hint-button:active {
  transform: translateY(0);
}

/* 颜色选择区域样式 */
.color-selection {
  display: flex;
  gap: 16px;
  padding: 8px 0;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #2f3136;
  border: 2px solid #40444b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option:hover {
  border-color: #4776E6;
  transform: translateY(-2px);
}

.color-option.active {
  border-color: #4776E6;
  background-color: rgba(71, 118, 230, 0.1);
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #40444b;
  transition: all 0.3s ease;
}

.color-preview.white {
  background-color: #ffffff;
}

.color-preview.blue {
  background-color: #4A90E2;
}

.color-preview.red {
  background-color: #E74C3C;
}

.color-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
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

/* 头像选择区域样式 */
.avatar-selection {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

/* 自定义滚动条 */
.avatar-selection::-webkit-scrollbar {
  width: 6px;
}

.avatar-selection::-webkit-scrollbar-track {
  background: #2f3136;
  border-radius: 3px;
}

.avatar-selection::-webkit-scrollbar-thumb {
  background: #4776E6;
  border-radius: 3px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.avatar-section-title {
  font-size: 18px;
  color: #ffffff;
  font-weight: 500;
  padding-left: 4px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: min-content;
  gap: 12px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}

/* 头像网格的滚动条样式 */
.avatar-grid::-webkit-scrollbar {
  width: 6px;
}

.avatar-grid::-webkit-scrollbar-track {
  background: #2f3136;
  border-radius: 3px;
}

.avatar-grid::-webkit-scrollbar-thumb {
  background: #4776E6;
  border-radius: 3px;
}

.avatar-item {
  position: relative;
  aspect-ratio: 413/579;
  background-color: #2f3136;
  border: 2px solid #40444b;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-item:hover {
  border-color: #4776E6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.3);
}

.avatar-item.active {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.3);
  transform: translateY(-2px);
}

.avatar-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-tooltip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #ffffff;
  font-size: 12px;
  padding: 20px 8px 8px;
  text-align: center;
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* 移除hover显示逻辑，因为现在默认就显示 */
/* .avatar-item:hover .avatar-tooltip {
  opacity: 1;
} */

/* 为男性和女性头像添加不同的边框颜色 */
.male-avatars .avatar-item:hover {
  border-color: #00ff00;
}

.male-avatars .avatar-item.active {
  border-color: #00ff00;
  box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.3);
}

.female-avatars .avatar-item:hover {
  border-color: #ff0000;
}

.female-avatars .avatar-item.active {
  border-color: #ff0000;
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.3);
}

/* 头像选择区域的滚动条样式 */
.avatar-selection {
  scrollbar-width: thin;
  scrollbar-color: #4776E6 #2f3136;
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
  padding-bottom: 64px;
  overflow-y: auto;
}

.top-bar {
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  z-index: 1000;
}

.right-buttons {
  display: flex;
  gap: 10px;
}

.top-button {
  background: transparent;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.top-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.redeem-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.redeem-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.4);
}

.redeem-button:active {
  transform: translateY(0);
}

.status-text {
  color: #8e9297;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

.top-button {
  background: transparent;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
}

.top-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.redeem-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 6px;
}

.redeem-button:hover {
  opacity: 0.9;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 44px;
  flex: 1;
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
  animation: fadeIn 0.3s ease-in-out;
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 8px;
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

/* 裁剪按钮样式 */
.crop-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: #40444b;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-button:hover {
  background-color: #4776E6;
  transform: translateY(-2px);
}

.zoom-button:active {
  transform: translateY(0);
}

.cancel-button,
.confirm-button {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: #40444b;
  color: #ffffff;
}

.cancel-button:hover {
  background-color: #4a4d52;
}

.confirm-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
}

.confirm-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.4);
}

.confirm-button:active {
  transform: translateY(0);
}

/* 空状态样式 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b8c91;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.empty-title {
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 16px;
}

.empty-description {
  text-align: center;
  max-width: 500px;
}

.empty-description p {
  font-size: 14px;
  color: #b0b3b8;
  margin: 0 0 16px 0;
}

.empty-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  background-color: #363840;
  border-radius: 8px;
  padding: 20px;
}

.empty-steps li {
  font-size: 14px;
  color: #b0b3b8;
  padding: 8px 0;
  border-bottom: 1px solid #40444b;
}

.empty-steps li:last-child {
  border-bottom: none;
}

.empty-steps li::before {
  content: "✓";
  color: #4776E6;
  margin-right: 8px;
  font-weight: bold;
}

</style>