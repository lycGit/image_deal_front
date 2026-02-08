<template>
  <div class="image-cropper-demo">
    <h1>图片裁剪工具</h1>
    <p>点击或拖拽图片到下方区域进行裁剪</p>
    <div id="cropper-container"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { createImageCropper } from '../js/ImageCropper';
import '../assets/image-cropper.css';

let imageCropper = null;

onMounted(() => {
  // 初始化图片裁剪工具
  imageCropper = createImageCropper({
    container: '#cropper-container',
    cropperOptions: {
      aspectRatio: NaN,
      viewMode: 1,
      dragMode: 'none', // 禁止拖动图片
      autoCropArea: 0.8,
      cropBoxMovable: true, // 保持裁剪框可拖动
      cropBoxResizable: true, // 保持裁剪框可调整大小
      zoomOnWheel: false, // 禁止鼠标滚轮缩放
      zoomOnTouch: false, // 禁止触摸缩放
      rotatable: false, // 禁止旋转
      background: false,
      guides: false,
      center: true
    }
  });
});

onBeforeUnmount(() => {
  // 销毁图片裁剪工具实例
  if (imageCropper) {
    imageCropper.destroy();
  }
});
</script>

<style scoped>
.image-cropper-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

#cropper-container {
  margin: 0 auto;
  max-width: 600px;
}
</style>
