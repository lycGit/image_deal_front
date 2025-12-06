<template>
  <div class="home-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/downloaded-image.png" alt="泡咖AI" />
        <div class="logo-text">
          <span>Midjourney企业内部版</span>
          <!-- <div class="subtitle">一站式AI创作平台</div> -->
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-menu">
        <!-- <router-link to="/" custom v-slot="{ navigate, isActive }">
          <div 
            class="nav-item" 
            :class="{ active: isActive }"
            @click="navigate"
          >
            <i class="fas fa-home"></i>
            <span>首页</span>
          </div>
        </router-link> -->

        <div class="nav-section">
          <div class="nav-header">
            <i class="fas fa-paint-brush"></i>
            <span>AI绘画设计</span>
          </div>
          <router-link to="/mj-drawing" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >MJ绘画</div>
          </router-link>
          <router-link to="/kl-drawing" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >KL绘画</div>
          </router-link>
          <!-- <router-link to="/d3-drawing" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >D3绘画</div>
          </router-link> -->
          <!-- <router-link to="/magic-avatar" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >魔法头像</div>
          </router-link> -->
          <!-- <router-link to="/ai-paragraph" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI抠图</div>
          </router-link> -->
        </div>

        <!-- <div class="nav-section">
          <div class="nav-header">
            <i class="fas fa-exchange-alt"></i>
            <span>AI换脸换装</span>
          </div>
          <router-link to="/image-swap" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >图片换脸</div>
          </router-link>
          <router-link to="/multi-swap" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >多人换脸</div>
          </router-link>
          <router-link to="/video-swap" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >视频换脸</div>
          </router-link>
          <router-link to="/ai-dressing" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI换装试衣</div>
          </router-link>
        </div> -->

        <div class="nav-section">
          <div class="nav-header">
            <i class="fas fa-video"></i>
            <span>AI视频</span>
          </div>
          <router-link to="/ai-video-vidu" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI视频(Vidu)</div>
          </router-link>
          <!-- <router-link to="/ai-video-kl" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI视频(KL)</div>
          </router-link> -->
          <!-- <router-link to="/ai-video-prka" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI视频(Prka)</div>
          </router-link> -->
          <!-- <router-link to="/chat-room" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >socket聊天室</div>
          </router-link> -->
        </div>
      </div>

      <!-- VIP Button -->
      <!-- <div class="vip-button">
        升级VIP会员
      </div> -->

      <!-- User Info -->
      <div class="user-info">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <span>超级VIP用户</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="right-buttons">
          <button class="top-button" @click="openModal">输入口令</button>
          <!-- <button class="top-button">我的作品</button>
          <button class="top-button">收藏</button> -->
        </div>
      </div>

      <!-- Router View -->
      <router-view></router-view>
    </div>
    <!-- 引入公共组件 -->
    <PasswordModal
      :show-modal="showPasswordModal"
      @close="closeModal"
      @success="handleAuthorizeSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PasswordModal from '../components/PasswordModal.vue';

// 弹窗状态
const showPasswordModal = ref(false);
const isAuthorized = ref(false);

// 检查是否已经授权
onMounted(() => {
  const authorized = localStorage.getItem('isAuthorized');
  if (authorized === 'true') {
    isAuthorized.value = true;
  }
});

// 打开弹窗
const openModal = () => {
  showPasswordModal.value = true;
};

// 关闭弹窗
const closeModal = () => {
  showPasswordModal.value = false;
};

// 处理授权成功
const handleAuthorizeSuccess = () => {
  isAuthorized.value = true;
  console.log('授权成功');
};
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  background-color: #1a1b1f;
  color: #ffffff;
}

.sidebar {
  width: 240px;
  background-color: #1f2128;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  flex-direction: row;
  background-color: #1f2128; /* 恢复原有背景色 */
  padding: 10px;
  border-radius: 6px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  justify-content: center;
  max-width: calc(100% - 64px); /* 确保文字部分有合适的宽度限制，减去图片宽度和间距 */
}

.logo-text span {
  font-size: 16px;
  font-weight: bold;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 长单词自动换行 */
}

.subtitle {
  font-size: 12px;
  color: #8b8c91;
  margin-top: 4px;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 长单词自动换行 */
}

.logo img {
  width: 44px;
  height: 44px;
  margin-right: 10px;
  display: block;
  object-fit: contain;
  background-color: #ffffff; /* 添加白色背景以提高图片可见性 */
  border-radius: 4px; /* 添加圆角使图片看起来更美观 */
  padding: 2px; /* 添加轻微内边距 */
}

.subtitle {
  font-size: 12px;
  color: #8b8c91;
  margin-top: 4px;
}

.nav-menu {
  flex: 1;
}

.nav-item, .nav-subitem {
  padding: 10px;
  margin: 5px 0;
  border-radius: 6px;
  cursor: pointer;
}

.nav-item:hover, .nav-subitem:hover {
  background-color: #2a2c34;
}

.nav-item.active, .nav-subitem.active {
  background-color: #2d65f2;
}

.nav-section {
  margin: 15px 0;
}

.nav-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.nav-header i {
  margin-right: 8px;
}

.nav-subitem {
  padding-left: 20px;
  font-size: 14px;
  color: #8b8c91;
}

.vip-button {
  background: linear-gradient(45deg, #2d65f2, #7c4dff);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #2a2c34;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  color: #8b8c91;
  font-size: 16px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.top-button {
  background: transparent;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
}

.top-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

/* 弹窗样式 */
.password-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: #2a2c34;
  border-radius: 8px;
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 20px;
}

.password-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #1f2128;
  color: #ffffff;
  margin-bottom: 10px;
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #444;
  color: #ffffff;
}

.confirm-btn {
  background-color: #2d65f2;
  color: #ffffff;
}
</style>
