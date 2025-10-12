<template>
  <div class="view-container">
    <div class="left-panel">
      <!-- 切换标签 -->
      <div class="tab-group">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-button"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- 模板图片上传区域 -->
      <div class="section">
        <div class="section-header">
          <div class="title">上传模板图</div>
          <div class="more">更多 ></div>
        </div>
        <div class="image-grid">
          <div class="upload-box" @click="triggerTemplateUpload">
            <input 
              type="file" 
              ref="templateInput" 
              class="hidden" 
              @change="handleTemplateUpload" 
              accept="image/*"
            />
            <div class="plus-icon">+</div>
          </div>
          <div 
            v-for="(image, index) in templateImages" 
            :key="index"
            class="image-box"
          >
            <img :src="image" :alt="`模板${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- 人脸图片上传区域 -->
      <div class="section">
        <div class="section-header">
          <div class="title">上传人脸图</div>
          <div class="more">更多 ></div>
        </div>
        <div class="image-grid">
          <div class="upload-box" @click="triggerFaceUpload">
            <input 
              type="file" 
              ref="faceInput" 
              class="hidden" 
              @change="handleFaceUpload" 
              accept="image/*"
            />
            <div class="plus-icon">+</div>
          </div>
          <div 
            v-for="(image, index) in faceImages" 
            :key="index"
            class="image-box"
          >
            <img :src="image" :alt="`人脸${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- 设置选项 -->
      <div class="settings">
        <div class="setting-item">
          <span class="setting-label">选择清晰度</span>
          <div class="setting-options">
            <button 
              v-for="option in resolutions" 
              :key="option.value"
              class="option-button"
              :class="{ active: selectedResolution === option.value }"
              @click="selectedResolution = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <div class="setting-item">
          <span class="setting-label">选择人脸序号</span>
          <div class="select-box">
            <select v-model="selectedFaceIndex">
              <option value="all">全部</option>
            </select>
          </div>
        </div>
      </div>

      <div class="disclaimer">本功能仅供学习娱乐，严禁上传非法照片和用于非法用途！</div>

      <!-- 生成按钮 -->
      <button class="generate-button" @click="handleGenerate">
        开始AI换脸
      </button>
    </div>
    <div class="right-panel">
      <div class="result-card">
        <!-- 卡片顶部 -->
        <div class="card-header">
          <div class="user-info">
            <img src="/path-to-avatar" alt="" class="avatar" />
            <span class="name">泡咖AI换脸</span>
            <span class="time">2025/02/15 23:29</span>
          </div>
          <div class="header-actions">
            <button class="action-btn">
              <i class="icon">★</i>
              收藏
            </button>
            <button class="action-btn">
              <i class="icon">🗑</i>
              删除
            </button>
          </div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-content">
          <div class="source-images">
            <div class="source-image">
              <img v-if="templateImages[0]" :src="templateImages[0]" alt="模板图" />
            </div>
            <div class="plus-icon">+</div>
            <div class="source-image">
              <img v-if="faceImages[0]" :src="faceImages[0]" alt="人脸图" />
            </div>
          </div>
          <div class="result-image">
            <img v-if="resultImage" :src="resultImage" alt="结果图" />
          </div>
          <div class="status-text">生成成功！本次消耗4个算力</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref ,onMounted, onUnmounted} from 'vue'
import eventBus from '../eventBus'
import { getCurrentInstance } from 'vue';

const currentTab = ref('single')
const templateInput = ref(null)
const faceInput = ref(null)
const templateImages = ref([])
const faceImages = ref([])
const selectedResolution = ref('normal')
const selectedFaceIndex = ref('all')
const instance = getCurrentInstance();
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091 

const tabs = [
  { id: 'single', name: '图片换脸' },
  { id: 'multiple', name: '多人换脸' },
  { id: 'video', name: '视频换脸' }
]

const resolutions = [
  { value: 'normal', label: '普通' },
  { value: 'high', label: '高清' }
]

const triggerTemplateUpload = () => {
  if (templateInput.value) {
    templateInput.value.click()
  }
}

const triggerFaceUpload = () => {
  if (faceInput.value) {
    faceInput.value.click()
  }
}

const handleTemplateUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      templateImages.value = [e.target.result]
    }
    reader.readAsDataURL(file)
  }
}

const handleFaceUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      faceImages.value = [e.target.result]
    }
    reader.readAsDataURL(file)
  }
}

const resultImage = ref(null) // 添加结果图片的响应式变量

