<template>
  <div class="view-container">
    <div class="content">
      <div class="workspace">
        <!-- 左侧上传和选择区域 -->
        <div class="left-panel">
          <!-- 人物图片上传 -->
          <div class="upload-section">
            <h3>上传人物照片</h3>
            <div class="upload-area" @click="triggerPersonUpload" @dragover.prevent @drop="handlePersonDrop">
              <input type="file" ref="personFileInput" class="hidden" @change="handlePersonFileChange" accept="image/*" />
              <div class="upload-content" v-if="!personImage">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>点击或拖拽上传照片</p>
                <span class="upload-tip">支持 jpg、png 格式，建议全身照</span>
              </div>
              <img v-else :src="personImage" class="preview-image" alt="人物照片" />
            </div>
          </div>

          <!-- 服装选择区域 -->
          <div class="clothes-section" v-if="personImage">
            <h3>选择服装风格</h3>
            <div class="clothes-grid">
              <div 
                v-for="style in clothesStyles" 
                :key="style.id"
                class="style-item"
                :class="{ active: selectedStyle === style.id }"
                @click="selectStyle(style.id)"
              >
                <img :src="style.preview" :alt="style.name" />
                <div class="style-info">
                  <span class="style-name">{{ style.name }}</span>
                  <span class="style-desc">{{ style.description }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-bar" v-if="personImage">
            <button class="reset-button" @click="resetUpload">
              <i class="fas fa-undo"></i>
              重新上传
            </button>
            <button 
              class="generate-button" 
              :disabled="isLoading || !canGenerate"
              @click="handleGenerate"
            >
              <i class="fas fa-tshirt"></i>
              开始试衣
            </button>
          </div>
        </div>

        <!-- 右侧结果展示区域 -->
        <div class="right-panel" v-if="resultImage">
          <div class="result-container">
            <div class="result-header">
              <h3>试衣效果</h3>
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
              <img :src="resultImage" alt="试衣效果" />
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div class="empty-state" v-if="!personImage && !resultImage">
          <i class="fas fa-user-circle empty-icon"></i>
          <p>上传照片开始AI试衣</p>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>正在进行智能换装...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式状态
const personImage = ref(null)
const selectedStyle = ref(null)
const resultImage = ref(null)
const isLoading = ref(false)
const personFileInput = ref(null)

// 服装风格数据
const clothesStyles = [
  {
    id: 'casual',
    name: '休闲风格',
    description: '舒适日常的休闲装扮',
    preview: '/images/styles/casual.jpg'
  },
  {
    id: 'formal',
    name: '正装风格',
    description: '正式场合的商务装扮',
    preview: '/images/styles/formal.jpg'
  },
  {
    id: 'fashion',
    name: '时尚风格',
    description: '潮流前卫的时尚装扮',
    preview: '/images/styles/fashion.jpg'
  },
  {
    id: 'sport',
    name: '运动风格',
    description: '动感活力的运动装扮',
    preview: '/images/styles/sport.jpg'
  },
  {
    id: 'traditional',
    name: '传统风格',
    description: '古典优雅的传统装扮',
    preview: '/images/styles/traditional.jpg'
  },
  {
    id: 'street',
    name: '街头风格',
    description: '个性张扬的街头装扮',
    preview: '/images/styles/street.jpg'
  }
]

// 计算属性
const canGenerate = computed(() => {
  return personImage.value && selectedStyle.value
})

// 方法
const triggerPersonUpload = () => {
  personFileInput.value.click()
}

const handlePersonFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

const handlePersonDrop = (event) => {
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
    personImage.value = e.target.result
    resultImage.value = null // 清除之前的结果
  }
  reader.readAsDataURL(file)
}

const selectStyle = (styleId) => {
  selectedStyle.value = styleId
}

const resetUpload = () => {
  personImage.value = null
  selectedStyle.value = null
  resultImage.value = null
  personFileInput.value.value = ''
}

const handleGenerate = async () => {
  if (!canGenerate.value || isLoading.value) return
  
  isLoading.value = true
  try {
    // 创建 FormData 对象
    const formData = new FormData()
    
    // 将人物图片转换为 Blob
    const personBlob = await fetch(personImage.value).then(res => res.blob())
    // 获取选中的风格图片并转换为 Blob
    const styleData = clothesStyles.find(style => style.id === selectedStyle.value)
    const styleBlob = await fetch(styleData.preview).then(res => res.blob())
    
    formData.append('file1', personBlob, 'person.jpg')
    formData.append('file2', styleBlob, 'style.jpg')
    
    // 添加其他参数
    formData.append('category', 'CLOTH_DRESSING')
    formData.append('description', '智能换装')
    formData.append('tags', JSON.stringify({
      styleId: selectedStyle.value,
      styleName: styleData.name
    }))

    const response = await fetch('http://localhost:8091/api/files/upload2image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('换装失败')
    }

    const result = await response.json()
    console.log('换装成功:', result)
    
    // 更新结果图片
    resultImage.value = result.imageUrl

  } catch (error) {
    console.error('换装失败:', error)
    alert('换装失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const handleDownload = () => {
  if (!resultImage.value) return
  
  const link = document.createElement('a')
  link.href = resultImage.value
  link.download = `ai-dressing-${Date.now()}.png`
  link.click()
}

const handleShare = () => {
  if (!resultImage.value || !navigator.share) return
  
  navigator.share({
    title: 'AI换装效果',
    text: '查看我用AI换装生成的效果',
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
  height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

.clothes-section {
  margin-bottom: 20px;
}

.clothes-section h3 {
  font-size: 16px;
  margin: 0 0 12px;
}

.clothes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.style-item {
  background-color: #1f2128;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.style-item:hover {
  transform: translateY(-2px);
}

.style-item.active {
  border-color: #2d65f2;
}

.style-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.style-info {
  padding: 10px;
}

.style-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.style-desc {
  display: block;
  font-size: 12px;
  color: #8b8c91;
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
  height: 500px;
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