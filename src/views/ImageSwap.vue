<template>
  <div class="view-container">
    <div class="content">
      <div class="workspace">
        <!-- 左侧上传区域 -->
        <div class="left-panel">
          <!-- 源图片上传 -->
          <div class="upload-section">
            <h3>源图片</h3>
            <div class="upload-area" @click="triggerSourceUpload" @dragover.prevent @drop="handleSourceDrop">
              <input type="file" ref="sourceFileInput" class="hidden" @change="handleSourceFileChange" accept="image/*" />
              <div class="upload-content" v-if="!sourceImage">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>点击或拖拽上传图片</p>
                <span class="upload-tip">支持 jpg、png 格式</span>
              </div>
              <img v-else :src="sourceImage" class="preview-image" alt="源图片" />
            </div>
          </div>

          <!-- 目标图片上传 -->
          <div class="upload-section">
            <h3>目标图片</h3>
            <div class="upload-area" @click="triggerTargetUpload" @dragover.prevent @drop="handleTargetDrop">
              <input type="file" ref="targetFileInput" class="hidden" @change="handleTargetFileChange" accept="image/*" />
              <div class="upload-content" v-if="!targetImage">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>点击或拖拽上传图片</p>
                <span class="upload-tip">支持 jpg、png 格式</span>
              </div>
              <img v-else :src="targetImage" class="preview-image" alt="目标图片" />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-bar">
            <button class="reset-button" @click="resetUpload">
              <i class="fas fa-undo"></i>
              重新上传
            </button>
            <button 
              class="generate-button" 
              :disabled="isLoading || !canGenerate"
              @click="handleGenerate"
            >
              <i class="fas fa-magic"></i>
              开始生成
            </button>
          </div>
        </div>

        <!-- 右侧结果展示区域 -->
        <div class="right-panel" v-if="resultImage">
          <div class="result-container">
            <div class="result-header">
              <h3>生成结果</h3>
              <div class="result-actions">
                <button class="action-button" @click="handleDownload">
                  <i class="fas fa-download"></i>
                  下载
                </button>
                <button class="action-button" @click="handleShare">
                  <i class="fas fa-share"></i>
                  分享
                </button>
              </div>
            </div>
            <div class="result-preview">
              <img :src="resultImage" alt="换脸结果" />
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div class="empty-state" v-if="!sourceImage && !targetImage && !resultImage">
          <i class="fas fa-images empty-icon"></i>
          <p>上传源图片和目标图片开始换脸</p>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>正在进行智能换脸...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式状态
const sourceImage = ref(null)
const targetImage = ref(null)
const resultImage = ref(null)
const isLoading = ref(false)
const sourceFileInput = ref(null)
const targetFileInput = ref(null)

// 计算属性
const canGenerate = computed(() => {
  return sourceImage.value && targetImage.value
})

// 方法
const triggerSourceUpload = () => {
  sourceFileInput.value.click()
}

const triggerTargetUpload = () => {
  targetFileInput.value.click()
}

const handleSourceFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file, 'source')
  }
}

const handleTargetFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file, 'target')
  }
}

const handleSourceDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFile(file, 'source')
  }
}

const handleTargetDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFile(file, 'target')
  }
}

const handleFile = (file, type) => {
  if (!file.type.startsWith('image/')) {
    // TODO: 显示错误提示
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (type === 'source') {
      sourceImage.value = e.target.result
    } else {
      targetImage.value = e.target.result
    }
    resultImage.value = null // 清除之前的结果
  }
  reader.readAsDataURL(file)
}

const resetUpload = () => {
  sourceImage.value = null
  targetImage.value = null
  resultImage.value = null
  sourceFileInput.value.value = ''
  targetFileInput.value.value = ''
}

const handleGenerate = async () => {
  if (!canGenerate.value || isLoading.value) return
  
  isLoading.value = true
  try {
    // TODO: 调用实际的换脸 API
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟 API 调用
    
    // 模拟生成结果
    resultImage.value = targetImage.value // 这里应该是 API 返回的换脸结果
  } catch (error) {
    console.error('换脸失败:', error)
    // TODO: 显示错误提示
  } finally {
    isLoading.value = false
  }
}

const handleDownload = () => {
  if (!resultImage.value) return
  
  const link = document.createElement('a')
  link.href = resultImage.value
  link.download = `face-swap-${Date.now()}.png`
  link.click()
}

const handleShare = () => {
  if (!resultImage.value || !navigator.share) return
  
  navigator.share({
    title: '图片换脸结果',
    text: '查看我用AI换脸生成的作品',
    url: resultImage.value
  })
}
</script>

<style scoped>
.view-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.workspace {
  display: flex;
  gap: 20px;
  min-height: 600px;
}

.left-panel {
  width: 400px;
  flex-shrink: 0;
}

.right-panel {
  flex: 1;
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-section h3 {
  font-size: 16px;
  margin: 0 0 12px;
}

.upload-area {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  border: 2px dashed #2a2c34;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #2d65f2;
}

.upload-content {
  color: #8b8c91;
}

.upload-content i {
  font-size: 32px;
  margin-bottom: 12px;
}

.upload-content p {
  font-size: 14px;
  margin: 0;
}

.upload-tip {
  font-size: 12px;
  margin-top: 8px;
  display: block;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.action-bar {
  display: flex;
  gap: 10px;
}

.reset-button, .generate-button {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.reset-button {
  background: none;
  border: 1px solid #2a2c34;
  color: #ffffff;
}

.reset-button:hover {
  background-color: #2a2c34;
}

.generate-button {
  background-color: #2d65f2;
  border: none;
  color: white;
}

.generate-button:hover {
  background-color: #1e54e7;
}

.generate-button:disabled {
  background-color: #4a4b52;
  cursor: not-allowed;
}

.result-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-header h3 {
  font-size: 16px;
  margin: 0;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  background: none;
  border: 1px solid #2a2c34;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  font-size: 14px;
}

.action-button:hover {
  background-color: #2a2c34;
}

.result-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-preview img {
  width: 100%;
  height: 400px;
  object-fit: contain;
  border-radius: 8px;
  background-color: #2a2c34;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b8c91;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.loading-state {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px 40px;
  border-radius: 12px;
  text-align: center;
  color: white;
}

.loading-spinner {
  font-size: 32px;
  margin-bottom: 12px;
}

.loading-state p {
  font-size: 14px;
  margin: 0;
}

.hidden {
  display: none;
}
</style> 