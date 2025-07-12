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
    if (event.data["msg"] === 'pong') {
      eventBus.emit('websocket-message', event.data);
      console.log('收到 pong 响应');
    } else {
      eventBus.emit('websocket-message', event.data);
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

// 启动时连接 WebSocket
connectWebSocket();

app.mount('#app')
