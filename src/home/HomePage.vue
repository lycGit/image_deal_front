<template>
  <div class="home-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="泡咖AI" />
        <span>泡咖AI</span>
        <div class="subtitle">一站式AI创作平台</div>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-menu">
        <router-link to="/" custom v-slot="{ navigate, isActive }">
          <div 
            class="nav-item" 
            :class="{ active: isActive }"
            @click="navigate"
          >
            <i class="fas fa-home"></i>
            <span>首页</span>
          </div>
        </router-link>

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
          <router-link to="/d3-drawing" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >D3绘画</div>
          </router-link>
          <router-link to="/magic-avatar" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >魔法头像</div>
          </router-link>
          <router-link to="/ai-paragraph" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI抠图</div>
          </router-link>
        </div>

        <div class="nav-section">
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
        </div>

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
          <router-link to="/ai-video-kl" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI视频(KL)</div>
          </router-link>
          <router-link to="/ai-video-prka" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >AI视频(Prka)</div>
          </router-link>
          <router-link to="/chat-room" custom v-slot="{ navigate, isActive }">
            <div 
              class="nav-subitem" 
              :class="{ active: isActive }"
              @click="navigate"
            >socket聊天室</div>
          </router-link>
        </div>
      </div>

      <!-- VIP Button -->
      <div class="vip-button">
        升级VIP会员
      </div>

      <!-- User Info -->
      <div class="user-info">
        <img src="@/assets/avatar.png" alt="User Avatar" />
        <span>手机用户3896</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="right-buttons">
          <button class="top-button">案例</button>
          <button class="top-button">我的作品</button>
          <button class="top-button">收藏</button>
        </div>
      </div>

      <!-- Router View -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
// 移除未使用的导入和变量
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
}

.logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
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

.user-info img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
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
</style>
