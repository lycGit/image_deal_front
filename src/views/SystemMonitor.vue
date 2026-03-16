<template>
  <div class="monitor-container">
    <div class="monitor-header">
      <h1>系统运行监测</h1>
      <p class="subtitle">定时触发证件照生成，检测系统运行状态</p>
    </div>

    <div class="monitor-content">
      <!-- 配置区域 -->
      <div class="config-section">
        <div class="section-title">监测配置</div>
        
        <div class="config-item">
          <label class="config-label">检测间隔（小时）</label>
          <div class="input-group">
            <input 
              type="number" 
              v-model="intervalHours" 
              min="0.5" 
              max="24" 
              step="0.5"
              class="config-input"
              :disabled="isMonitoring"
            />
            <span class="input-unit">小时</span>
          </div>
        </div>

        <div class="config-item">
          <label class="config-label">参考图片（系统默认）</label>
          <div class="reference-image-container">
            <img :src="referenceImage" class="reference-image" alt="参考图片" />
          </div>
        </div>

        <div class="config-item">
          <label class="config-label">选择模板</label>
          <div class="template-grid">
            <div 
              v-for="(avatar, index) in defaultAvatars" 
              :key="index"
              class="template-item"
              :class="{ active: selectedAvatar === avatar }"
              @click="selectAvatar(avatar)"
            >
              <img :src="avatar.image" :alt="avatar.description" />
              <div class="template-name">{{ avatar.description }}</div>
            </div>
          </div>
        </div>

        <div class="config-item">
          <label class="config-label">背景颜色</label>
          <div class="color-selection">
            <div 
              class="color-option" 
              :class="{ active: selectedColor === 'white' }"
              @click="selectedColor = 'white'"
            >
              <div class="color-preview white"></div>
              <span class="color-name">白色</span>
            </div>
            <div 
              class="color-option" 
              :class="{ active: selectedColor === 'blue' }"
              @click="selectedColor = 'blue'"
            >
              <div class="color-preview blue"></div>
              <span class="color-name">蓝色</span>
            </div>
            <div 
              class="color-option" 
              :class="{ active: selectedColor === 'red' }"
              @click="selectedColor = 'red'"
            >
              <div class="color-preview red"></div>
              <span class="color-name">红色</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制按钮区域 -->
      <div class="control-section">
        <button 
          class="control-btn start-btn" 
          @click="startMonitoring"
          :disabled="isMonitoring || !canStart"
          v-if="!isMonitoring"
        >
          <span class="btn-icon">▶</span>
          开始监测
        </button>
        <button 
          class="control-btn stop-btn" 
          @click="stopMonitoring"
          v-else
        >
          <span class="btn-icon">⏹</span>
          停止监测
        </button>
      </div>

      <!-- 状态显示区域 -->
      <div class="status-section">
        <div class="status-header">
          <div class="section-title">监测状态</div>
          <div class="status-badge" :class="statusClass">
            {{ statusText }}
          </div>
        </div>

        <div class="status-info">
          <div class="info-item">
            <span class="info-label">下次检测时间:</span>
            <span class="info-value">{{ nextCheckTime || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">已检测次数:</span>
            <span class="info-value">{{ checkCount }} 次</span>
          </div>
          <div class="info-item">
            <span class="info-label">成功次数:</span>
            <span class="info-value success">{{ successCount }} 次</span>
          </div>
          <div class="info-item">
            <span class="info-label">失败次数:</span>
            <span class="info-value error">{{ failCount }} 次</span>
          </div>
        </div>

        <!-- 倒计时显示 -->
        <div class="countdown-section" v-if="isMonitoring">
          <div class="countdown-label">距离下次检测还有</div>
          <div class="countdown-value">{{ countdownText }}</div>
        </div>
      </div>

      <!-- 检测结果日志 -->
      <div class="log-section">
        <div class="section-title">检测日志</div>
        <div class="log-container" ref="logContainer">
          <div 
            v-for="(log, index) in logs" 
            :key="index"
            class="log-item"
            :class="log.type"
          >
            <div class="log-time">{{ log.time }}</div>
            <div class="log-message">{{ log.message }}</div>
            <div class="log-status" :class="log.status">{{ log.statusText }}</div>
          </div>
          <div v-if="logs.length === 0" class="empty-log">
            暂无检测记录
          </div>
        </div>
        <button class="clear-btn" @click="clearLogs" v-if="logs.length > 0">
          清空日志
        </button>
      </div>
    </div>

    <!-- 错误弹窗 -->
    <div class="error-modal" v-if="showErrorModal" @click.self="closeErrorModal">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <div class="error-title">系统异常</div>
        <div class="error-message">{{ errorMessage }}</div>
        <div class="error-detail" v-if="errorDetail">{{ errorDetail }}</div>
        <button class="error-btn" @click="closeErrorModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, getCurrentInstance, nextTick } from 'vue'
import eventBus from '../eventBus'
import { showAlert } from '../js/alertUtil'

const instance = getCurrentInstance();
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091

// 默认头像模板
const defaultAvatars = [
  {
    image: '/images/headerTemplate/male-1.jpg',
    description: '男性正装',
    prompt: '正装证件照，男性，白色衬衫，深色西装'
  },
  {
    image: '/images/headerTemplate/female-1.jpg',
    description: '女性正装',
    prompt: '正装证件照，女性，白色衬衫，深色西装'
  }
]

// 颜色描述映射
const COLOR_DESCRIPTIONS = {
  white: '白色背景，纯白底色，无渐变',
  blue: '蓝色背景，天蓝色底色，纯色背景',
  red: '红色背景，深红色底色，纯色背景'
}

// 状态变量
const intervalHours = ref(1)
const referenceImage = ref('/images/headerTemplate/male-1.jpg')
const selectedAvatar = ref(defaultAvatars[0])
const selectedColor = ref('white')
const isMonitoring = ref(false)
const nextCheckTime = ref('')
const checkCount = ref(0)
const successCount = ref(0)
const failCount = ref(0)
const logs = ref([])
const countdownText = ref('')
const showErrorModal = ref(false)
const errorMessage = ref('')
const errorDetail = ref('')
const logContainer = ref(null)

// 定时器
let checkTimer = null
let countdownTimer = null
let timeoutTimer = null

// 计算属性
const canStart = computed(() => {
  return intervalHours.value >= 0.5 && selectedAvatar.value
})

const statusText = computed(() => {
  if (isMonitoring.value) return '监测中'
  return '已停止'
})

const statusClass = computed(() => {
  if (isMonitoring.value) return 'running'
  return 'stopped'
})

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

// 日志相关
const addLog = (type, message, status = '', statusText = '') => {
  const now = new Date()
  const timeStr = now.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  logs.value.unshift({
    type,
    time: timeStr,
    message,
    status,
    statusText
  })
  
  // 限制日志数量
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(0, 100)
  }
  
  // 滚动到顶部
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = 0
    }
  })
}

