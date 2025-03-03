<template>
  <div class="view-container">
    <div class="content">
      <div class="workspace">
        <!-- 左侧上传和设置区域 -->
        <div class="left-panel">
          <!-- 视频上传 -->
          <div class="upload-section">
            <h3>上传视频</h3>
            <div class="upload-area" @click="triggerVideoUpload" @dragover.prevent @drop="handleVideoDrop">
              <input type="file" ref="videoFileInput" class="hidden" @change="handleVideoFileChange" accept="video/*" />
              <div class="upload-content" v-if="!videoFile">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>点击或拖拽上传视频</p>
                <span class="upload-tip">支持 mp4、mov 格式，建议时长不超过1分钟</span>
              </div>
              <div v-else class="video-preview">
                <video ref="videoPreview" controls>
                  <source :src="videoUrl" type="video/mp4">
                </video>
                <div class="video-info">
                  <span>{{ videoFile.name }}</span>
                  <span>{{ formatFileSize(videoFile.size) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 参数设置 -->
          <div class="settings-section" v-if="videoFile">
            <h3>生成参数</h3>
            <div class="settings-form">
              <div class="form-item">
                <label>视频质量</label>
                <div class="quality-options">
                  <button 
                    v-for="option in qualityOptions" 
                    :key="option.value"
                    :class="['quality-btn', { active: selectedQuality === option.value }]"
                    @click="selectQuality(option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
              <div class="form-item">
                <label>处理速度</label>
                <div class="slider-container">
                  <input 
                    type="range" 
                    v-model="processSpeed" 
                    min="1" 
                    max="5" 
                    class="speed-slider"
                  >
                  <div class="speed-value">{{ processSpeed }}x</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-bar" v-if="videoFile">
            <button class="reset-button" @click="resetUpload">
              <i class="fas fa-undo"></i>
              重新上传
            </button>
            <button 
              class="generate-button" 
              :disabled="isLoading || !canGenerate"
              @click="handleGenerate"
            >
              <i class="fas fa-magic"></i>
              开始生成
            </button>
          </div>
        </div>

        <!-- 右侧结果展示区域 -->
        <div class="right-panel" v-if="resultVideo">
          <div class="result-container">
            <div class="result-header">
              <h3>生成结果</h3>
              <div class="result-actions">
                <button class="action-button" @click="handleDownload">
                  <i class="fas fa-download"></i>
                  下载
                </button>
                <button class="action-button" @click="handleShare">
                  <i class="fas fa-share"></i>
                  分享
                </button>
              </div>
            </div>
            <div class="result-preview">
              <video controls>
                <source :src="resultVideo" type="video/mp4">
              </video>
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div class="empty-state" v-if="!videoFile && !resultVideo">
          <i class="fas fa-video empty-icon"></i>
          <p>上传视频开始AI处理</p>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>正在进行视频处理...</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式状态
const videoFile = ref(null)
const videoUrl = ref(null)
const resultVideo = ref(null)
const isLoading = ref(false)
const progress = ref(0)
const videoFileInput = ref(null)
const videoPreview = ref(null)
const selectedQuality = ref('high')
const processSpeed = ref(3)

// 质量选项
const qualityOptions = [
  { label: '标准', value: 'standard' },
  { label: '高清', value: 'high' },
  { label: '超清', value: 'ultra' }
]

// 计算属性
const canGenerate = computed(() => {
  return videoFile.value && selectedQuality.value
})

// 方法
const triggerVideoUpload = () => {
  videoFileInput.value.click()
}

const handleVideoFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleVideoDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleFile = (file) => {
  if (!file.type.startsWith('video/')) {
    // TODO: 显示错误提示
    return
  }

  videoFile.value = file
  videoUrl.value = URL.createObjectURL(file)
  resultVideo.value = null // 清除之前的结果
}

const selectQuality = (quality) => {
  selectedQuality.value = quality
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const resetUpload = () => {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value)
  }
  videoFile.value = null
  videoUrl.value = null
  resultVideo.value = null
  videoFileInput.value.value = ''
  selectedQuality.value = 'high'
  processSpeed.value = 3
}

const handleGenerate = async () => {
  if (!canGenerate.value || isLoading.value) return
  
  isLoading.value = true
  progress.value = 0
  
  try {
    // 模拟进度更新
    const interval = setInterval(() => {
      if (progress.value < 98) {
        progress.value += 2
      }
    }, 200)

    // TODO: 调用实际的视频处理 API
    await new Promise(resolve => setTimeout(resolve, 5000)) // 模拟 API 调用
    
    clearInterval(interval)
    progress.value = 100
    
    // 模拟生成结果
    resultVideo.value = videoUrl.value // 这里应该是 API 返回的处理结果
  } catch (error) {
    console.error('视频处理失败:', error)
    // TODO: 显示错误提示
  } finally {
    isLoading.value = false
  }
}

const handleDownload = () => {
  if (!resultVideo.value) return
  
  const link = document.createElement('a')
  link.href = resultVideo.value
  link.download = `ai-video-${Date.now()}.mp4`
  link.click()
}

const handleShare = () => {
  if (!resultVideo.value || !navigator.share) return
  
  navigator.share({
    title: 'AI视频处理结果',
    text: '查看我用AI处理的视频效果',
    url: resultVideo.value
  })
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
  position: relative;
}

.workspace {
  display: flex;
  gap: 20px;
  min-height: 600px;
}

.left-panel {
  width: 400px;
  flex-shrink: 0;
}

.right-panel {
  flex: 1;
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-section h3 {
  font-size: 16px;
  margin: 0 0 12px;
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

.upload-content p {
  font-size: 14px;
  margin: 0;
}

.upload-tip {
  font-size: 12px;
  margin-top: 8px;
  display: block;
}

.video-preview {
  width: 100%;
}

.video-preview video {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #8b8c91;
}

.settings-section {
  margin-bottom: 20px;
}

.settings-section h3 {
  font-size: 16px;
  margin: 0 0 12px;
}

.settings-form {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 16px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
}

.quality-options {
  display: flex;
  gap: 8px;
}

.quality-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #2a2c34;
  border-radius: 6px;
  background: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.quality-btn:hover {
  background-color: #2a2c34;
}

.quality-btn.active {
  background-color: #2d65f2;
  border-color: #2d65f2;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.speed-slider {
  flex: 1;
  height: 4px;
  background: #2a2c34;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #2d65f2;
  border-radius: 50%;
  cursor: pointer;
}

.speed-value {
  font-size: 14px;
  color: #8b8c91;
  width: 30px;
}

.action-bar {
  display: flex;
  gap: 10px;
}

.reset-button, .generate-button {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.reset-button {
  background: none;
  border: 1px solid #2a2c34;
  color: #ffffff;
}

.reset-button:hover {
  background-color: #2a2c34;
}

.generate-button {
  background-color: #2d65f2;
  border: none;
  color: white;
}

.generate-button:hover {
  background-color: #1e54e7;
}

.generate-button:disabled {
  background-color: #4a4b52;
  cursor: not-allowed;
}

.result-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-header h3 {
  font-size: 16px;
  margin: 0;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  background: none;
  border: 1px solid #2a2c34;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  font-size: 14px;
}

.action-button:hover {
  background-color: #2a2c34;
}

.result-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-preview video {
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
  background-color: #2a2c34;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b8c91;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
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
  margin-bottom: 12px;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background-color: #2a2c34;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress {
  height: 100%;
  background-color: #2d65f2;
  transition: width 0.2s;
}

.progress-text {
  font-size: 12px;
  color: #8b8c91;
}

.hidden {
  display: none;
}
</style> 