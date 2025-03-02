<template>
  <div class="view-container">
    <div class="content">
      <!-- 提示词输入区域 -->
      <div class="prompt-box">
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
              <button class="action-button">
                <i class="fas fa-download"></i>
              </button>
              <button class="action-button">
                <i class="fas fa-heart"></i>
              </button>
              <button class="action-button">
                <i class="fas fa-share"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div class="empty-state" v-else>
        <i class="fas fa-image empty-icon"></i>
        <p>输入提示词开始创作</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式状态
const prompt = ref('')
const selectedOption = ref('')
const generatedImages = ref([])

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

// 方法
const handleEnter = () => {
  handleSubmit()
}

const handleSubmit = () => {
  if (!prompt.value.trim()) return
  
  // TODO: 调用 API 生成图片
  console.log('提交:', {
    prompt: prompt.value,
    option: selectedOption.value
  })

  // 模拟生成图片
  generatedImages.value.push({
    url: 'https://picsum.photos/400/400', // 使用随机图片作为示例
    timestamp: Date.now()
  })
}

const selectOption = (value) => {
  selectedOption.value = value
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
}

.prompt-box {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
}

.option-button:hover {
  background-color: #3a3c44;
}

.option-button.active {
  background-color: #2d65f2;
  color: white;
}

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
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
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
</style> 