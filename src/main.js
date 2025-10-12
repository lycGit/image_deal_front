import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import config from './lib/config/config.js';
import eventBus from './eventBus'

const app = createApp(App)
app.use(router)
app.config.productionTip = false
app.use(config);

// WebSocket 相关逻辑
let ws = null;
let pingInterval = null;
const PING_INTERVAL = 30000; // 30 秒发送一次 ping

const connectWebSocket = () => {
  // ws = new WebSocket('ws://127.0.0.1:8092/webSocket/lyc2');
  ws = new WebSocket('ws://120.27.130.190:8092/webSocket/lyc2');

  ws.onopen = () => {
    console.log('WebSocket 连接成功');
    // 连接成功后开始定时发送 ping
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        var msg = "{'msg': 'ping', 'userId': 'lyc2', 'targetUserId': 'lyc2'}"
        ws.send(msg);
      }
    }, PING_INTERVAL);
  };

  ws.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    if (parsedData["msg"] === 'pong') {
      // eventBus.emit('websocket-message', event.data);
      console.log('收到 pong 响应');
    } else {
      console.log('收到 parsedData 响应',parsedData);
      eventBus.emit('websocket-message', parsedData);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
    clearInterval(pingInterval);
  };

  ws.onclose = () => {
    console.log('WebSocket 连接关闭');
    clearInterval(pingInterval);
    // 尝试重新连接
    setTimeout(connectWebSocket, 5000);
  };
};

// 注册 eventBus 监听
const handleMJDrawingMessage = (data) => {
  console.log('main.js 收到 WebSocket 消息:', data);
  ws.send(data);
  // 这里可以添加更多的消息处理逻辑
};

// 注册 eventBus 监听
const handleImageSwapMessage = (data) => {
  console.log('main.js 收到 WebSocket 消息:', data);
  ws.send(data);
  // 这里可以添加更多的消息处理逻辑
};

const handleImage2ImageMessage = (data) => {
  console.log('main.js 收到 WebSocket 消息:', data);
  ws.send(data);
  // 这里可以添加更多的消息处理逻辑
};

// 添加监听器
if (eventBus.on) {
  eventBus.on('websocket-MJDrawing', handleMJDrawingMessage);
  eventBus.on('websocket-ImageSwap', handleImageSwapMessage);
  eventBus.on('websocket-Image2Image', handleImage2ImageMessage);
}

// 启动时连接 WebSocket
connectWebSocket();

app.mount('#app')
