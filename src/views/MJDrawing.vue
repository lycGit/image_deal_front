<template>
  <div class="view-container">
    <!-- 内容区域 -->
    <div class="content">
      <!-- 生成的图片展示区域 -->
      <div class="scrollable-content">
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

    <!-- 固定在底部的输入框 -->
    <div class="prompt-box-container">
      <div class="mode-switch">
        <button 
          class="mode-button active"
          @click="switchMode('text')"
        >
          文生图
        </button>
        <button 
          class="mode-button"
          @click="switchMode('image')"
        >
          图生图
        </button>
      </div>
      <div class="prompt-box">
        <div class="prompt-input">
          <input 
            type="text" 
            v-model="prompt"
            placeholder="请输入MJ提示词,支持中文。当前为快速模式，生成8算力" 
            @keyup.shift.enter="handleEnter"
          />
          <div class="input-actions">
            <button class="action-icon">
              <i class="fas fa-sliders-h"></i>
            </button>
            <button class="action-icon">
              <i class="fas fa-sync-alt"></i>
            </button>
            <button class="send-button" @click="handleSubmit">
              绘画 <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式状态
const prompt = ref('')
const generatedImages = ref([])
const currentMode = ref('text')

// 方法
const switchMode = (mode) => {
  currentMode.value = mode
}

const handleEnter = () => {
  handleSubmit()
}

const handleSubmit = () => {
  if (!prompt.value.trim()) return
  
  // TODO: 调用 API 生成图片
  console.log('提交:', {
    prompt: prompt.value
  })

  // 模拟生成图片
  generatedImages.value.push({
    url: 'https://picsum.photos/400/400',
    timestamp: Date.now()
  })
}
</script>

<style scoped>
.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.prompt-box-container {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  background-color: #1e1f22;
  padding: 16px 20px;
  z-index: 10;
  border-radius: 8px;
  margin: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.prompt-input {
  display: flex;
  gap: 12px;
  align-items: center;
  background-color: #313338;
  border-radius: 6px;
  padding: 8px 12px;
}

.prompt-input input {
  flex: 1;
  background: none;
  border: none;
  padding: 8px;
  color: #ffffff;
  font-size: 14px;
}

.prompt-input input:focus {
  outline: none;
}

.input-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.mode-switch {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
}

.mode-button {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.send-button {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 140px 20px;
}
</style>