const clearLogs = () => {
  logs.value = []
}

// 图片压缩
const compressImage = (imageUrl, maxSizeKB = 300) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      let width = img.width
      let height = img.height
      
      const maxDimension = 1024
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      
      let quality = 0.9
      let result = canvas.toDataURL('image/jpeg', quality)
      
      while (result.length > maxSizeKB * 1024 && quality > 0.1) {
        quality -= 0.1
        result = canvas.toDataURL('image/jpeg', quality)
      }
      
      resolve(result)
    }
    
    img.onerror = reject
    img.src = imageUrl
  })
}

// 执行检测
const performCheck = async () => {
  checkCount.value++
  const currentCheck = checkCount.value
  
  addLog('info', `第 ${currentCheck} 次检测开始...`, 'pending', '检测中')
  
  try {
    // 准备请求数据
    const formData = new FormData()
    
    // 压缩并添加图片
    const compressedImage = await compressImage(referenceImage.value, 300)
    const base64Data = compressedImage.split(',')[1]
    const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())
    formData.append('file', blob, 'reference.jpg')
    
    // 构建prompt
    const colorDescription = COLOR_DESCRIPTIONS[selectedColor.value]
    const fullPrompt = `${selectedAvatar.value.prompt}，${colorDescription}，正脸，看向镜头，对称脸，正面视角，完整头像，完整脸部，无裁切`
    
    formData.append('description', fullPrompt)
    formData.append('category', 'KL_DRAWING')
    formData.append('tags', '1:1')
    
    // 发送请求
    const response = await fetch(`${baseUrl}/api/files/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (!result.imageUrl1) {
      throw new Error('上传接口未返回图片URL')
    }
    
    // 发送WebSocket消息
    const message = JSON.stringify({
      msg: fullPrompt,
      imageUrl: result.imageUrl1,
      userId: 'monitor_system',
      targetUserId: 'user_py_llm',
      action: 'image_edit'
    })
    
    // 等待WebSocket响应
    await waitForWebSocketResponse(message, currentCheck)
    
  } catch (error) {
    handleCheckError(currentCheck, error)
  }
}

// 等待WebSocket响应
const waitForWebSocketResponse = (message, checkIndex) => {
  return new Promise((resolve, reject) => {
    let isResolved = false
    
    // 设置超时
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true
        eventBus.off('websocket-headshot-response', handleMessage)
        reject(new Error('检测超时，系统响应时间超过2分钟'))
      }
    }, 120000)
    
    // 监听WebSocket消息
    const handleMessage = (data) => {
      // 检查消息是否包含 "图片已创建完成" 且包含 imageUrl
      if (data.msg === '图片已创建完成' && data.imageUrl && !isResolved) {
        isResolved = true
        clearTimeout(timeout)
        eventBus.off('websocket-headshot-response', handleMessage)
        
        successCount.value++
        addLog('success', `第 ${checkIndex} 次检测完成`, 'success', '成功')
        resolve(data)
      }
    }
    
    // 注册监听器
    eventBus.on('websocket-headshot-response', handleMessage)
    
    // 发送消息
    eventBus.emit('websocket-headshot', message)
  })
}

// 处理检测错误
const handleCheckError = (checkIndex, error) => {
  failCount.value++
  const errorMsg = error.message || '未知错误'
  
  addLog('error', `第 ${checkIndex} 次检测失败: ${errorMsg}`, 'error', '失败')
  
  // 显示错误弹窗
  errorMessage.value = `第 ${checkIndex} 次检测失败`
  errorDetail.value = errorMsg
  showErrorModal.value = true
  
  // 停止监测
  stopMonitoring()
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
  errorDetail.value = ''
}

// 更新倒计时
const updateCountdown = () => {
  if (!nextCheckTime.value) {
    countdownText.value = '--:--:--'
    return
  }
  
  const now = new Date()
  const next = new Date(nextCheckTime.value)
  const diff = next - now
  
  if (diff <= 0) {
    countdownText.value = '00:00:00'
    return
  }
  
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  
  countdownText.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// 开始监测
const startMonitoring = () => {
  if (!canStart.value) {
    showAlert('请配置检测间隔并选择模板')
    return
  }
  
  isMonitoring.value = true
  addLog('info', '监测已启动')
  
  // 立即执行一次检测
  performCheck()
  
  // 设置定时器
  scheduleNextCheck()
  
  // 启动倒计时
  countdownTimer = setInterval(updateCountdown, 1000)
}

// 安排下次检测
const scheduleNextCheck = () => {
  const intervalMs = intervalHours.value * 3600000
  const nextTime = new Date(Date.now() + intervalMs)
  nextCheckTime.value = nextTime.toLocaleString('zh-CN')
  
  checkTimer = setTimeout(() => {
    performCheck()
    if (isMonitoring.value) {
      scheduleNextCheck()
    }
  }, intervalMs)
}

// 停止监测
const stopMonitoring = () => {
  isMonitoring.value = false
  nextCheckTime.value = ''
  countdownText.value = ''
  
  if (checkTimer) {
    clearTimeout(checkTimer)
    checkTimer = null
  }
  
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
  
  addLog('info', '监测已停止')
}

// 组件卸载时清理
onUnmounted(() => {
  stopMonitoring()
})
</script>

<style scoped>
.monitor-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c23 0%, #2d3748 100%);
  padding: 40px 20px;
  color: #ffffff;
}

.monitor-header {
  text-align: center;
  margin-bottom: 40px;
}

.monitor-header h1 {
  font-size: 32px;
  font-weight: 600;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.subtitle {
  color: #8e9297;
  font-size: 16px;
}

.monitor-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 968px) {
  .monitor-content {
    grid-template-columns: 1fr;
  }
}

/* 配置区域 */
.config-section {
  background: rgba(47, 49, 54, 0.8);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #40444b;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #40444b;
}

.config-item {
  margin-bottom: 24px;
}

.config-label {
  display: block;
  font-size: 14px;
  color: #8e9297;
  margin-bottom: 12px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-input {
  width: 120px;
  padding: 12px 16px;
  background: #1a1c23;
  border: 1px solid #40444b;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  text-align: center;
}

.config-input:focus {
  outline: none;
  border-color: #4776E6;
}

.config-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-unit {
  color: #8e9297;
  font-size: 14px;
}

/* 参考图片区域 */
.reference-image-container {
  background: #1a1c23;
  border: 2px solid #40444b;
  border-radius: 12px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 16px;
}

.reference-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
}

/* 模板网格 */
.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.template-item {
  background: #1a1c23;
  border: 2px solid #40444b;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.template-item:hover {
  border-color: #4776E6;
  transform: translateY(-2px);
}

.template-item.active {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.3);
}

.template-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.template-name {
  padding: 8px;
  text-align: center;
  font-size: 13px;
  color: #ffffff;
  background: #2f3136;
}

/* 颜色选择 */
.color-selection {
  display: flex;
  gap: 16px;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #1a1c23;
  border: 2px solid #40444b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-option:hover {
  border-color: #4776E6;
}

.color-option.active {
  border-color: #4776E6;
  background: rgba(71, 118, 230, 0.1);
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #40444b;
}

.color-preview.white {
  background: #ffffff;
}

.color-preview.blue {
  background: #4A90E2;
}

.color-preview.red {
  background: #E74C3C;
}

.color-name {
  color: #ffffff;
  font-size: 14px;
}

/* 控制按钮区域 */
.control-section {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-btn {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(71, 118, 230, 0.4);
}

.stop-btn {
  background: linear-gradient(90deg, #E74C3C 0%, #C0392B 100%);
  color: #ffffff;
}

.stop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(231, 76, 60, 0.4);
}

.btn-icon {
  font-size: 20px;
}

/* 状态区域 */
.status-section {
  background: rgba(47, 49, 54, 0.8);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #40444b;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #40444b;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-badge.running {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-badge.stopped {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.status-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #1a1c23;
  border-radius: 8px;
}

.info-label {
  color: #8e9297;
  font-size: 14px;
}

.info-value {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.info-value.success {
  color: #2ecc71;
}

.info-value.error {
  color: #e74c3c;
}

/* 倒计时 */
.countdown-section {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(71, 118, 230, 0.1) 0%, rgba(142, 84, 233, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(71, 118, 230, 0.3);
}

.countdown-label {
  color: #8e9297;
  font-size: 14px;
  margin-bottom: 8px;
}

.countdown-value {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Courier New', monospace;
}

/* 日志区域 */
.log-section {
  grid-column: 1 / -1;
  background: rgba(47, 49, 54, 0.8);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #40444b;
}

.log-container {
  max-height: 400px;
  overflow-y: auto;
  background: #1a1c23;
  border-radius: 12px;
  padding: 16px;
}

.log-item {
  display: grid;
  grid-template-columns: 100px 1fr 80px;
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid #2f3136;
  align-items: center;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #8e9297;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.log-message {
  color: #ffffff;
  font-size: 14px;
}

.log-status {
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.log-status.success {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.log-status.error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.log-status.pending {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.log-item.success .log-message {
  color: #2ecc71;
}

.log-item.error .log-message {
  color: #e74c3c;
}

.empty-log {
  text-align: center;
  color: #8e9297;
  padding: 40px;
  font-size: 14px;
}

.clear-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: transparent;
  border: 1px solid #40444b;
  border-radius: 8px;
  color: #8e9297;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

/* 错误弹窗 */
.error-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.error-content {
  background: #2f3136;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 1px solid #e74c3c;
  box-shadow: 0 20px 60px rgba(231, 76, 60, 0.3);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 12px;
}

.error-message {
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 8px;
}

.error-detail {
  color: #8e9297;
  font-size: 14px;
  margin-bottom: 24px;
  padding: 12px;
  background: #1a1c23;
  border-radius: 8px;
}

.error-btn {
  padding: 12px 32px;
  background: #e74c3c;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.error-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1c23;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #4776E6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a85e9;
}
</style>