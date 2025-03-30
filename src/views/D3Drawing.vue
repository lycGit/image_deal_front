<template>
  <div class="d3-drawing">
    <!-- 添加图片展示区域 -->
    <div class="image-gallery">
      <div v-for="(image, index) in generatedImages" :key="index" class="image-card">
        <div class="image-header">
          <span class="timestamp">{{ formatTime(image.timestamp) }}</span>
        </div>
        <div class="image-container">
          <img :src="image.url" :alt="image.description" />
        </div>
        <div class="image-footer">
          <p class="description">{{ image.prompt }}</p>
        </div>
      </div>
    </div>

    <div class="prompt-box">
      <!-- 原有的输入框和按钮代码保持不变 -->
      <div class="prompt-input">
        <input 
          type="text" 
          v-model="prompt"
          placeholder="请输入AI画的描述，'Shift+回车'换行。" 
          @keyup.shift.enter="handleEnter"
        />
        <button class="send-button" @click="handleSubmit">
          发送 <i class="fas fa-paper-plane"></i>
        </button>
      </div>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const prompt = ref('')
const selectedOption = ref('')
const generatedImages = ref([]) // 添加图片数组

// 添加时间格式化函数
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 修改提交函数
const handleSubmit = async () => {
  console.log("prompt:--", prompt)
  if (!prompt.value.trim()) return
  
  try {
    const response = await fetch(`http://localhost:8091/api/createImage/${encodeURIComponent(prompt.value)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.log("网络请求失败")
      throw new Error('网络请求失败')
    }

    const data = await response.json()
    console.log("网络请求成功", data)
    generatedImages.value.unshift({
      url: data.imageUrl,
      description: data.description,
      timestamp: Date.now(),
      prompt: prompt.value
    })

    prompt.value = ''
  } catch (error) {
    console.error('生成图片失败:', error)
  }
}

const options = [
  { label: '写实', value: 'realistic' },
  { label: '自然', value: 'natural' },
  { label: '高清', value: 'hd' },
  { label: '超清', value: 'uhd' },
  { label: '1:1', value: '1:1' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' }
]

const handleEnter = () => {
  handleSubmit()
}

const selectOption = (value) => {
  selectedOption.value = value
}
</script>

<style scoped>
/* 现有样式保持不变 */

/* 添加图片展示相关样式 */
.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.image-card {
  background-color: #1f2128;
  border-radius: 12px;
  overflow: hidden;
}

.image-header {
  padding: 12px;
  border-bottom: 1px solid #2a2c34;
}

.timestamp {
  color: #8e9297;
  font-size: 14px;
}

.image-container {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.image-footer {
  padding: 12px;
  border-top: 1px solid #2a2c34;
}

.description {
  color: #ffffff;
  font-size: 14px;
  margin: 0;
}

/* 调整现有布局 */
.d3-drawing {
  padding: 20px;
}

.prompt-box {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
}

.prompt-input {
  display: flex;
  gap: 10px;
}

.prompt-input input {
  flex: 1;
  background-color: #2a2c34;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: #ffffff;
}

.prompt-input input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(45, 101, 242, 0.5);
}

.send-button {
  background-color: #2d65f2;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #1e54e7;
}

.image-options {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.option-button {
  background-color: #2a2c34;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.option-button:hover {
  background-color: #3a3c44;
}

.option-button.active {
  background-color: #2d65f2;
  color: white;
}
</style>