<template>
  <div class="view-container">
    <div class="content">
      <!-- 创作区域 -->
      <div class="creation-area">
        <!-- 左侧上传和参考区域 -->
        <div class="left-panel">
          <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
            <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
            <div class="upload-content" v-if="!referenceImage">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>点击或拖拽上传参考图</p>
              <span class="upload-tip">支持 jpg、png 格式</span>
            </div>
            <img v-else :src="referenceImage" class="reference-image" alt="参考图片" />
          </div>
          
          <!-- 提示词参考 -->
          <div class="prompt-reference">
            <h3>提示词参考</h3>
            <div class="tag-groups">
              <div v-for="(group, index) in promptTags" :key="index" class="tag-group">
                <div class="group-title">{{ group.title }}</div>
                <div class="tags">
                  <span 
                    v-for="tag in group.tags" 
                    :key="tag"
                    class="tag"
                    :class="{ active: selectedTags.includes(tag) }"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧生成区域 -->
        <div class="right-panel">
          <div class="prompt-box">
            <div class="prompt-header">
              <div class="prompt-tabs">
                <button 
                  v-for="tab in tabs" 
                  :key="tab.value"
                  class="tab-button"
                  :class="{ active: currentTab === tab.value }"
                  @click="currentTab = tab.value"
                >
                  {{ tab.label }}
                </button>
              </div>
              <button class="clear-button" @click="clearPrompt">
                <i class="fas fa-trash-alt"></i>
                清空
              </button>
            </div>
            
            <div class="prompt-input">
              <textarea
                v-model="prompt"
                :placeholder="currentTab === 'positive' ? '添加你想要的元素...' : '添加你不想要的元素...'"
                rows="4"
              ></textarea>
            </div>

            <div class="prompt-footer">
              <div class="image-options">
                <button 
                  v-for="option in options" 
                  :key="option.value"
                  class="option-button"
                  :class="{ active: selectedOption === option.value }"
                  @click="selectOption(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
              <button 
                class="generate-button" 
                :disabled="isLoading || !canGenerate"
                @click="handleSubmit"
              >
                <i class="fas fa-magic"></i>
                开始生成
              </button>
            </div>
          </div>

          <!-- 生成的图片展示区域 -->
          <div class="image-display" v-if="generatedImages.length > 0">
            <div class="image-grid">
              <div 
                v-for="(image, index) in generatedImages" 
                :key="index"
                class="image-item"
              >
                <img :src="image.url" :alt="'生成图片 ' + (index + 1)" />
                <div class="image-actions">
                  <button class="action-button" @click="handleDownload(image)">
                    <i class="fas fa-download"></i>
                  </button>
                  <button 
                    class="action-button" 
                    :class="{ 'active': image.isLiked }"
                    @click="handleLike(image)"
                  >
                    <i class="fas fa-heart"></i>
                  </button>
                  <button class="action-button" @click="handleShare(image)">
                    <i class="fas fa-share"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态提示 -->
          <div class="empty-state" v-else-if="!isLoading">
            <i class="fas fa-image empty-icon"></i>
            <p>上传参考图或输入提示词开始创作</p>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>正在生成图片...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式状态
const prompt = ref('')
const selectedOption = ref('')
const generatedImages = ref([])
const isLoading = ref(false)
const currentTab = ref('positive')
const referenceImage = ref(null)
const fileInput = ref(null)
const selectedTags = ref([])

// 标签页数据
const tabs = [
  { label: '正向提示词', value: 'positive' },
  { label: '反向提示词', value: 'negative' }
]

// 选项数据
const options = [
  { label: '写实', value: 'realistic' },
  { label: '自然', value: 'natural' },
  { label: '高清', value: 'hd' },
  { label: '超清', value: 'uhd' },
  { label: '1:1', value: '1:1' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' }
]

// 提示词标签组
const promptTags = [
  {
    title: '风格',
    tags: ['写实', '油画', '水彩', '素描', '动漫', '赛博朋克']
  },
  {
    title: '场景',
    tags: ['自然', '城市', '室内', '太空', '海洋', '山川']
  },
  {
    title: '光照',
    tags: ['日光', '夜景', '黄昏', '逆光', '柔光', '霓虹']
  },
  {
    title: '构图',
    tags: ['特写', '全景', '鸟瞰', '对称', '中心', '散景']
  }
]

// 计算属性
const canGenerate = computed(() => {
  return prompt.value.trim() || referenceImage.value
})

// 方法
const handleSubmit = async () => {
  if (!canGenerate.value || isLoading.value) return
  
  isLoading.value = true
  try {
    // TODO: 调用实际的 API
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟 API 调用
    
    generatedImages.value.push({
      url: 'https://picsum.photos/400/400',
      timestamp: Date.now(),
      isLiked: false
    })
  } catch (error) {
    console.error('生成图片失败:', error)
    // TODO: 显示错误提示
  } finally {
    isLoading.value = false
  }
}

const selectOption = (value) => {
  selectedOption.value = value
}

const handleDownload = (image) => {
  const link = document.createElement('a')
  link.href = image.url
  link.download = `kl-drawing-${image.timestamp}.jpg`
  link.click()
}

const handleLike = (image) => {
  image.isLiked = !image.isLiked
  // TODO: 调用收藏 API
}

const handleShare = (image) => {
  if (navigator.share) {
    navigator.share({
      title: 'KL绘画作品',
      text: '查看我用KL绘画生成的图片',
      url: image.url
    })
  }
}

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
    referenceImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
    prompt.value = prompt.value ? `${prompt.value}, ${tag}` : tag
  } else {
    selectedTags.value.splice(index, 1)
    prompt.value = prompt.value
      .split(',')
      .filter(t => t.trim() !== tag)
      .join(',')
  }
}

const clearPrompt = () => {
  prompt.value = ''
  selectedTags.value = []
}
</script>

<style scoped>
.view-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.creation-area {
  display: flex;
  gap: 20px;
}

.left-panel {
  width: 300px;
  flex-shrink: 0;
}

.right-panel {
  flex: 1;
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

.upload-tip {
  font-size: 12px;
  margin-top: 8px;
  display: block;
}

.reference-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.prompt-reference {
  margin-top: 20px;
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
}

.prompt-reference h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

.tag-group {
  margin-bottom: 16px;
}

.group-title {
  font-size: 14px;
  color: #8b8c91;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #2a2c34;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  background-color: #3a3c44;
}

.tag.active {
  background-color: #2d65f2;
  color: white;
}

.prompt-box {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.prompt-tabs {
  display: flex;
  gap: 12px;
}

.tab-button {
  background: none;
  border: none;
  color: #8b8c91;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.tab-button.active {
  background-color: #2a2c34;
  color: white;
}

.clear-button {
  background: none;
  border: none;
  color: #8b8c91;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-button:hover {
  color: white;
}

.prompt-input textarea {
  width: 100%;
  background-color: #2a2c34;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
}

.prompt-input textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(45, 101, 242, 0.5);
}

.prompt-footer {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.option-button {
  background-color: #2a2c34;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.option-button:hover {
  background-color: #3a3c44;
}

.option-button.active {
  background-color: #2d65f2;
  color: white;
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

.hidden {
  display: none;
}

/* 保持原有的其他样式不变 */
.image-display {
  margin-top: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.image-item {
  background-color: #1f2128;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.image-item img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

.image-actions {
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

.image-item:hover .image-actions {
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

.empty-state {
  margin-top: 60px;
  text-align: center;
  color: #8b8c91;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
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