<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedComponents" :max="10">
      <component :is="Component" />
    </keep-alive>
  </router-view>
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
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>