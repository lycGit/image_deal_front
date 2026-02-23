<template>
  <div class="image-compress-container">
    <div class="header">
      <h1>图片压缩</h1>
      <p class="subtitle">智能压缩图片，保持高质量的同时减小文件大小</p>
    </div>

    <!-- 上传区域 -->
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileSelect" 
        accept="image/*"
        style="display: none"
      >
      <div class="upload-content">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="17 8 12 3 7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="upload-text">点击或拖拽图片到此处上传</p>
        <p class="upload-hint">支持 JPG、PNG、WEBP 格式</p>
      </div>
    </div>

    <!-- 压缩设置和预览区域 -->
    <div v-if="originalImage" class="compress-section">
      <!-- 参数设置 -->
      <div class="settings-panel">
        <h3>压缩设置</h3>
        
        <div class="setting-item">
          <label>压缩质量</label>
          <div class="quality-control">
            <input 
              type="range" 
              v-model="quality" 
              min="10" 
              max="100" 
              step="5"
              class="quality-slider"
            >
            <span class="quality-value">{{ quality }}%</span>
          </div>
        </div>

        <div class="setting-item">
          <label>最大宽度 (px)</label>
          <input 
            type="number" 
            v-model="maxWidth" 
            placeholder="不限制"
            class="size-input"
          >
        </div>

        <div class="setting-item">
          <label>最大高度 (px)</label>
          <input 
            type="number" 
            v-model="maxHeight" 
            placeholder="不限制"
            class="size-input"
          >
        </div>

        <button 
          class="compress-btn"
          @click="compressImage"
          :disabled="isCompressing"
        >
          <span v-if="isCompressing">压缩中...</span>
          <span v-else>开始压缩</span>
        </button>
      </div>

      <!-- 预览区域 -->
      <div class="preview-panel">
        <h3>预览对比</h3>
        
        <div class="preview-grid">
          <!-- 原图预览 -->
          <div class="preview-item">
            <div class="preview-header">
              <span class="preview-label">原图</span>
              <span class="file-info">{{ formatFileSize(originalSize) }}</span>
            </div>
            <div class="image-container">
              <img :src="originalImage" alt="原图" class="preview-image">
            </div>
          </div>

          <!-- 压缩后预览 -->
          <div class="preview-item">
            <div class="preview-header">
              <span class="preview-label">压缩后</span>
              <span v-if="compressedSize" class="file-info">
                {{ formatFileSize(compressedSize) }}
                <span class="save-percent" v-if="savePercent > 0">
                  (节省 {{ savePercent }}%)
                </span>
              </span>
            </div>
            <div class="image-container">
              <img 
                v-if="compressedImage" 
                :src="compressedImage" 
                alt="压缩后" 
                class="preview-image"
              >
              <div v-else class="placeholder">
                <p>等待压缩...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 下载按钮 -->
        <button 
          v-if="compressedImage"
          class="download-btn"
          @click="downloadCompressedImage"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 10 12 15 17 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          下载压缩图片
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ImageCompress',
  setup() {
    const fileInput = ref(null)
    const isDragOver = ref(false)
    const originalImage = ref(null)
    const compressedImage = ref(null)
    const originalSize = ref(0)
    const compressedSize = ref(0)
    const quality = ref(80)
    const maxWidth = ref('')
    const maxHeight = ref('')
    const isCompressing = ref(false)
    const originalFileName = ref('')

    // 计算节省百分比
    const savePercent = computed(() => {
      if (!originalSize.value || !compressedSize.value) return 0
      const saved = originalSize.value - compressedSize.value
      return Math.round((saved / originalSize.value) * 100)
    })

    // 触发文件选择
    const triggerFileInput = () => {
      fileInput.value.click()
    }

    // 处理拖拽
    const handleDragOver = (e) => {
      isDragOver.value = true
    }

    const handleDragLeave = (e) => {
      isDragOver.value = false
    }

    const handleDrop = (e) => {
      isDragOver.value = false
      const files = e.dataTransfer.files
      if (files.length > 0) {
        processFile(files[0])
      }
    }

    // 处理文件选择
    const handleFileSelect = (e) => {
      const files = e.target.files
      if (files.length > 0) {
        processFile(files[0])
      }
    }

    // 处理文件
    const processFile = (file) => {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      originalFileName.value = file.name.replace(/\.[^/.]+$/, '')
      originalSize.value = file.size

      const reader = new FileReader()
      reader.onload = (e) => {
        originalImage.value = e.target.result
        compressedImage.value = null
        compressedSize.value = 0
      }
      reader.readAsDataURL(file)
    }

    // 压缩图片
    const compressImage = () => {
      if (!originalImage.value) return

      isCompressing.value = true

      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // 计算目标尺寸
        let width = img.width
        let height = img.height

        if (maxWidth.value && width > parseInt(maxWidth.value)) {
          const ratio = parseInt(maxWidth.value) / width
          width = parseInt(maxWidth.value)
          height = height * ratio
        }

        if (maxHeight.value && height > parseInt(maxHeight.value)) {
          const ratio = parseInt(maxHeight.value) / height
          height = parseInt(maxHeight.value)
          width = width * ratio
        }

        canvas.width = width
        canvas.height = height

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height)

        // 压缩
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality.value / 100)
        
        // 获取压缩后大小
        const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1)
        const padding = (compressedDataUrl.length - base64Length) * 0.75
        compressedSize.value = Math.round((base64Length * 0.75) + padding)

        compressedImage.value = compressedDataUrl
        isCompressing.value = false
      }

      img.onerror = () => {
        alert('图片加载失败')
        isCompressing.value = false
      }

      img.src = originalImage.value
    }

    // 下载压缩图片
    const downloadCompressedImage = () => {
      if (!compressedImage.value) return

      const link = document.createElement('a')
      link.href = compressedImage.value
      link.download = `${originalFileName.value}_compressed.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    return {
      fileInput,
      isDragOver,
      originalImage,
      compressedImage,
      originalSize,
      compressedSize,
      quality,
      maxWidth,
      maxHeight,
      isCompressing,
      savePercent,
      triggerFileInput,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileSelect,
      compressImage,
      downloadCompressedImage,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.image-compress-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.upload-area {
  background: white;
  border: 3px dashed #cbd5e0;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.upload-area.drag-over {
  border-color: #667eea;
  background: #f0f4ff;
  transform: scale(1.02);
}

.upload-icon {
  width: 80px;
  height: 80px;
  color: #667eea;
  margin-bottom: 20px;
}

.upload-text {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.upload-hint {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.compress-section {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  align-items: start;
}

.settings-panel,
.preview-panel {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.settings-panel h3,
.preview-panel h3 {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.setting-item {
  margin-bottom: 25px;
}

.setting-item label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 10px;
}

.quality-control {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quality-slider {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
}

.quality-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
}

.quality-value {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  min-width: 50px;
  text-align: right;
}

.size-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.size-input:focus {
  border-color: #667eea;
}

.compress-btn {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.compress-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.compress-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.preview-item {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f7fafc;
  border-bottom: 2px solid #e2e8f0;
}

.preview-label {
  font-size: 16px;
  font-weight: 700;
  color: #4a5568;
}

.file-info {
  font-size: 14px;
  color: #718096;
}

.save-percent {
  color: #48bb78;
  font-weight: 700;
  margin-left: 8px;
}

.image-container {
  aspect-ratio: 1;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder {
  color: #a0aec0;
  font-size: 16px;
}

.download-btn {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
}

.download-btn svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .compress-section {
    grid-template-columns: 1fr;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 32px;
  }
}
</style>
