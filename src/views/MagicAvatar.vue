<template>
  <div class="magic-avatar">
    <div class="header">泡咖AI魔法头像</div>
    
    <!-- 第一步：上传图片 -->
    <div class="section">
      <div class="section-title">第一步：上传您的头像(可选)</div>
      <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
        <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
        <div class="upload-content" v-if="!uploadedImage">
          <div class="upload-icon">+</div>
          <div class="upload-text">拖拽/粘贴图片到此处</div>
        </div>
        <img v-else :src="uploadedImage" class="preview-image" alt="上传的图片" />
      </div>
      
      <!-- 相似度滑块 -->
      <div class="slider-container">
        <div class="slider-label">相似度：</div>
        <input 
          type="range" 
          v-model="similarity" 
          min="0" 
          max="1" 
          step="0.1" 
          class="slider"
        />
        <div class="slider-value">{{ similarity }}</div>
      </div>
    </div>

    <!-- 第二步：提示词 -->
    <div class="section">
      <div class="section-title">第二步：增加提示词</div>
      <div class="prompt-input">
        <input 
          type="text" 
          v-model="prompt"
          placeholder="请输入AI提示词,支持中文。"
        />
      </div>
      <div class="quick-prompts">
        <button 
          v-for="(prompt, index) in quickPrompts" 
          :key="index"
          class="prompt-tag"
          @click="selectQuickPrompt(prompt)"
        >
          {{ prompt }}
        </button>
      </div>
    </div>

    <!-- 第三步：选择风格 -->
    <div class="section">
      <div class="section-title">第三步：选择头像风格</div>
      <div class="style-grid">
        <div 
          v-for="style in styles" 
          :key="style.id"
          class="style-card"
          :class="{ active: selectedStyle === style.id }"
          @click="selectStyle(style.id)"
        >
          <img :src="style.preview" :alt="style.name" />
          <div class="style-name">{{ style.name }}</div>
        </div>
      </div>
    </div>

    <!-- 底部状态和生成按钮 -->
    <div class="footer">
      <div class="status">当前为放松模式，生成需2算力</div>
      <button class="generate-button" @click="handleGenerate">
        开始AI生成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uploadedImage = ref(null)
const fileInput = ref(null)
const similarity = ref(0.5)
const prompt = ref('')
const selectedStyle = ref('')

const quickPrompts = [
  '换一批',
  '可爱女孩',
  '漂亮女孩',
  '阳光男孩',
  '大叔'
]

const styles = [
  { id: 'japanese', name: '日系冷酷少女', preview: '/path-to-preview' },
  { id: 'disney', name: '迪士尼3D', preview: '/path-to-preview' },
  { id: 'punk', name: '皮克斯风格', preview: '/path-to-preview' },
  { id: 'ink', name: '国风水墨', preview: '/path-to-preview' },
  { id: 'girl', name: '国风少女', preview: '/path-to-preview' },
  { id: 'cyberpunk', name: '赛博朋克', preview: '/path-to-preview' },
  { id: '2d', name: '二次元', preview: '/path-to-preview' },
  { id: 'romantic', name: '浪漫玛特霍恩', preview: '/path-to-preview' },
  { id: 'special', name: '特摄霓虹风', preview: '/path-to-preview' },
  { id: 'simple', name: '简笔艺术签书', preview: '/path-to-preview' }
]

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
    uploadedImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const selectQuickPrompt = (selectedPrompt) => {
  prompt.value = selectedPrompt
}

const selectStyle = (styleId) => {
  selectedStyle.value = styleId
}

const handleGenerate = async () => {
  if (!uploadedImage.value) {
    alert('请先上传图片')
    return
  }

  try {
    // 创建 FormData 对象
    const formData = new FormData()
    
    // 将 base64 图片转换为 Blob
    const base64Data = uploadedImage.value.split(',')[1]
    const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())
    formData.append('file', blob, 'avatar.jpg')
    
    // 添加其他参数
    formData.append('description', prompt.value)
    formData.append('category', 'MAGIC_AVATAR')
    formData.append('tags', JSON.stringify({
      style: selectedStyle.value,
      similarity: similarity.value
    }))

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    const result = await response.text()
    console.log('上传成功:', result)
    
    // 清空表单
    uploadedImage.value = null
    prompt.value = ''
    selectedStyle.value = ''
    similarity.value = 0.5

  } catch (error) {
    console.error('生成失败:', error)
    alert('生成失败，请重试')
  }
}
</script>

<style scoped>
.magic-avatar {
  padding: 24px;
  background-color: #1a1b1e;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  font-size: 24px;
  color: #4776E6;
  font-weight: 500;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  color: #8e9297;
}

.upload-area {
  border: 2px dashed #40444b;
  border-radius: 8px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #4776E6;
}

.upload-content {
  text-align: center;
}

.upload-icon {
  font-size: 32px;
  color: #8e9297;
  margin-bottom: 8px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  height: 4px;
  background: #40444b;
  border-radius: 2px;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #4776E6;
  border-radius: 50%;
  cursor: pointer;
}

.prompt-input {
  width: 100%;
  background: #2f3136;
  border-radius: 8px;
  padding: 2px;
}

.prompt-input input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: #2f3136;
  border: 1px solid #40444b;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.prompt-input input:focus {
  border-color: #4776E6;
  background: #373a40;
}

.prompt-input input::placeholder {
  color: #8e9297;
}

.quick-prompts {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.prompt-tag {
  padding: 6px 12px;
  background: #2f3136;
  border: 1px solid #40444b;
  border-radius: 16px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
}

.prompt-tag:hover {
  border-color: #4776E6;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.style-card {
  background: #2f3136;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.style-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.style-card.active {
  border: 2px solid #4776E6;
}

.style-name {
  padding: 8px;
  text-align: center;
  font-size: 14px;
}

.footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
}

.status {
  color: #8e9297;
}

.generate-button {
  padding: 12px 24px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
}

.hidden {
  display: none;
}
</style>