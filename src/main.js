import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import config from './lib/config/config.js';
import eventBus from './eventBus'
import { getAllConfigs } from './js/configUtil'; // 导入获取配置的函数
import { initUserId, getUserId } from './js/userIdUtil'; // 导入用户ID工具

const app = createApp(App)
app.use(router)
app.config.productionTip = false
app.use(config);

// 初始化用户ID
const USER_ID = initUserId();
console.log('当前用户ID:', USER_ID);

// WebSocket 相关逻辑
let ws = null;
let pingInterval = null;
const PING_INTERVAL = 5000; // 5 秒发送一次 ping

const connectWebSocket = () => {
  // ws = new WebSocket('ws://127.0.0.1:8092/webSocket/' + USER_ID);
  ws = new WebSocket('ws://120.27.130.190:8092/webSocket/' + USER_ID);

  ws.onopen = () => {
    console.log('WebSocket 连接成功');
    // 连接成功后开始定时发送 ping
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        var msg = `{'msg': 'ping', 'userId': '${USER_ID}', 'targetUserId': '${USER_ID}'}`
        ws.send(msg);
      }
    }, PING_INTERVAL);
  };

  // 添加变量用于跟踪user_py_llm的在线状态检查
  let pyLlmCheckTimeout = null;
  let isCheckingPyLlmOnline = false;
  
  ws.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    
    // 先检查是否收到来自user_py_llm的回复
    if (parsedData["msg"] === 'pong' && parsedData["userId"] === 'user_py_llm') {
      console.log('收到user_py_llm的在线确认响应');
      clearTimeout(pyLlmCheckTimeout);
    }
    // 然后处理其他pong响应
    else if (parsedData["msg"] === 'pong') {
      // eventBus.emit('websocket-message', event.data);
      console.log('收到 pong 响应');
      
      // 当收到pong消息后，发送目标为user_py_llm的ping消息
      if (!isCheckingPyLlmOnline) {
        isCheckingPyLlmOnline = true;
        console.log('开始检查user_py_llm是否在线...');
        
        // 发送目标为user_py_llm的ping消息
        var pyLlmMsg = `{"msg": "ping", "userId": "${USER_ID}", "targetUserId": "user_py_llm", "action": "isLLMOnLine"}`;
        ws.send(pyLlmMsg);
        console.log('已发送ping消息至user_py_llm');
        
        // 设置超时检查
        pyLlmCheckTimeout = setTimeout(() => {
          if (isCheckingPyLlmOnline) {
            console.error('未收到user_py_llm的回复，可能不在线');
            // alert('算力服务器正在忙，请稍后再试');
            // isCheckingPyLlmOnline = false;
            // 可以在这里添加终止连接或其他逻辑
            // ws.close();
          }
        }, 20000); // 5秒超时
      }
    }
    else {
      console.log('收到 parsedData 响应', parsedData);
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

const handleImage2VideoMessage = (data) => {
  console.log('main.js 收到 WebSocket 消息:', data);
  ws.send(data);
  // 这里可以添加更多的消息处理逻辑
};

// 添加监听器
if (eventBus.on) {
  eventBus.on('websocket-MJDrawing', handleMJDrawingMessage);
  eventBus.on('websocket-ImageSwap', handleImageSwapMessage);
  eventBus.on('websocket-Image2Image', handleImage2ImageMessage);
  eventBus.on('websocket-Image2Video', handleImage2VideoMessage);
}

// 启动时连接 WebSocket
connectWebSocket();

getAllConfigs();

app.mount('#app')