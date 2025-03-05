<template>
  <div class="view-container">
    <div class="left-panel">
      <!-- 顶部标签切换 -->
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

      <!-- 子标签切换 -->
      <div class="sub-tab-group">
        <button 
          v-for="subTab in subTabs" 
          :key="subTab.id"
          class="sub-tab-button"
          :class="{ active: currentSubTab === subTab.id }"
          @click="currentSubTab = subTab.id"
        >
          {{ subTab.name }}
        </button>
      </div>

      <!-- 上传图片区域 -->
      <div class="section">
        <div class="section-title">上传图片</div>
        <div class="upload-area" @click="triggerUpload">
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            @change="handleUpload" 
            accept="image/*"
          />
          <div class="upload-content">
            <div class="plus-icon">+</div>
            <div class="upload-text">点击/拖拽图片,高宽不小于300px</div>
          </div>
        </div>
      </div>

      <!-- 图片用途选择 -->
      <div class="section">
        <div class="section-title">图片用途</div>
        <div class="select-box">
          <select v-model="imageUsage">
            <option value="animation">用作起始帧</option>
          </select>
        </div>
      </div>

      <!-- 创意描述 -->
      <div class="section">
        <div class="section-title">创意描述</div>
        <div class="textarea-box">
          <textarea 
            v-model="description" 
            placeholder="请输入创意描述"
            maxlength="500"
          ></textarea>
          <div class="word-count">{{ description.length }}/500</div>
        </div>
      </div>

      <!-- 参数设置 -->
      <div class="section">
        <div class="section-title">参数设置</div>
        <div class="param-item">
          <span class="param-label">时长</span>
          <div class="select-box">
            <select v-model="duration">
              <option value="4">4s</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 生成按钮 -->
      <button class="generate-button">
        开始生成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('vidu')
const currentSubTab = ref('text')
const fileInput = ref(null)
const imageUsage = ref('animation')
const description = ref('')
const duration = ref('4')

const tabs = [
  { id: 'vidu', name: 'Vidu视频' },
  { id: 'kl', name: 'KL视频' },
  { id: 'pika', name: 'Pika视频' }
]

const subTabs = [
  { id: 'text', name: '文生视频' },
  { id: 'image', name: '图生视频' }
]

const triggerUpload = () => {
  fileInput.value.click()
}

const handleUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 处理文件上传
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

.sub-tab-group {
  display: flex;
  gap: 8px;
}

.sub-tab-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #2f3136;
  color: #8e9297;
  cursor: pointer;
}

.sub-tab-button.active {
  background: #40444b;
  color: #ffffff;
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

.upload-area {
  height: 200px;
  background: #2f3136;
  border: 2px dashed #40444b;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-content {
  text-align: center;
}

.plus-icon {
  font-size: 24px;
  color: #8e9297;
  margin-bottom: 8px;
}

.upload-text {
  color: #8e9297;
  font-size: 14px;
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

.textarea-box {
  position: relative;
}

textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  background: #2f3136;
  border: 1px solid #40444b;
  border-radius: 6px;
  color: #ffffff;
  resize: none;
}

.word-count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: #8e9297;
  font-size: 12px;
}

.param-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.param-label {
  color: #8e9297;
  font-size: 14px;
  min-width: 60px;
}

.generate-button {
  margin-top: auto;
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