<template>
  <div class="exchange-code-page">
    <div class="page-header">
      <h1>获取兑换码</h1>
    </div>
    
    <div class="code-buttons">
      <!-- 1天兑换码 -->
      <div class="button-group">
        <input 
          type="text" 
          v-model="batchNumbers.day1" 
          placeholder="请输入1天批次号" 
          @change="saveBatchNumber('day1', batchNumbers.day1)"
        />
        <button @click="getExchangeCode('day1')">获取1天兑换码</button>
      </div>
      
      <!-- 3天兑换码 -->
      <div class="button-group">
        <input 
          type="text" 
          v-model="batchNumbers.day3" 
          placeholder="请输入3天批次号" 
          @change="saveBatchNumber('day3', batchNumbers.day3)"
        />
        <button @click="getExchangeCode('day3')">获取3天兑换码</button>
      </div>
      
      <!-- 7天兑换码 -->
      <div class="button-group">
        <input 
          type="text" 
          v-model="batchNumbers.day7" 
          placeholder="请输入7天批次号" 
          @change="saveBatchNumber('day7', batchNumbers.day7)"
        />
        <button @click="getExchangeCode('day7')">获取7天兑换码</button>
      </div>
      
      <!-- 1个月兑换码 -->
      <div class="button-group">
        <input 
          type="text" 
          v-model="batchNumbers.month1" 
          placeholder="请输入1个月批次号" 
          @change="saveBatchNumber('month1', batchNumbers.month1)"
        />
        <button @click="getExchangeCode('month1')">获取1个月兑换码</button>
      </div>
    </div>
    
    <div class="result-container" v-if="result">
      <div class="result-header">
        <h2>请求结果</h2>
        <button class="copy-button" @click="copyResult">
          <i class="fas fa-copy"></i> 复制
        </button>
      </div>
      
      <div class="result-content">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      
      <div class="copy-message" v-if="copyMessage">
        {{ copyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 获取API基础URL
const BASE_URL = import.meta.env.VUE_API_BASE_URL || 'http://120.27.130.190:8091';

// 批次号输入框数据
const batchNumbers = ref({
  day1: '',
  day3: '',
  day7: '',
  month1: ''
});

// 请求结果
const result = ref(null);

// 复制消息
const copyMessage = ref('');

// 从本地存储加载批次号
onMounted(() => {
  loadBatchNumbers();
});

// 加载本地存储的批次号
const loadBatchNumbers = () => {
  try {
    const savedBatchNumbers = localStorage.getItem('batchNumbers');
    if (savedBatchNumbers) {
      batchNumbers.value = JSON.parse(savedBatchNumbers);
    }
  } catch (error) {
    console.error('加载批次号失败:', error);
  }
};

// 保存批次号到本地存储
const saveBatchNumber = (type, value) => {
  try {
    batchNumbers.value[type] = value;
    localStorage.setItem('batchNumbers', JSON.stringify(batchNumbers.value));
  } catch (error) {
    console.error('保存批次号失败:', error);
  }
};

// 获取兑换码
const getExchangeCode = async (type) => {
  const batch = batchNumbers.value[type];
  
  if (!batch || batch.trim() === '') {
    alert('请先输入批次号');
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/exchange-code/get/${batch}`);
    
    if (!response.ok) {
      throw new Error('获取兑换码失败');
    }
    
    const data = await response.json();
    result.value = data;
    
  } catch (error) {
    console.error('获取兑换码失败:', error);
    alert('获取兑换码失败，请检查网络连接或批次号是否正确');
  }
};

// 复制结果
const copyResult = () => {
  if (!result.value || !result.value.code) {
    return;
  }
  
  try {
    // 计算过期时间
    const obtainedTime = new Date(result.value.obtainedTime);
    const validDays = result.value.validDays;
    const expireTime = new Date(obtainedTime);
    expireTime.setDate(expireTime.getDate() + validDays);
    
    // 格式化过期时间
    const formattedExpireTime = expireTime.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // 生成复制文本
    const copyText = `兑换码${result.value.code}有效期到${formattedExpireTime}，请尽快使用。`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(copyText)
      .then(() => {
        copyMessage.value = '复制成功！';
        setTimeout(() => {
          copyMessage.value = '';
        }, 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
        copyMessage.value = '复制失败，请手动复制';
        setTimeout(() => {
          copyMessage.value = '';
        }, 2000);
      });
    
  } catch (error) {
    console.error('复制处理失败:', error);
  }
};
</script>

<style scoped>
.exchange-code-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  font-size: 24px;
}

.code-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.button-group input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.button-group button {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-group button:hover {
  background-color: #45a049;
}

.result-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-header h2 {
  color: #333;
  font-size: 20px;
  margin: 0;
}

.copy-button {
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.copy-button:hover {
  background-color: #0b7dda;
}

.result-content pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 14px;
  margin: 0;
}

.copy-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .button-group input,
  .button-group button {
    width: 100%;
  }
}
</style>