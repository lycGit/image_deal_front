<template>
  <div class="password-modal" v-if="showModal">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>请输入口令</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <input
          type="password"
          v-model="password"
          placeholder="请输入口令"
          class="password-input"
        />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">取消</button>
        <button class="confirm-btn" @click="verifyPassword">确认</button>
      </div>
    </div>
  </div>
</template>

// 取消注释props定义
<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import config from '../lib/config/config.js';

// 使用解构赋值明确指定我们需要的属性
const { showModal } = defineProps({
  showModal: {
    type: Boolean,
    required: true
  }
});

// 定义emits
const emit = defineEmits(['close', 'success']);

// 组件内部状态
const password = ref('');
const errorMessage = ref('');
const baseUrl = config.install ? 'http://localhost:8091' : 'http://localhost:8091';

// 关闭弹窗
const closeModal = () => {
  emit('close');
};

// 验证口令
const verifyPassword = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/${encodeURIComponent(password.value)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.log("网络请求失败");
      throw new Error('网络请求失败');
    }

    const data = await response.json();
    if (data.success) {
      // 验证成功
      errorMessage.value = '';
      localStorage.setItem('isAuthorized', 'true');
      emit('success');
      closeModal();
    } else {
      // 验证失败
      errorMessage.value = '口令错误，请重新输入';
    }
  } catch (error) {
    // 验证失败
    errorMessage.value = '口令错误，请重新输入';
  }
};
</script>

<style scoped>
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