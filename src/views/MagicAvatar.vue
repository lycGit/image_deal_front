<template>
  <div class="view-container">
    <div class="content">
      <!-- 上传区域 -->
      <div class="upload-section">
        <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
          <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
          <div class="upload-content" v-if="!sourceImage">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>点击或拖拽上传照片</p>
            <span class="upload-tip">支持 jpg、png 格式，推荐尺寸 512x512</span>
          </div>
          <img v-else :src="sourceImage" class="preview-image" alt="原始照片" />
        </div>
      </div>

      <!-- 风格选择区域 -->
      <div class="style-section" v-if="sourceImage">
        <h3>选择生成风格</h3>
        <div class="style-grid">
          <div 
            v-for="style in styles" 
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

        <!-- 生成按钮 -->
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

      <!-- 生成结果展示区域 -->
      <div class="result-section" v-if="generatedAvatars.length > 0">
        <h3>生成结果</h3>
        <div class="avatar-grid">
          <div 
            v-for="(avatar, index) in generatedAvatars" 
            :key="index"
            class="avatar-item"
          >
            <img :src="avatar.url" :alt="'生成头像 ' + (index + 1)" />
            <div class="avatar-actions">
              <button class="action-button" @click="handleDownload(avatar)">
                <i class="fas fa-download"></i>
              </button>
              <button 
                class="action-button" 
                :class="{ 'active': avatar.isLiked }"
                @click="handleLike(avatar)"
              >
                <i class="fas fa-heart"></i>
              </button>
              <button class="action-button" @click="handleShare(avatar)">
                <i class="fas fa-share"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>正在生成魔法头像...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式状态
const sourceImage = ref(null)
const selectedStyle = ref(null)
const generatedAvatars = ref([])
const isLoading = ref(false)
const fileInput = ref(null)

// 风格数据
const styles = [
  {
    id: 'anime',
    name: '二次元动漫',
    description: '将照片转换为动漫风格头像',
    preview: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
  },
  {
    id: 'realistic',
    name: '写实风格',
    description: '保持真实感的艺术头像',
    preview: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
  },
  {
    id: 'cartoon',
    name: '卡通风格',
    description: '可爱有趣的卡通头像',
    preview: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
  },
  {
    id: 'oil',
    name: '油画风格',
    description: '富有艺术感的油画头像',
    preview: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
  },
  {
    id: 'sketch',
    name: '素描风格',
    description: '黑白素描艺术头像',
    preview: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '未来科技风格头像',
    preview: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
  }
]

// 计算属性
const canGenerate = computed(() => {
  return sourceImage.value && selectedStyle.value
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
  }
  reader.readAsDataURL(file)
}

const selectStyle = (styleId) => {
  selectedStyle.value = styleId
}

const resetUpload = () => {
  sourceImage.value = null
  selectedStyle.value = null
  fileInput.value.value = ''
}

const handleGenerate = async () => {
  if (!canGenerate.value || isLoading.value) return
  
  isLoading.value = true
  try {
    // TODO: 调用实际的 API
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟 API 调用
    
    // 模拟生成多个头像
    const newAvatars = Array(4).fill(null).map(() => ({
      url: 'https://picsum.photos/300/300',
      timestamp: Date.now(),
      isLiked: false
    }))
    
    generatedAvatars.value.push(...newAvatars)
  } catch (error) {
    console.error('生成头像失败:', error)
    // TODO: 显示错误提示
  } finally {
    isLoading.value = false
  }
}

const handleDownload = (avatar) => {
  const link = document.createElement('a')
  link.href = avatar.url
  link.download = `magic-avatar-${avatar.timestamp}.jpg`
  link.click()
}

const handleLike = (avatar) => {
  avatar.isLiked = !avatar.isLiked
  // TODO: 调用收藏 API
}

const handleShare = (avatar) => {
  if (navigator.share) {
    navigator.share({
      title: '魔法头像',
      text: '查看我用魔法头像生成的作品',
      url: avatar.url
    })
  }
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

.upload-section {
  margin-bottom: 40px;
}

.upload-area {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  border: 2px dashed #2a2c34;
  transition: all 0.2s;
  max-width: 400px;
  margin: 0 auto;
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
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}

.style-section {
  margin-bottom: 40px;
}

.style-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.style-item {
  background-color: #1f2128;
  border-radius: 12px;
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
  height: 150px;
  object-fit: cover;
}

.style-info {
  padding: 12px;
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
  justify-content: center;
  gap: 16px;
}

.reset-button {
  background: none;
  border: 1px solid #2a2c34;
  color: #ffffff;
  padding: 0 24px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.reset-button:hover {
  background-color: #2a2c34;
}

.generate-button {
  background-color: #2d65f2;
  color: white;
  border: none;
  padding: 0 24px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.generate-button:hover {
  background-color: #1e54e7;
}

.generate-button:disabled {
  background-color: #4a4b52;
  cursor: not-allowed;
}

.result-section {
  margin-top: 40px;
}

.result-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.avatar-item {
  background-color: #1f2128;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.avatar-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.avatar-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-item:hover .avatar-actions {
  opacity: 1;
}

.action-button {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.action-button.active {
  background-color: #2d65f2;
  color: white;
}

.hidden {
  display: none;
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
</style> 