<template>
  <div class="monitor-container">
    <div class="monitor-header">
      <h1>🖥️ 系统监测</h1>
      <p class="subtitle">自动监测系统运行状态</p>
    </div>

    <div class="monitor-content">
      <!-- 监测配置 -->
      <div class="config-section">
        <h2 class="section-title">⚙️ 监测配置</h2>
        
        <div class="config-item">
          <label class="config-label">检测间隔</label>
          <div class="input-group">
            <input 
              v-model.number="intervalHours" 
              type="number" 
              class="config-input" 
              min="0.5" 
              max="24" 
              step="0.5"
              :disabled="isMonitoring"
            />
            <span class="input-unit">小时</span>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-section">
        <button 
          v-if="!isMonitoring" 
          class="control-btn start-btn" 
          :disabled="!canStart"
          @click="startMonitoring"
        >
          <span class="btn-icon">▶️</span>
          开始监测
        </button>
        <button 
          v-else 
          class="control-btn stop-btn" 
          @click="stopMonitoring"
        >
          <span class="btn-icon">⏹️</span>
          停止监测
        </button>
      </div>
    </div>

    <!-- 错误弹窗 -->
    <div v-if="showErrorModal" class="error-modal" @click.self="closeErrorModal">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">检测失败</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <p class="error-detail">{{ errorDetail }}</p>
        <button class="error-btn" @click="closeErrorModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, getCurrentInstance } from 'vue'
import eventBus from '../eventBus'
import { showAlert } from '../js/alertUtil'

// 获取基础URL
const instance = getCurrentInstance()
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091 || 'http://localhost:8091'

// 状态变量
const intervalHours = ref(1)
const isMonitoring = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const errorDetail = ref('')

// 定时器变量
let checkTimer = null
let timeoutTimer = null

// 计算属性
const canStart = computed(() => {
  return intervalHours.value >= 0.5
})

// 执行检测
const performCheck = async () => {
  try {
    // 获取参考图片
    const imageUrl = '/images/headerTemplate/male-1.jpg'
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    
    // 创建 FormData
    const formData = new FormData()
    formData.append('file', blob, 'reference.jpg')
    formData.append('description', '生成一张商务证件照，基于参考图片，使用默认模板，白色背景')
    formData.append('category', 'KL_DRAWING')
    formData.append('tags', '1:1')
    
    // 上传图片
    const uploadResponse = await fetch(`${baseUrl}/api/files/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!uploadResponse.ok) {
      throw new Error(`上传失败: ${uploadResponse.status}`)
    }
    
    const result = await uploadResponse.json()
    
    if (!result.imageUrl1) {
      throw new Error('上传接口未返回图片URL')
    }
    
    // 构建提示词
    const fullPrompt = `生成一张商务证件照，基于参考图片，使用默认模板，白色背景`
    
    // 发送WebSocket消息
    const message = JSON.stringify({
      msg: fullPrompt,
      imageUrl: result.imageUrl1,
      userId: 'monitor_system',
      targetUserId: 'user_py_llm',
      action: 'image_edit'
    })
    
    // 等待WebSocket响应
    await waitForWebSocketResponse(message)
    
  } catch (error) {
    handleCheckError(error)
  }
}

// 等待WebSocket响应
const waitForWebSocketResponse = (message) => {
  return new Promise((resolve, reject) => {
    let isResolved = false
    
    // 设置超时
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true
        eventBus.off('websocket-message', handleMessage)
        reject(new Error('检测超时，系统响应时间超过2分钟'))
      }
    }, 120000)
    
    // 监听WebSocket消息
    const handleMessage = (data) => {
      // 检查消息是否包含 "图片已创建完成" 且包含 imageUrl
      if (data.msg === '图片已创建完成' && data.imageUrl && !isResolved) {
        isResolved = true
        clearTimeout(timeout)
        eventBus.off('websocket-message', handleMessage)
        resolve(data)
      }
    }
    
    // 注册监听器
    eventBus.on('websocket-message', handleMessage)
    
    // 发送消息
    eventBus.emit('websocket-headshot', message)
  })
}

// 处理检测错误
const handleCheckError = (error) => {
  const errorMsg = error.message || '未知错误'
  
  // 显示错误弹窗
  errorMessage.value = '检测失败'
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

// 开始监测
const startMonitoring = () => {
  if (!canStart.value) {
    showAlert('请配置检测间隔')
    return
  }
  
  isMonitoring.value = true
  
  // 立即执行一次检测
  performCheck()
  
  // 设置定时器
  scheduleNextCheck()
}

// 安排下次检测
const scheduleNextCheck = () => {
  const intervalMs = intervalHours.value * 3600000
  
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
  
  if (checkTimer) {
    clearTimeout(checkTimer)
    checkTimer = null
  }
  
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
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
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

/* 控制按钮区域 */
.control-section {
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
</style>