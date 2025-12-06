<template>
  <div class="view-container">
    <div class="left-panel">
      <div class="header">AI绘画</div>
      
      <!-- 创意描述输入区域 -->
      <div class="section">
        <div class="section-title">创意描述</div>
        <div class="input-wrapper">
          <textarea
            v-model="prompt"
            placeholder="请输入创意描述"
            :maxlength="500"
          ></textarea>
          <div class="word-count">{{ prompt.length }}/500</div>
        </div>
      </div>
    
      <!-- 参考图片上传区域 -->
      <div class="section">
        <div class="section-title">参考图/热图（选填）</div>
        <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
          <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
          <div class="upload-content" v-if="!referenceImage">
            <div class="upload-icon">+</div>
            <div class="upload-text">点击/拖拽图片,高宽不小于300px</div>
          </div>
          <img v-else :src="referenceImage" class="reference-image" alt="参考图片" />
        </div>
      </div>
    
      <!-- 参数设置区域 -->
      <!-- <div class="section">
        <div class="section-title">参数设置</div>
        <div class="ratio-grid">
          <button 
            v-for="ratio in ratios" 
            :key="ratio.value"
            class="ratio-button"
            :class="{ active: selectedRatio === ratio.value }"
            @click="selectRatio(ratio.value)"
          >
            {{ ratio.label }}
          </button>
        </div>
      </div> -->
    
      <!-- 生成按钮 -->
      <button 
        class="generate-button"
        :disabled="!canGenerate"
        @click="handleGenerate"
      >
        开始生成
      </button>
    </div>
    
    <!-- 添加右侧展示区域 -->
    <div class="right-panel">
      <div class="top-bar">
        <!-- <div class="status-text">没有更多了</div> -->
        <div class="actions">
          <!-- <button class="action-button">案例</button> -->
          <button class="action-button">我的作品</button>
          <button class="action-button">下载</button>
        </div>
      </div>
      
      <div class="gallery">
        <div v-for="(item, index) in generatedItems" :key="index" class="image-group">
          <div class="group-title">
            <i class="copy-icon"></i>
            {{ item.description }}
          </div>
          <div class="image-container">
            <div class="image-wrapper">
              <img :src="item.url" :alt="item.description" />
              <div class="image-actions">
                <button class="image-action">垫图</button>
                <button class="image-action">生成视频</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed ,onMounted, onUnmounted} from 'vue'
import { getCurrentInstance } from 'vue';
import eventBus from '../eventBus'

const prompt = ref('')
const referenceImage = ref(null)
const fileInput = ref(null)
const selectedRatio = ref('1:1')
const instance = getCurrentInstance();
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091 

const ratios = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '3:2', value: '3:2' },
  { label: '2:3', value: '2:3' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' }
]

const canGenerate = computed(() => prompt.value.trim().length > 0)

const selectRatio = (ratio) => {
  selectedRatio.value = ratio
}

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
    referenceImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 添加生成记录数组
const generatedItems = ref([])

const handleGenerate = async () => {
  if (!canGenerate.value) return
  
  try {
    // 创建 FormData 对象
    const formData = new FormData()
    let uploadedImageUrl = null
    
    // 如果有参考图片，添加到 formData
    if (referenceImage.value) {
      const base64Data = referenceImage.value.split(',')[1]
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())
      formData.append('file', blob, 'reference.jpg')
      uploadedImageUrl = URL.createObjectURL(blob)
    }
    
    // 添加其他参数
    formData.append('description', prompt.value)
    formData.append('category', 'KL_DRAWING')
    formData.append('tags', selectedRatio.value)

    const response = await fetch(`${baseUrl}/api/files/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    // const result = await response.text()
    const result = await response.json()
    console.log('上传成功:', result)
    console.log('上传图片地址:', uploadedImageUrl)
    const message = JSON.stringify({'msg': prompt.value, 'imageUrl': result.imageUrl1,  'userId': 'lyc2', 'targetUserId': 'user_py_llm', 'action': 'image2image'});
    eventBus.emit('websocket-Image2Image', message);

    // 添加到生成记录
    // generatedItems.value.unshift({
    //   url: uploadedImageUrl || '/placeholder-image.png', // 如果没有上传图片则使用占位图
    //   description: prompt.value,
    //   timestamp: Date.now()
    // })

    // 清空输入
    // prompt.value = ''
    // referenceImage.value = null

  } catch (error) {
    console.error('生成失败:', error)
  }
}

const handleMessage = (data) => { 
  console.log('收到 WebSocket 消息:', data)
  try {
    if (data.imageUrl) {
      // 添加到生成记录
      generatedItems.value.unshift({
        url: data.imageUrl || '/placeholder-image.png', // 如果没有上传图片则使用占位图
        description: prompt.value,
        timestamp: Date.now()
      })
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
  height: 100%;
  background-color: #1a1b1e;
  display: flex;
}

.left-panel {
  width: 33.333%;
  padding: 24px;
  border-right: 1px solid #2f3136;
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
  gap: 12px;
}

.section-title {
  font-size: 14px;
  color: #8e9297;
}

.input-wrapper {
  position: relative;
}

textarea {
  width: 100%;
  height: 240px;
  background-color: #2f3136;
  border: 1px solid #40444b;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: #4776E6;
}

.word-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 12px;
  color: #8e9297;
}

.upload-area {
  background-color: #2f3136;
  border: 1px dashed #40444b;
  border-radius: 8px;
  min-height: 80px;
  max-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #4776E6;
}

.upload-content {
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 24px;
  color: #8e9297;
}

.upload-text {
  color: #8e9297;
  font-size: 14px;
}

.reference-image {
  width: 100%;
  height: auto;
}

.ratio-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ratio-button {
  background-color: #2f3136;
  border: 1px solid #40444b;
  padding: 12px 8px;
  border-radius: 8px;
  color: #8e9297;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.ratio-button:hover {
  border-color: #4776E6;
}

.ratio-button.active {
  background-color: #4776E6;
  border-color: #4776E6;
  color: #ffffff;
}

.generate-button {
  margin-top: auto;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hidden {
  display: none;
}

.right-panel {
  flex: 1;
  height: 100vh;
  padding: 20px;
  overflow-y: auto;
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-group {
  min-height: calc(33.333vh - 20px);
  background-color: #2a2c34;
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;  /* 添加动画效果 */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.group-title {
  padding: 16px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #40444b;
}

.copy-icon {
  width: 16px;
  height: 16px;
  background-color: #8e9297;
  border-radius: 2px;
}

.image-container {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.image-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  width: 50%;  /* 修改为50% */
  max-width: 400px;  /* 修改最大宽度 */
  margin: 0 auto;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
}

/* 移除不需要的 .image-grid 相关样式 */
</style>