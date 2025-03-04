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
      <button class="generate-button">
        开始AI换脸
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('single')
const templateInput = ref(null)
const faceInput = ref(null)
const templateImages = ref([])
const faceImages = ref([])
const selectedResolution = ref('normal')
const selectedFaceIndex = ref('all')

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
  templateInput.value.click()
}

const triggerFaceUpload = () => {
  faceInput.value.click()
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
</style>