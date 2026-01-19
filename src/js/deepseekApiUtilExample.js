/**
 * DeepSeek API工具类使用示例
 * 展示如何在项目中使用DeepSeekApi工具类
 */

import { createDeepSeekApi } from './deepseekApiUtil';

// 示例1: 创建API实例并发送简单消息
export const exampleSimpleChat = async () => {
  try {
    // 注意：在实际项目中，API密钥应该存储在环境变量或安全的配置文件中
    // 这里只是示例，请不要直接硬编码API密钥
    const apiKey = 'your-api-key-here'; // 替换为您的实际API密钥
    
    // 创建API实例
    const deepseekApi = createDeepSeekApi(apiKey);
    
    // 发送消息并获取回复
    const response = await deepseekApi.chat('你好，写一首关于春天的诗');
    
    console.log('DeepSeek API回复:', response);
    return response;
  } catch (error) {
    console.error('聊天请求失败:', error);
    return null;
  }
};

// 示例2: 带自定义选项的聊天请求
export const exampleChatWithOptions = async () => {
  try {
    const apiKey = 'your-api-key-here';
    const deepseekApi = createDeepSeekApi(apiKey);
    
    // 自定义请求选项
    const options = {
      model: 'deepseek-chat',
      maxTokens: 1000,
      temperature: 0.8
    };
    
    // 发送带有自定义选项的消息
    const response = await deepseekApi.chat('请详细解释一下Vue.js的响应式原理', options);
    
    console.log('DeepSeek API带选项回复:', response);
    return response;
  } catch (error) {
    console.error('带选项的聊天请求失败:', error);
    return null;
  }
};

// 示例3: 批量发送消息
export const exampleBatchChat = async () => {
  try {
    const apiKey = 'your-api-key-here';
    const deepseekApi = createDeepSeekApi(apiKey);
    
    // 批量消息数组
    const messages = [
      '什么是人工智能？',
      '列出三个Python的优势',
      '解释一下RESTful API'
    ];
    
    // 批量发送消息
    const results = await deepseekApi.batchChat(messages);
    
    console.log('DeepSeek API批量回复:', results);
    
    // 处理批量结果
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`第${index + 1}条消息回复:`, result.response);
      } else {
        console.log(`第${index + 1}条消息失败:`, result.error);
      }
    });
    
    return results;
  } catch (error) {
    console.error('批量聊天请求失败:', error);
    return null;
  }
};

// 如何在Vue组件中使用示例
/*
<template>
  <div>
    <button @click="handleChat">发送消息</button>
    <div v-if="response">{{ response }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createDeepSeekApi } from '../js/deepseekApiUtil';

const response = ref('');
const handleChat = async () => {
  try {
    // 从环境变量或配置文件中获取API密钥
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const deepseekApi = createDeepSeekApi(apiKey);
    response.value = await deepseekApi.chat('你好，写一首关于春天的诗');
  } catch (error) {
    console.error('聊天失败:', error);
  }
};
</script>
*/
