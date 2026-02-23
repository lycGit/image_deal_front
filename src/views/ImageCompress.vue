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
        multiple
        style="display: none"
      >
      <div class="upload-content">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="17 8 12 3 7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="upload-text">点击或拖拽多张图片到此处上传</p>
        <p class="upload-hint">支持 JPG、PNG、WEBP 格式，可批量选择</p>
      </div>
    </div>

    <!-- 压缩设置和预览区域 -->
    <div v-if="imageList.length > 0" class="compress-section">
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
          @click="compressAllImages"
          :disabled="isCompressing"
        >
          <span v-if="isCompressing">压缩中... ({{ compressedCount }}/{{ imageList.length }})</span>
          <span v-else>批量压缩 ({{ imageList.length }}张)</span>
        </button>

        <button 
          v-if="allCompressed"
          class="download-all-btn"
          @click="downloadAllImages"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 10 12 15 17 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          下载所有压缩图片
        </button>

        <button 
          class="clear-btn"
          @click="clearAll"
        >
          清空列表
        </button>
      </div>

      <!-- 预览区域 -->
      <div class="preview-panel">
        <h3>图片列表 ({{ imageList.length }}张)</h3>
        
        <div class="image-list">
          <div 
            v-for="(item, index) in imageList" 
            :key="index"
            class="image-item"
          >
            <div class="image-preview">
              <img :src="item.originalImage" :alt="item.fileName" class="thumbnail">
              <div class="image-info">
                <p class="file-name">{{ item.fileName }}</p>
                <p class="file-size">
                  原图: {{ formatFileSize(item.originalSize) }}
                  <span v-if="item.compressedSize">
                    → 压缩后: {{ formatFileSize(item.compressedSize) }}
                    <span class="save-percent" v-if="item.savePercent > 0">
                      (节省 {{ item.savePercent }}%)
                    </span>
                  </span>
                </p>
              </div>
            </div>
            <div class="image-actions">
              <button 
                v-if="!item.compressedImage"
                class="single-compress-btn"
                @click="compressSingleImage(index)"
                :disabled="isCompressing"
              >
                压缩
              </button>
              <button 
                v-else
                class="download-btn"
                @click="downloadSingleImage(index)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="7 10 12 15 17 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                下载
              </button>
              <button 
                class="remove-btn"
                @click="removeImage(index)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
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
    const imageList = ref([])
    const quality = ref(80)
    const maxWidth = ref(1024)
    const maxHeight = ref(1024)
    const isCompressing = ref(false)
    const compressedCount = ref(0)

    // 计算是否全部压缩完成
    const allCompressed = computed(() => {
      return imageList.value.length > 0 && imageList.value.every(item => item.compressedImage)
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
        processFiles(files)
      }
    }

    // 处理文件选择
    const handleFileSelect = (e) => {
      const files = e.target.files
      if (files.length > 0) {
        processFiles(files)
      }
      // 清空input，允许重复选择相同文件
      e.target.value = ''
    }

    // 处理多个文件
    const processFiles = (files) => {
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          alert(`文件 "${file.name}" 不是图片文件，已跳过`)
          return
        }

        const fileName = file.name.replace(/\.[^/.]+$/, '')
        const reader = new FileReader()
        reader.onload = (e) => {
          imageList.value.push({
            fileName: file.name,
            originalImage: e.target.result,
            compressedImage: null,
            originalSize: file.size,
            compressedSize: 0,
            savePercent: 0
          })
        }
        reader.readAsDataURL(file)
      })
    }

    // 压缩单张图片
    const compressSingleImage = async (index) => {
      const item = imageList.value[index]
      if (!item || !item.originalImage) return

      await compressImage(item)
    }

    // 批量压缩所有图片
    const compressAllImages = async () => {
      if (imageList.value.length === 0) return

      isCompressing.value = true
      compressedCount.value = 0

      for (let i = 0; i < imageList.value.length; i++) {
        const item = imageList.value[i]
        if (!item.compressedImage) {
          await compressImage(item)
          compressedCount.value++
        }
      }

      isCompressing.value = false
    }

    // 压缩图片
    const compressImage = (item) => {
      return new Promise((resolve, reject) => {
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
          item.compressedSize = Math.round((base64Length * 0.75) + padding)
          item.compressedImage = compressedDataUrl

          // 计算节省百分比
          const saved = item.originalSize - item.compressedSize
          item.savePercent = Math.round((saved / item.originalSize) * 100)

          resolve()
        }

        img.onerror = () => {
          alert(`图片 "${item.fileName}" 加载失败`)
          reject()
        }

        img.src = item.originalImage
      })
    }

    // 下载单张图片
    const downloadSingleImage = (index) => {
      const item = imageList.value[index]
      if (!item || !item.compressedImage) return

      const link = document.createElement('a')
      link.href = item.compressedImage
      const fileName = item.fileName.replace(/\.[^/.]+$/, '')
      link.download = `${fileName}_compressed.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // 批量下载所有图片
    const downloadAllImages = () => {
      imageList.value.forEach((item, index) => {
        if (item.compressedImage) {
          setTimeout(() => {
            downloadSingleImage(index)
          }, index * 500) // 间隔500ms下载，避免浏览器阻止
        }
      })
    }

    // 删除图片
    const removeImage = (index) => {
      imageList.value.splice(index, 1)
    }

    // 清空所有图片
    const clearAll = () => {
      if (confirm('确定要清空所有图片吗？')) {
        imageList.value = []
      }
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
      imageList,
      quality,
      maxWidth,
      maxHeight,
      isCompressing,
      compressedCount,
      allCompressed,
      triggerFileInput,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileSelect,
      compressSingleImage,
      compressAllImages,
      downloadSingleImage,
      downloadAllImages,
      removeImage,
      clearAll,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.image-compress-container {
  max-width: 1400px;
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
  margin-bottom: 15px;
}

.compress-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.compress-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.download-all-btn {
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
  margin-bottom: 15px;
}

.download-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
}

.download-all-btn svg {
  width: 24px;
  height: 24px;
}

.clear-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #e53e3e;
  background: white;
  border: 2px solid #e53e3e;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #fff5f5;
  transform: translateY(-2px);
}

.image-list {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.image-list::-webkit-scrollbar {
  width: 8px;
}

.image-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.image-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.image-list::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.image-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.image-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.image-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.image-info {
  flex: 1;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 5px 0;
  word-break: break-all;
}

.file-size {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.save-percent {
  color: #48bb78;
  font-weight: 700;
  margin-left: 8px;
}

.image-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.single-compress-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.single-compress-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.single-compress-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.download-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.download-btn svg {
  width: 16px;
  height: 16px;
}

.remove-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #e53e3e;
  background: white;
  border: 2px solid #e53e3e;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #fff5f5;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .compress-section {
    grid-template-columns: 1fr;
  }

  .image-item {
    flex-direction: column;
    align-items: stretch;
  }

  .image-preview {
    margin-bottom: 15px;
  }

  .image-actions {
    justify-content: flex-end;
  }

  .header h1 {
    font-size: 32px;
  }
}
</style>
