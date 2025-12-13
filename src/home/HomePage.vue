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
            >纯文本绘画</div>
          </router-link>
          <router-link to="/kl-drawing" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >图文绘画</div>
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
          <button class="top-button redeem-button" @click="openModal">输入兑换码</button>
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
  margin-bottom: 20px;
  flex-direction: row;
  background: rgba(42, 44, 52, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo-text {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  justify-content: center;
  max-width: calc(100% - 64px); /* 确保文字部分有合适的宽度限制，减去图片宽度和间距 */
}

.logo-text span {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 长单词自动换行 */
}

.subtitle {
  font-size: 12px;
  color: #a0a1a7;
  margin-top: 4px;
  white-space: normal; /* 允许文字换行 */
  word-wrap: break-word; /* 长单词自动换行 */
}

.logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: block;
  object-fit: contain;
  background-color: #ffffff; /* 恢复原有白色背景 */
  border-radius: 6px; /* 圆角与整体风格一致 */
  padding: 4px; /* 适当内边距 */
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
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  color: #a0a1a7;
  font-size: 14px;
  background: rgba(42, 44, 52, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-item:hover, .nav-subitem:hover {
  background-color: rgba(45, 101, 242, 0.15);
  color: #ffffff;
  transform: translateX(4px);
}

.nav-item.active, .nav-subitem.active {
  background-color: rgba(45, 101, 242, 0.2);
  color: #2d65f2;
  font-weight: 500;
  box-shadow: 0 0 0 1px rgba(45, 101, 242, 0.3);
}

.nav-item.active::before, .nav-subitem.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 0 3px 3px 0;
}

.nav-section {
  margin: 24px 0;
  padding: 0 4px;
}

.nav-header {
  font-weight: 800;
  margin-bottom: 12px;
  margin-top: 16px;
  padding: 10px 16px;
  color: #ffffff;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  background: rgba(69, 118, 230, 0.25);
  border: 1px solid rgba(69, 118, 230, 0.3);
  box-shadow: none;
  transition: none;
  cursor: default;
}

.nav-header:hover {
  background: rgba(42, 44, 52, 0.8);
  box-shadow: none;
  transform: none;
}

.nav-header i {
  font-size: 16px;
  opacity: 1;
  color: #4776E6;
}

.nav-subitem {
  padding-left: 40px;
  color: #8b8c91;
  border-left: 2px solid transparent;
  font-size: 13px;
}

.nav-subitem:hover {
  border-left-color: rgba(45, 101, 242, 0.5);
}

/* 添加图标样式 */
.nav-item i, .nav-subitem i {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0.7;
  color: #a0a1a7;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  transition: all 0.3s ease;
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

.redeem-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 6px;
}

.redeem-button:hover {
  opacity: 0.9;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
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
