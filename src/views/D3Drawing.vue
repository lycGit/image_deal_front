<template>
  <div class="d3-drawing">
    <div class="prompt-box">
      <div class="prompt-input">
        <input 
          type="text" 
          v-model="prompt"
          placeholder="请输入AI画的描述，'Shift+回车'换行。" 
          @keyup.shift.enter="handleEnter"
        />
        <button class="send-button" @click="handleSubmit">
          发送 <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      <div class="image-options">
        <button 
          v-for="option in options" 
          :key="option.value"
          class="option-button"
          :class="{ active: selectedOption === option.value }"
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const prompt = ref('')
const selectedOption = ref('')

const options = [
  { label: '写实', value: 'realistic' },
  { label: '自然', value: 'natural' },
  { label: '高清', value: 'hd' },
  { label: '超清', value: 'uhd' },
  { label: '1:1', value: '1:1' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' }
]

const handleEnter = () => {
  handleSubmit()
}

const handleSubmit = () => {
  if (!prompt.value.trim()) return
  console.log('提交:', {
    prompt: prompt.value,
    option: selectedOption.value
  })
}

const selectOption = (value) => {
  selectedOption.value = value
}
</script>

<style scoped>
.d3-drawing {
  padding: 20px;
}

.prompt-box {
  background-color: #1f2128;
  border-radius: 12px;
  padding: 20px;
}

.prompt-input {
  display: flex;
  gap: 10px;
}

.prompt-input input {
  flex: 1;
  background-color: #2a2c34;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: #ffffff;
}

.prompt-input input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(45, 101, 242, 0.5);
}

.send-button {
  background-color: #2d65f2;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #1e54e7;
}

.image-options {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.option-button {
  background-color: #2a2c34;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
}

.option-button:hover {
  background-color: #3a3c44;
}

.option-button.active {
  background-color: #2d65f2;
  color: white;
}
</style> 