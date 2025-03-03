<template>
  <div class="view-container">
    <div class="content">
      <div class="workspace">
        <!-- 左侧上传和预览区域 -->
        <div class="left-panel">
          <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
            <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
            <div class="upload-content" v-if="!sourceImage">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>点击或拖拽上传图片</p>
              <span class="upload-tip">支持 jpg、png 格式</span>
            </div>
            <img v-else :src="sourceImage" class="preview-image" alt="原始图片" />
          </div>

          <!-- 抠图模式选择 -->
          <div class="mode-selection" v-if="sourceImage">
            <h3>抠图模式</h3>
            <div class="mode-options">
              <button 
                v-for="mode in modes" 
                :key="mode.id"
                class="mode-button"
                :class="{ active: selectedMode === mode.id }"
                @click="selectMode(mode.id)"
              >
                <i :class="mode.icon"></i>
                {{ mode.name }}
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-bar" v-if="sourceImage">
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
              开始抠图
            </button>
          </div>
        </div>

        <!-- 右侧结果展示区域 -->
        <div class="right-panel" v-if="resultImage">
          <div class="result-container">
            <div class="result-header">
              <h3>抠图结果</h3>
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
              <img :src="resultImage" alt="抠图结果" />
              <div class="background-options">
                <button 
                  v-for="bg in backgrounds" 
                  :key="bg.id"
                  class="bg-button"
                  :class="{ active: selectedBackground === bg.id }"
                  @click="changeBackground(bg.id)"
                >
                  <i :class="bg.icon"></i>
                  {{ bg.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div class="empty-state" v-if="!sourceImage && !resultImage">
          <i class="fas fa-image empty-icon"></i>
          <p>上传图片开始抠图</p>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>正在进行智能抠图...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式状态
const sourceImage = ref(null)
const resultImage = ref(null)
const selectedMode = ref('auto')
const selectedBackground = ref('transparent')
const isLoading = ref(false)
const fileInput = ref(null)

// 抠图模式数据
const modes = [
  {
    id: 'auto',
    name: '智能抠图',
    icon: 'fas fa-magic'
  },
  {
    id: 'portrait',
    name: '人像抠图',
    icon: 'fas fa-user'
  },
  {
    id: 'product',
    name: '商品抠图',
    icon: 'fas fa-box'
  }
]

// 背景选项数据
const backgrounds = [
  {
    id: 'transparent',
    name: '透明背景',
    icon: 'fas fa-square'
  },
  {
    id: 'white',
    name: '白色背景',
    icon: 'fas fa-square'
  },
  {
    id: 'black',
    name: '黑色背景',
    icon: 'fas fa-square'
  },
  {
    id: 'custom',
    name: '自定义背景',
    icon: 'fas fa-palette'
  }
]

// 计算属性
const canGenerate = computed(() => {
  return sourceImage.value && selectedMode.value
})

// 方法
const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleFile = (file) => {
  if (!file.type.startsWith('image/')) {
    // TODO: 显示错误提示
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    sourceImage.value = e.target.result
    resultImage.value = null // 清除之前的结果
  }
  reader.readAsDataURL(file)
}

const selectMode = (modeId) => {
  selectedMode.value = modeId
}

const resetUpload = () => {
  sourceImage.value = null
  resultImage.value = null
  selectedMode.value = 'auto'
  selectedBackground.value = 'transparent'
  fileInput.value.value = ''
}

const handleGenerate = async () => {
  if (!canGenerate.value || isLoading.value) return
  
  isLoading.value = true
  try {
    // TODO: 调用实际的抠图 API
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟 API 调用
    
    // 模拟生成结果
    resultImage.value = sourceImage.value // 这里应该是 API 返回的抠图结果
  } catch (error) {
    console.error('抠图失败:', error)
    // TODO: 显示错误提示
  } finally {
    isLoading.value = false
  }
}

const changeBackground = (bgId) => {
  selectedBackground.value = bgId
  // TODO: 根据选择的背景类型更新预览图
}

const handleDownload = () => {
  if (!resultImage.value) return
  
  const link = document.createElement('a')
  link.href = resultImage.value
  link.download = `cutout-${Date.now()}.png`
  link.click()
}

const handleShare = () => {
  if (!resultImage.value || !navigator.share) return
  
  navigator.share({
    title: 'AI抠图结果',
    text: '查看我用AI抠图生成的作品',
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

.upload-area {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 40px;
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
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-content p {
  font-size: 16px;
  margin: 0;
}

.upload-tip {
  font-size: 12px;
  margin-top: 8px;
  display: block;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

.mode-selection {
  margin-top: 20px;
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
}

.mode-selection h3 {
  font-size: 16px;
  margin: 0 0 16px;
}

.mode-options {
  display: flex;
  gap: 10px;
}

.mode-button {
  flex: 1;
  background-color: #2a2c34;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.mode-button i {
  font-size: 20px;
}

.mode-button:hover {
  background-color: #3a3c44;
}

.mode-button.active {
  background-color: #2d65f2;
}

.action-bar {
  margin-top: 20px;
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

.background-options {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.bg-button {
  background-color: #2a2c34;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  font-size: 14px;
}

.bg-button:hover {
  background-color: #3a3c44;
}

.bg-button.active {
  background-color: #2d65f2;
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