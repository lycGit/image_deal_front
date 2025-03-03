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
      <div class="section">
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
      </div>
    
      <!-- 生成按钮 -->
      <button 
        class="generate-button"
        :disabled="!canGenerate"
        @click="handleGenerate"
      >
        开始生成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const prompt = ref('')
const referenceImage = ref(null)
const fileInput = ref(null)
const selectedRatio = ref('1:1')

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

const handleGenerate = () => {
  if (!canGenerate.value) return
  // TODO: 实现生成逻辑
}
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
  height: 120px;
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
  height: 80px;
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
  height: 100%;
  object-fit: cover;
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
</style>