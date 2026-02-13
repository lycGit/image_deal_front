<template>
  <div class="app-container">
    <!-- 顶部警告区块 -->
    <div class="warning-banner">
      <div class="warning-content">
        <i class="fas fa-exclamation-triangle warning-icon"></i>
        <p class="warning-text">用户须知：本平台严禁生成任何危害国家安全、破坏民族团结、侵犯他人合法权益的内容，包括但不限于侮辱国家、支持分裂、诽谤他人等违法违规信息。请严格遵守国家法律法规，共建清朗网络空间。</p>
      </div>
    </div>
    
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedComponents" :max="10">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 需要缓存的组件名数组
const cachedComponents = ref(['HomePage', 'MJDrawing', 'KLDrawing', 'D3Drawing', 'MagicAvatar', 'AIParagraph', 'ImageSwap', 'MultiSwap', 'VideoSwap', 'AIDressing', 'AIVideoVidu', 'AIVideoKL', 'AIVideoPrka', 'ChatRoom'])
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#app {
  min-height: 100vh;
  width: 100vw;
  overflow: auto;
}

.app-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部警告区块样式 */
.warning-banner {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 12px 20px;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.warning-icon {
  font-size: 20px;
  margin-top: 2px;
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

@media (max-width: 768px) {
  .warning-banner {
    padding: 10px 15px;
  }
  
  .warning-content {
    flex-direction: column;
    gap: 8px;
  }
  
  .warning-icon {
    margin-top: 0;
  }
  
  .warning-text {
    font-size: 13px;
  }
}
</style>