<template>
  <div class="view-container">
    <div class="header">AI抠图</div>
    
    <div class="main-content">
      <div class="image-section">
        <!-- 原图区域 -->
        <div class="image-container">
          <div class="title">原图片</div>
          <div 
            class="upload-area" 
            @click="triggerUpload" 
            @dragover.prevent 
            @drop="handleDrop"
          >
            <input 
              type="file" 
              ref="fileInput" 
              class="hidden" 
              @change="handleFileChange" 
              accept="image/*" 
            />
            <div v-if="!originalImage" class="upload-placeholder">
              <div class="upload-icon">+</div>
              <div class="upload-text">点击或拖拽上传图片</div>
            </div>
            <img v-else :src="originalImage" class="preview-image" alt="原图" />
          </div>
        </div>

        <!-- 抠图结果区域 -->
        <div class="image-container">
          <div class="title">抠图后</div>
          <div class="result-area">
            <img v-if="resultImage" :src="resultImage" class="preview-image" alt="结果图" />
            <div v-else class="placeholder">
              等待处理结果...
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-buttons">
        <button class="primary-button" @click="startProcess" :disabled="!canProcess">
          开始抠图
        </button>
        <button class="secondary-button" @click="downloadResult" :disabled="!resultImage">
          无水印下载
        </button>
      </div>
    </div>

    <!-- 右侧作品展示区 -->
    <div class="gallery">
      <div class="gallery-header">
        <span class="active">我的作品</span>
        <span>我的收藏</span>
      </div>
      <div class="gallery-content">
        <div v-if="processedImages.length > 0" class="processed-images">
          <div v-for="image in processedImages" :key="image.id" class="gallery-item">
            <img :src="image.url" alt="处理后的图片" />
            <div class="item-actions">
              <button class="action-btn">×</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          已加载完毕
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue';

const fileInput = ref(null)
const originalImage = ref(null)
const resultImage = ref(null)
const processedImages = ref([])

const canProcess = computed(() => !!originalImage.value)
const instance = getCurrentInstance();
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091 

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
    originalImage.value = e.target.result
    resultImage.value = null
  }
  reader.readAsDataURL(file)
}

const startProcess = async () => {
  if (!originalImage.value) {
    alert('请先上传图片')
    return
  }

  try {
    // 创建 FormData 对象
    const formData = new FormData()
    
    // 将 base64 图片转换为 Blob
    const base64Data = originalImage.value.split(',')[1]
    const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())
    formData.append('file', blob, 'image.jpg')
    
    // 添加其他参数
    formData.append('category', 'AI_MATTING')
    formData.append('description', '抠图处理')
    const response = await fetch(`${baseUrl}/api/files/upload`, {
      // const response = await fetch(`http://120.27.130.190:8091/api/files/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    const result = await response.json()
    console.log('处理成功:', result)
    
    // 显示处理后的图片
    resultImage.value = result.imageUrl // 假设返回的数据中包含处理后的图片URL
    
    // 添加到处理记录
    processedImages.value.unshift({
      id: Date.now(),
      url: result.imageUrl
    })

  } catch (error) {
    console.error('处理失败:', error)
    alert('处理失败，请重试')
  }
}

const downloadResult = () => {
  if (!resultImage.value) return
  
  // 创建一个临时的a标签来下载图片
  const link = document.createElement('a')
  link.href = resultImage.value
  link.download = `抠图结果_${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.view-container {
  display: flex;
  gap: 24px;
  background-color: #1a1b1e;
  height: 100vh;
  color: #ffffff;
}

.header {
  font-size: 24px;
  color: #4776E6;
  font-weight: 500;
  margin-bottom: 24px;
}

.main-content {
  flex: 1;
  padding: 24px;
}

.image-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.image-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 16px;
  color: #8e9297;
}

.upload-area, .result-area {
  height: 400px;
  border: 2px dashed #40444b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #2f3136;
}

.upload-area:hover {
  border-color: #4776E6;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 32px;
  color: #8e9297;
  margin-bottom: 8px;
}

.upload-text {
  color: #8e9297;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.primary-button, .secondary-button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
}

.secondary-button {
  background: #2f3136;
  color: white;
  border: 1px solid #40444b;
}

.primary-button:disabled, .secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gallery {
  width: 300px;
  border-left: 1px solid #2f3136;
  padding: 24px;
}

.gallery-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.gallery-header span {
  color: #8e9297;
  cursor: pointer;
}

.gallery-header span.active {
  color: #4776E6;
}

.gallery-content {
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.processed-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
}

.item-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}

.action-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  color: #8e9297;
  padding: 24px;
}

.hidden {
  display: none;
}
</style>