// 添加生成按钮的处理函数
const handleGenerate = async () => {

  if (!templateImages.value[0] || !faceImages.value[0]) {
    alert('请先上传模板图和人脸图')
    return
  }

  try {
    // 创建 FormData 对象
    const formData = new FormData()
    
    // 将 base64 图片转换为 Blob 并添加到 FormData
    const templateBlob = await fetch(templateImages.value[0]).then(res => res.blob())
    const faceBlob = await fetch(faceImages.value[0]).then(res => res.blob())
    
    formData.append('file1', templateBlob, 'template.jpg')
    formData.append('file2', faceBlob, 'face.jpg')
    
    // 添加其他参数
    formData.append('category', 'FACE_SWAP')
    formData.append('description', '人脸替换')
    formData.append('tags', JSON.stringify({
      resolution: selectedResolution.value,
      faceIndex: selectedFaceIndex.value
    }))

    const response = await fetch(`${baseUrl}/api/files/upload2image`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('换脸失败')
    }

    const result = await response.json()
    console.log('换脸成功:', result)

    const message = JSON.stringify({'msg': combineUrls(result.imageUrl1, result.imageUrl2), 'userId': 'lyc2', 'targetUserId': 'user_py_llm', 'action': 'IPAdapterFaceIDPortrait'});
    eventBus.emit('websocket-ImageSwap', message);
    // // 更新结果图片
    // resultImage.value = result.imageUrl1

  } catch (error) {
    console.error('换脸失败:', error)
    alert('换脸失败，请重试')
  }
}

function combineUrls(url1, url2) {
  // 可以添加参数验证
  if (!url1) return url2 || '';
  if (!url2) return url1 || '';

  // 拼接两个URL，中间用分号分隔
  return `${url1};${url2}`;
}

const handleMessage = (data) => { 
  console.log('收到 WebSocket 消息:', data)
  try {
    if (data.imageUrl) {
      resultImage.value = data.imageUrl
    }
  } catch (error) {
    console.error('解析消息失败，数据不是有效的 JSON 字符串:', error)
  }
}

onMounted(() => { 
  console.log(' WebSocket onMounted') 
  eventBus.on('websocket-message', handleMessage) 
})

onUnmounted(() => { 
  console.log(' WebSocket onUnmounted') 
  eventBus.off('websocket-message', handleMessage) 
})

</script>

<style scoped>
.view-container {
  display: flex;
  height: 100%;
  background-color: #1a1b1e;
  color: #ffffff;
}

.left-panel {
  width: 33.333%;
  padding: 24px;
  border-right: 1px solid #2f3136;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
}

.tab-group {
  display: flex;
  background: #2f3136;
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
}

.tab-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #8e9297;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button.active {
  background: #40444b;
  color: #ffffff;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 14px;
  color: #8e9297;
}

.more {
  font-size: 12px;
  color: #8e9297;
  cursor: pointer;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.upload-box, .image-box {
  aspect-ratio: 1;
  background: #2f3136;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.upload-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #40444b;
}

.plus-icon {
  font-size: 24px;
  color: #8e9297;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 14px;
  color: #8e9297;
}

.setting-options {
  display: flex;
  gap: 8px;
}

.option-button {
  flex: 1;
  padding: 8px;
  background: #2f3136;
  border: 1px solid #40444b;
  border-radius: 6px;
  color: #8e9297;
  cursor: pointer;
}

.option-button.active {
  background: #4776E6;
  border-color: #4776E6;
  color: #ffffff;
}

.select-box {
  width: 100%;
}

.select-box select {
  width: 100%;
  padding: 8px;
  background: #2f3136;
  border: 1px solid #40444b;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
}

.disclaimer {
  color: #8e9297;
  font-size: 12px;
  text-align: center;
  margin-top: auto;
  padding: 12px 0;
}

.generate-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}

.hidden {
  display: none;
}

.right-panel {
  flex: 1;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #1a1b1e;
}

.result-card {
  width: 100%;
  max-width: 800px;
  background: #1e1f23;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #2f3136;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2f3136;
}

.name {
  font-weight: 500;
}

.time {
  color: #8e9297;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: #2f3136;
  border: none;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #40444b;
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.source-images {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.source-image {
  width: 120px;
  height: 120px;
  background: #2f3136;
  border-radius: 8px;
  overflow: hidden;
}

.source-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plus-icon {
  font-size: 24px;
  color: #8e9297;
}

.result-image {
  width: 100%;
  height: 500px;
  background: #2f3136;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.status-text {
  text-align: center;
  color: #8e9297;
  padding: 16px 0;
  border-top: 1px solid #2f3136;
}

/* 添加占位文本样式 */
.placeholder-text {
  color: #8e9297;
  font-size: 14px;
}
</style>