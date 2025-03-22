<template>
  <div class="chat-container">
    <div class="connection-status">
      <button @click="connect" :disabled="isConnected">连接</button>
      <button @click="disconnect" :disabled="!isConnected">断开</button>
      <span :class="['status', isConnected ? 'connected' : 'disconnected']">
        {{ isConnected ? '已连接' : '未连接' }}
      </span>
    </div>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message.body }}
      </div>
    </div>
    <div class="input-area">
      <input 
        v-model="inputMessage" 
        @keyup.enter="sendMessage" 
        placeholder="输入消息..."
        :disabled="!isConnected"
      >
      <button @click="sendMessage" :disabled="!isConnected">发送</button>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue'

export default {
  setup() {
    const ws = ref(null)
    const isConnected = ref(false)
    const messages = ref([])
    const inputMessage = ref('')

    const connect = () => {
      ws.value = new WebSocket('ws://127.0.0.1:8092/webSocket')
      
      ws.value.onopen = () => {
        isConnected.value = true
        console.log('WebSocket连接成功')
      }

      ws.value.onmessage = (event) => {
        messages.value.push({
          body: event.data
        })
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket错误:', error)
        isConnected.value = false
      }

      ws.value.onclose = () => {
        console.log('WebSocket连接关闭')
        isConnected.value = false
      }
    }

    const disconnect = () => {
      if (ws.value) {
        ws.value.close()
        isConnected.value = false
      }
    }

    const sendMessage = () => {
      if (inputMessage.value.trim() && isConnected.value) {
        ws.value.send(inputMessage.value)
        inputMessage.value = ''
      }
    }

    onUnmounted(() => {
      disconnect()
    })

    return {
      isConnected,
      messages,
      inputMessage,
      connect,
      disconnect,
      sendMessage
    }
  }
}
</script>

<style scoped>
.chat-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.connection-status {
  display: flex;
  gap: 10px;
  align-items: center;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.connected {
  background: #4CAF50;
  color: white;
}

.disconnected {
  background: #f44336;
  color: white;
}

.messages {
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
}

.message {
  margin-bottom: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 8px 16px;
  background: #4776E6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background: #3665d5;
}
</style>