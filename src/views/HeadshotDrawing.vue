<template>
  <div class="view-container">
    <div class="left-panel">
      <div class="header">头像模板选择</div>
      
      <!-- 创意描述输入区域 -->
      <!-- <div class="section">
        <div class="section-title">创意描述</div>
        <div class="input-wrapper">
          <textarea
            v-model="prompt"
            placeholder="请输入创意描述或选择头像模板"
            :maxlength="500"
          ></textarea>
          <div class="word-count">{{ prompt.length }}/500</div>
        </div>
      </div> -->
    
      <!-- 头像选择区域 - 可滚动 -->
      <div class="avatar-section-container">
        <div class="section">
          <div class="avatar-selection">
            <!-- 男性头像区域 -->
            <div class="avatar-section">
              <div class="avatar-section-title">男性证件照模板</div>
              <div class="avatar-grid male-avatars">
                <div 
                  v-for="(avatar, index) in maleAvatars" 
                  :key="'male-' + index"
                  class="avatar-item"
                  :class="{ active: selectedAvatarImage === avatar.image }"
                  @click="selectAvatar(avatar.prompt, avatar.image, avatar.description)"
                >
                  <img :src="avatar.image" :alt="avatar.description" />
                  <!-- <img src="/images/headerTemplate/male-1.jpg" :alt="avatar.description" /> -->
                  <div class="avatar-tooltip">{{ avatar.description }}</div>
                </div>
              </div>
            </div>
            
            <!-- 女性头像区域 -->
            <div class="avatar-section">
              <div class="avatar-section-title">女性证件照模板</div>
              <div class="avatar-grid female-avatars">
                <div 
                  v-for="(avatar, index) in femaleAvatars" 
                  :key="'female-' + index"
                  class="avatar-item"
                  :class="{ active: selectedAvatarImage === avatar.image }"
                  @click="selectAvatar(avatar.prompt, avatar.image, avatar.description)"
                >
                  <img :src="avatar.image" :alt="avatar.description" />
                  <div class="avatar-tooltip">{{ avatar.description }}</div>
                </div>
              </div>
            </div>
            
            <!-- 男性全身证件照模板 -->
            <div class="avatar-section">
              <div class="avatar-section-title">男性全身证件照模板</div>
              <div class="avatar-grid male-total-avatars">
                <div 
                  v-for="(avatar, index) in maleTotalAvatars" 
                  :key="'male-total-' + index"
                  class="avatar-item"
                  :class="{ active: selectedAvatarImage === avatar.image }"
                  @click="selectAvatar(avatar.prompt, avatar.image, avatar.description)"
                >
                  <img :src="avatar.image" :alt="avatar.description" />
                  <div class="avatar-tooltip">{{ avatar.description }}</div>
                </div>
              </div>
            </div>
            
            <!-- 女性全身证件照模板 -->
            <div class="avatar-section">
              <div class="avatar-section-title">女性全身证件照模板</div>
              <div class="avatar-grid female-total-avatars">
                <div 
                  v-for="(avatar, index) in femaleTotalAvatars" 
                  :key="'female-total-' + index"
                  class="avatar-item"
                  :class="{ active: selectedAvatarImage === avatar.image }"
                  @click="selectAvatar(avatar.prompt, avatar.image, avatar.description)"
                >
                  <img :src="avatar.image" :alt="avatar.description" />
                  <div class="avatar-tooltip">{{ avatar.description }}</div>
                </div>
              </div>
            </div>
            
            <!-- 男孩证件照模板 -->
            <div class="avatar-section">
              <div class="avatar-section-title">男孩证件照模板</div>
              <div class="avatar-grid boy-avatars">
                <div 
                  v-for="(avatar, index) in boyAvatars" 
                  :key="'boy-' + index"
                  class="avatar-item"
                  :class="{ active: selectedAvatarImage === avatar.image }"
                  @click="selectAvatar(avatar.prompt, avatar.image, avatar.description)"
                >
                  <img :src="avatar.image" :alt="avatar.description" />
                  <div class="avatar-tooltip">{{ avatar.description }}</div>
                </div>
              </div>
            </div>
            
            <!-- 女孩证件照模板 -->
            <div class="avatar-section">
              <div class="avatar-section-title">女孩证件照模板</div>
              <div class="avatar-grid girl-avatars">
                <div 
                  v-for="(avatar, index) in girlAvatars" 
                  :key="'girl-' + index"
                  class="avatar-item"
                  :class="{ active: selectedAvatarImage === avatar.image }"
                  @click="selectAvatar(avatar.prompt, avatar.image, avatar.description)"
                >
                  <img :src="avatar.image" :alt="avatar.description" />
                  <div class="avatar-tooltip">{{ avatar.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 固定底部区域 -->
      <div class="fixed-bottom-section">
        <!-- 同行显示的两个区域 -->
        <div class="row-section">
          <!-- 参考图片上传区域 - 左侧 -->
          <div class="section upload-section">
            <div class="section-header">
              <div class="section-title">参考图/热图</div>
              <button class="hint-button" @click="openImageCropper">非单人照？点此裁剪</button>
            </div>
            <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop="handleDrop">
              <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
              <div class="upload-content" v-if="!referenceImage">
                <div class="upload-icon">+</div>
                <div class="upload-text">点击/拖拽图片,高宽不小于300px</div>
              </div>
              <img v-else :src="referenceImage" class="reference-image" alt="参考图片" />
            </div>
          </div>
          
          <div class="operation-section">
          <!-- 证件照背景颜色选择区域 - 右侧 -->
            <div class="section color-section">
              <div class="section-title">证件照背景颜色</div>
              <div class="color-selection">
                <div 
                  class="color-option" 
                  :class="{ active: selectedBackgroundColor === 'white' }"
                  @click="selectBackgroundColor('white')"
                >
                  <div class="color-preview white"></div>
                  <span class="color-name">白色</span>
                </div>
                <div 
                  class="color-option" 
                  :class="{ active: selectedBackgroundColor === 'blue' }"
                  @click="selectBackgroundColor('blue')"
                >
                  <div class="color-preview blue"></div>
                  <span class="color-name">蓝色</span>
                </div>
                <div 
                  class="color-option" 
                  :class="{ active: selectedBackgroundColor === 'red' }"
                  @click="selectBackgroundColor('red')"
                >
                  <div class="color-preview red"></div>
                  <span class="color-name">红色</span>
                </div>
              </div>
            </div>
            <!-- 生成按钮 -->
            <button 
              class="generate-button"
              :disabled="!canGenerate"
              @click="handleGenerate"
            >
              <span v-if="!loading">开始生成</span>
              <span v-else>生成中...</span>
            </button>
          </div>

        </div>
        
 
      </div>
    </div>
    
    <!-- 添加右侧展示区域 -->
    <div class="right-panel">
      <!-- 顶部栏 -->
      <div class="top-bar">
        <div class="right-buttons">
          <button class="top-button redeem-button" @click="openModal">输入兑换码</button>
        </div>
      </div>
      
      <div class="gallery">
        <!-- 加载中状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">图片生成中，大约耗时20~40秒，请稍候...</div>
          <div class="loading-text">{{ currentLoadingMessage }}</div>
        </div>
        
        <!-- 空状态提示 -->
        <div v-else-if="generatedItems.length === 0" class="empty-state">
          <div class="empty-icon">📸</div>
          <div class="empty-title">还没有生成图片</div>
          <div class="empty-description">
            <p>请按照以下步骤生成您的证件照：</p>
            <ul class="empty-steps">
              <li>1. 选择您喜欢的头像模板</li>
              <li>2. 选择证件照背景颜色</li>
              <li>3. 上传参考图片</li>
              <li>4. 点击"开始生成"按钮</li>
            </ul>
          </div>
        </div>
        
        <!-- 生成结果 -->
        <div v-else>
          <div v-for="(item, index) in generatedItems" :key="index" class="image-group">
            <div class="group-title">
              <span class="item-index">{{ index + 1 }}</span>
              {{ item.title }}
            </div>
            <div class="image-container">
              <div class="image-wrapper">
                <img :src="item.url" :alt="item.description" />
                <!-- 下载和裁剪按钮 -->
                <div class="image-actions">
                  <button class="crop-button" @click="openCropper(item)">
                    <i class="fas fa-crop-alt"></i>
                  </button>
                  <button class="download-button" @click="downloadImage(item.url, item.description)">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 裁剪模态框 -->
    <div v-if="showCropperModal" class="cus-cropper-modal">
      <div class="cropper-modal-content">
        <div class="cropper-header">
          <h3>图片裁剪</h3>
          <button class="close-button" @click="closeCropper">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="cropper-body">
          <div class="cropper-image-container">
            <img ref="cropperImage" :src="currentImage" alt="待裁剪图片" />
            <!-- 放大缩小按钮 -->
            <div class="image-zoom-controls">
              <button class="zoom-button zoom-out-button" @click="zoomOut">
                <i class="fas fa-minus"></i>
              </button>
              <button class="zoom-button zoom-in-button" @click="zoomIn">
                <i class="fas fa-plus"></i>
              </button>
              <button class="zoom-button move-up-button" @click="moveUp">
                <i class="fas fa-arrow-up"></i>
              </button>
              <button class="zoom-button move-down-button" @click="moveDown">
                <i class="fas fa-arrow-down"></i>
              </button>
            </div>
          </div>
          <div class="cropper-options">
            <h4>证件照尺寸</h4>
            <div class="size-options">
              <div 
                class="size-option" 
                :class="{ active: selectedSize === 'custom' }"
                @click="selectSize('custom')"
              >
                自定义
                <span class="size-info">自由裁剪</span>
              </div>
              <div 
                class="size-option" 
                :class="{ active: selectedSize === 'small1inch' }"
                @click="selectSize('small1inch')"
              >
                小一寸
                <span class="size-info">260×378px</span>
              </div>
              <div 
                class="size-option" 
                :class="{ active: selectedSize === '1inch' }"
                @click="selectSize('1inch')"
              >
                一寸照
                <span class="size-info">295×413px</span>
              </div>
              <div 
                class="size-option" 
                :class="{ active: selectedSize === 'large1inch' }"
                @click="selectSize('large1inch')"
              >
                大一寸
                <span class="size-info">390×567px</span>
              </div>
              <div 
                class="size-option" 
                :class="{ active: selectedSize === 'small2inch' }"
                @click="selectSize('small2inch')"
              >
                小二寸
                <span class="size-info">413×531px</span>
              </div>
              <div 
                class="size-option" 
                :class="{ active: selectedSize === '2inch' }"
                @click="selectSize('2inch')"
              >
                二寸照
                <span class="size-info">413×579px</span>
              </div>
              <div 
                class="size-option" 
                :class="{ active: selectedSize === 'large2inch' }"
                @click="selectSize('large2inch')"
              >
                大二寸
                <span class="size-info">413×625px</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cropper-footer">
          <button class="cancel-button" @click="closeCropper">取消</button>
          <button class="confirm-button" @click="confirmCrop">确认裁剪</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 引入密码弹窗组件 -->
  <PasswordModal
    :show-modal="showPasswordModal"
    @close="closeModal"
    @success="handleAuthorizeSuccess"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import eventBus from '../eventBus'
import { getRemainingPoints, consumePoints } from '../js/localStorageUtil'; // 导入获取剩余积分和消耗积分的方法
import { getConfigValue } from '../js/configUtil'; // 导入获取配置值的方法
import { getUserId } from '../js/userIdUtil'; // 导入用户ID工具
import { showAlert } from '../js/alertUtil'; // 导入公共弹窗工具类
import PasswordModal from '../components/PasswordModal.vue'; // 导入密码弹窗组件
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import maleAvatarsData from '../config/male_half_51.json' // 导入男性头像数据
import femaleAvatarsData from '../config/female_half_102.json' // 导入女性头像数据
import femaleTotalAvatarsData from '../config/female_total_30.json' // 导入女性全身头像数据
import maleTotalAvatarsData from '../config/male_total_15.json' // 导入男性全身头像数据
import boyAvatarsData from '../config/boy_73.json' // 导入男孩头像数据
import girlAvatarsData from '../config/girl_77.json' // 导入女孩头像数据

// 定义颜色对应的背景描述常量
const COLOR_DESCRIPTIONS = {
  white: '背景色为证件照纯白色',
  blue: '背景色为证件照纯蓝色',
  red: '背景色为证件照纯红色'
}

// 弹窗状态
const showPasswordModal = ref(false);

const prompt = ref('')
const referenceImage = ref(null)
const fileInput = ref(null)
const selectedRatio = ref('1:1')
const selectedBackgroundColor = ref('blue') // 默认选择蓝色背景
const selectedAvatarImage = ref('') // 存储当前选中的头像图片URL
const selectedAvatarDescription = ref('') // 存储当前选中的头像描述
const instance = getCurrentInstance();
const baseUrl = instance?.appContext.config.globalProperties.$BASE_URL_8091

// 裁剪相关状态
const cropperInstance = ref(null)
const showCropperModal = ref(false)
const currentImage = ref('')
const cropperImage = ref(null)
const selectedSize = ref('custom') // 默认选择自定义

// 预加载图片缓存
const preloadedImages = ref(new Map())

// 获取用户ID
const userId = getUserId();

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
  console.log('授权成功');
};

// 男性头像数据
const maleAvatars = ref(maleAvatarsData)
const femaleAvatars = ref(femaleAvatarsData)
const femaleTotalAvatars = ref(femaleTotalAvatarsData) // 女性全身头像数据
const maleTotalAvatars = ref(maleTotalAvatarsData) // 男性全身头像数据
const boyAvatars = ref(boyAvatarsData) // 男孩头像数据
const girlAvatars = ref(girlAvatarsData) // 女孩头像数据

// 选择头像模板
const selectAvatar = (avatarPrompt, avatarImage, avatarDescription) => {
  prompt.value = avatarPrompt
  selectedAvatarImage.value = avatarImage
  selectedAvatarDescription.value = avatarDescription
}

// 选择背景颜色
const selectBackgroundColor = (color) => {
  selectedBackgroundColor.value = color
}

const ratios = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '3:2', value: '3:2' },
  { label: '2:3', value: '2:3' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' }
]

// 添加loading状态管理
const loading = ref(false)
const generatedItems = ref([])

// 滚动文案配置
const loadingMessages = [
  '图片上传中...',
  '图片预处理中...',
  '意图理解中...',
  '条件生成...',
  '反思修正...'
]
const currentLoadingMessage = ref(loadingMessages[0])
let loadingMessageTimer = null
let loadingMessageIndex = 0
// 超时定时器
let timeoutTimer = null

// 本地存储键名
const STORAGE_KEY = 'headshot_drawing_generated_items'
const MAX_ITEMS = 10

// 从本地存储加载数据
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      generatedItems.value = JSON.parse(stored)
      // 预加载所有已生成的图片
      generatedItems.value.forEach(item => {
        preloadImage(item.url)
      })
    }
  } catch (error) {
    console.error('从本地存储加载数据失败:', error)
  }
}

// 保存到本地存储
const saveToStorage = () => {
  try {
    // 确保只保存最新的MAX_ITEMS张图片
    if (generatedItems.value.length > MAX_ITEMS) {
      generatedItems.value = generatedItems.value.slice(0, MAX_ITEMS)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generatedItems.value))
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

// 计算是否可以生成图片
const canGenerate = computed(() => prompt.value.trim().length > 0 && referenceImage.value && !loading.value)

const selectRatio = (ratio) => {
  selectedRatio.value = ratio
}

const triggerUpload = () => {
  fileInput.value.click()
}

// 打开图片裁剪页面
const openImageCropper = () => {
  // 在新标签页中打开图片裁剪页面
  window.open('/image-cropper', '_blank')
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) handleFile(file)
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) handleFile(file)
}

const handleFile = (file) => {
  if (!file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (e) => {
    referenceImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}


// 启动滚动文案
const startLoadingMessage = () => {
  loadingMessageIndex = 0
  currentLoadingMessage.value = loadingMessages[0]
  loadingMessageTimer = setInterval(() => {
    loadingMessageIndex = (loadingMessageIndex + 1) % loadingMessages.length
    currentLoadingMessage.value = loadingMessages[loadingMessageIndex]
  }, 10000) // 每10秒切换一次
}

// 停止滚动文案
const stopLoadingMessage = () => {
  if (loadingMessageTimer) {
    clearInterval(loadingMessageTimer)
    loadingMessageTimer = null
  }
}
const handleGenerate = async () => {
  if (!canGenerate.value) return  

    // 检查剩余积分
  const remainingPoints = getRemainingPoints();
  // 从配置中获取IMAGE_TO_IMAGE的积分消耗值
  const imageToImagePoints = Number(getConfigValue('HEADER_IMAGE')) || 5; // 默认值为5
  
  if (!remainingPoints || remainingPoints < imageToImagePoints) {
    showAlert('积分余额不足，需要至少' + imageToImagePoints + '积分才能生成图片, 请输入兑换码充值积分');
    return; // 积分不足时终止函数执行
  }
  
  try {
    // 设置loading状态
    loading.value = true
    // 启动滚动文案
    startLoadingMessage()    
    // 创建 FormData 对象
    const formData = new FormData()
    let uploadedImageUrl = null
    
    // 如果有参考图片，添加到 formData
    if (referenceImage.value) {
      // 先压缩图片到300KB以下
      const compressedImage = await compressImage(referenceImage.value, 300)
      const base64Data = compressedImage.split(',')[1]
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob())
      formData.append('file', blob, 'reference.jpg')
      uploadedImageUrl = URL.createObjectURL(blob)
    }
    
    // 添加其他参数
    // 拼接颜色提示语到prompt后面
    const colorDescription = COLOR_DESCRIPTIONS[selectedBackgroundColor.value]
    const fullPrompt = prompt.value ? `${prompt.value}，${colorDescription}` : colorDescription
    formData.append('description', fullPrompt)
    formData.append('category', 'KL_DRAWING')
    formData.append('tags', selectedRatio.value)

    const response = await fetch(`${baseUrl}/api/files/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    // const result = await response.text()
    const result = await response.json()
    console.log('上传成功:', result)
    console.log('上传图片地址:', uploadedImageUrl)
    const message = JSON.stringify({'msg': fullPrompt, 'imageUrl': result.imageUrl1,  'userId': userId, 'targetUserId': 'user_py_llm', 'action': 'image_edit'});
    eventBus.emit('websocket-headshot', message);
    
    // 设置1分钟超时提示
    timeoutTimer = setTimeout(() => {
      if (loading.value) {
        showAlert('服务器繁忙，请稍后再试或刷新浏览器重试');
        stopLoadingMessage(); loading.value = false;
      }
    }, 120000); // 1分钟 = 60000毫秒

  } catch (error) {
    console.error('生成失败:', error)
    showAlert('生成失败，请重试')
    stopLoadingMessage(); loading.value = false
    // 清除超时定时器
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
    }
  }
}

const handleMessage = async (data) => { 
  console.log('收到 WebSocket 消息:', data)
  try {
    if (data.imageUrl) {
      // 从配置中获取IMAGE_TO_IMAGE的积分消耗值
      const imageToImagePoints = Number(getConfigValue('HEADER_IMAGE')) || 5; // 默认值为5
       // 消耗积分
      const points = imageToImagePoints; // 消耗的积分值，现在从配置中获取
      consumePoints(points);
      // 添加到生成记录
      generatedItems.value.unshift({
        url: data.imageUrl || '/placeholder-image.png', // 如果没有上传图片则使用占位图
        description: prompt.value,
        title: selectedAvatarDescription.value, // 存储选中的头像模板description
        timestamp: Date.now()
      })

      // 保存到本地存储
      saveToStorage()
      
      // 预加载图片到浏览器缓存
      preloadImage(data.imageUrl)

      // 自动下载生成的图片
      if (data.imageUrl && selectedAvatarImage.value) {
        console.log('自动下载触发，data.imageUrl:', data.imageUrl);
        console.log('自动下载触发，selectedAvatarImage.value:', selectedAvatarImage.value);
        await downloadGeneratedImage(data.imageUrl, selectedAvatarImage.value);
      } else {
        console.log('自动下载条件不满足，data.imageUrl:', data.imageUrl);
        console.log('自动下载条件不满足，selectedAvatarImage.value:', selectedAvatarImage.value);
      }

    }
  } catch (error) {
    console.error('解析消息失败，数据不是有效的 JSON 字符串:', error)
  } finally {
    // WebSocket消息处理完成后，确保loading状态为false
    stopLoadingMessage(); loading.value = false
    // 清除超时定时器
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
  }
}

// 自动下载生成的图片
const downloadGeneratedImage = async (imageUrl, avatarImagePath) => {
  if (!imageUrl || !avatarImagePath) {
    console.log('自动下载条件不满足，imageUrl:', imageUrl, 'avatarImagePath:', avatarImagePath);
    return;
  }
  
  try {
    // 从avatarImagePath中提取图片名称和文件夹名称
    const pathParts = avatarImagePath.split('/');
    const imageName = pathParts.pop(); // 获取最后一部分，如art-1.jpg
    const baseName = imageName.split('.')[0]; // 去除扩展名，如art-1
    const downloadFileName = `${baseName}.png`; // 保存为png格式，仅使用baseName
    console.log('生成的downloadFileName:', downloadFileName);
    
    // 使用fetch获取图片数据，确保下载文件名正确
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // 释放内存
      console.log('图片已自动下载:', downloadFileName);
    } catch (error) {
      console.error('自动下载失败:', error);
      // 如果fetch失败，回退到直接链接下载
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('处理自动下载时出错:', error);
  }
};

// 预加载图片函数
const preloadImage = (imageUrl) => {
  if (!imageUrl) return
  
  // 如果已经预加载过，直接返回
  if (preloadedImages.value.has(imageUrl)) {
    console.log('图片已预加载:', imageUrl)
    return
  }
  
  try {
    const img = new Image()
    img.crossOrigin = 'anonymous' // 允许跨域加载
    
    img.onload = () => {
      console.log('图片预加载完成:', imageUrl)
      // 将加载完成的图片对象存储到Map中
      preloadedImages.value.set(imageUrl, img)
    }
    
    img.onerror = (error) => {
      console.error('图片预加载失败:', imageUrl, error)
      // 预加载失败时从Map中移除
      preloadedImages.value.delete(imageUrl)
    }
    
    // 开始加载图片
    img.src = imageUrl
  } catch (error) {
    console.error('预加载图片失败:', error)
  }
}

// 图片压缩函数
const compressImage = (imageUrl, maxSizeKB = 300) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous' // 允许跨域加载
      
      img.onload = () => {
        // 创建canvas元素
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // 检查图片尺寸，如果长或宽大于750，则按比例缩放到750以内
        let width = img.width
        let height = img.height
        const maxDimension = 750
        
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
          console.log(`图片尺寸从 ${img.width}x${img.height} 缩放到 ${width}x${height}`)
        }
        
        // 设置canvas尺寸为调整后的尺寸
        canvas.width = width
        canvas.height = height
        
        // 绘制图片到canvas
        ctx.drawImage(img, 0, 0, width, height)
        
        // 初始压缩质量
        let quality = 0.95
        let compressedDataUrl = ''
        
        // 循环压缩直到达到目标大小
        while (quality > 0.1) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
          
          // 计算数据URL的大小（大约）
          // 数据URL格式: data:image/jpeg;base64,[base64数据]
          // base64编码后的数据大小约为原始二进制大小的1.33倍
          const base64Data = compressedDataUrl.split(',')[1]
          const estimatedSizeKB = (base64Data.length * 3) / (4 * 1024) // 估算大小
          
          if (estimatedSizeKB <= maxSizeKB) {
            console.log(`图片压缩完成，压缩后大小约${estimatedSizeKB.toFixed(2)}KB，尺寸:${width}x${height}，质量:${quality.toFixed(2)}`)
            resolve(compressedDataUrl)
            return
          }
          
          // 降低质量继续压缩
          quality -= 0.1
        }
        
        // 如果质量低于0.1仍然过大，返回当前压缩结果
        console.log('图片压缩到最低质量:', (compressedDataUrl.split(',')[1].length * 3 / (4 * 1024)).toFixed(2), 'KB')
        resolve(compressedDataUrl)
      }
      
      img.onerror = (error) => {
        console.error('图片加载失败，无法压缩:', error)
        // 加载失败时返回原始图片URL
        resolve(imageUrl)
      }
      
      // 开始加载图片
      img.src = imageUrl
    } catch (error) {
      console.error('压缩图片失败:', error)
      // 发生错误时返回原始图片URL
      resolve(imageUrl)
    }
  })
}

// 下载图片函数
const downloadImage = async (imageUrl, description) => {
  try {
    // 创建下载链接
    const link = document.createElement('a')
    link.href = imageUrl
    // 使用描述作为文件名，替换特殊字符，添加时间戳确保唯一性
    const fileName = `${description.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_${Date.now()}.jpg`
    link.download = fileName
    // 触发下载
    document.body.appendChild(link)
    link.click()
    // 清理
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载图片失败:', error)
    showAlert('下载失败，请重试')
  }
}

// 打开裁剪模态框
const openCropper = async (item) => {
  try {
    // 先压缩图片（如果需要）
    console.log('开始处理图片:', item.url)
    const compressedImageUrl = await compressImage(item.url, 300) // 压缩到300kb左右
    
    // 检查是否有预加载的图片（如果是原始URL）
    const preloadedImg = preloadedImages.value.get(item.url)
    
    if (preloadedImg && preloadedImg.complete && preloadedImg.naturalWidth > 0 && compressedImageUrl === item.url) {
      // 有预加载的图片且不需要压缩，直接使用
      console.log('使用预加载的图片')
      currentImage.value = compressedImageUrl // 使用压缩后的URL
      showCropperModal.value = true
      
      // 等待DOM更新后替换为预加载的图片对象
      setTimeout(() => {
        if (cropperImage.value) {
          // 克隆预加载的图片节点并替换DOM中的img元素
          const clonedImg = preloadedImg.cloneNode(true)
          clonedImg.alt = '待裁剪图片'
          clonedImg.style.maxWidth = '100%'
          clonedImg.style.maxHeight = '100%'
          clonedImg.style.display = 'block'
          
          // 替换DOM中的img元素
          cropperImage.value.parentNode.replaceChild(clonedImg, cropperImage.value)
          cropperImage.value = clonedImg
          
          // 立即初始化cropper
          initCropper()
        }
      }, 100)
    } else {
      // 没有预加载的图片或需要使用压缩后的图片
      console.log('使用处理后的图片（压缩或网络下载）')
      currentImage.value = compressedImageUrl
      showCropperModal.value = true
      
      // 等待DOM更新后初始化cropper
      setTimeout(() => {
        if (cropperImage.value) {
          // 检查当前DOM图片是否已加载
          if (cropperImage.value.complete && cropperImage.value.naturalWidth > 0) {
            initCropper()
          } else {
            cropperImage.value.onload = initCropper
            
            // 设置超时保护
            setTimeout(() => {
              if (cropperInstance.value === null && cropperImage.value) {
                console.log('图片加载超时，强制初始化cropper')
                initCropper()
              }
            }, 3000)
          }
        }
      }, 100)
    }
  } catch (error) {
    console.error('打开裁剪模态框失败:', error)
    // 出错时使用原始图片
    currentImage.value = item.url
    showCropperModal.value = true
    
    // 等待DOM更新后初始化cropper
    setTimeout(() => {
      if (cropperImage.value) {
        initCropper()
      }
    }, 100)
  }
}

// 初始化cropper
const initCropper = () => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
  }
  
  cropperInstance.value = new Cropper(cropperImage.value, {
    aspectRatio: NaN, // 不限制比例，自由裁剪
    viewMode: 0, // 允许裁剪框超出容器
    autoCropArea: 1, // 初始裁剪框大小为100%
    movable: true,
    zoomable: true,
    scalable: true,
    rotatable: true,
    background: false,
    modal: true,
    guides: true,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false
  })
}

// 关闭裁剪模态框
const closeCropper = () => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }
  showCropperModal.value = false
  currentImage.value = ''
  selectedSize.value = 'custom' // 重置为默认的自定义选项
}

// 缩小图片
const zoomOut = () => {
  if (cropperInstance.value) {
    cropperInstance.value.zoom(-0.1) // 缩小10%
  }
}

// 放大图片
const zoomIn = () => {
  if (cropperInstance.value) {
    cropperInstance.value.zoom(0.1) // 放大10%
  }
}

// 向上移动图片
const moveUp = () => {
  if (cropperInstance.value) {
    const imageData = cropperInstance.value.getImageData()
    const moveDistance = -imageData.height * 0.1 // 向上移动10%
    cropperInstance.value.move(0, moveDistance)
  }
}

// 向下移动图片
const moveDown = () => {
  if (cropperInstance.value) {
    const imageData = cropperInstance.value.getImageData()
    const moveDistance = imageData.height * 0.1 // 向下移动10%
    cropperInstance.value.move(0, moveDistance)
  }
}

// 选择证件照尺寸
const selectSize = (size) => {
  selectedSize.value = size
  
  // 如果裁剪实例已初始化，更新裁剪框尺寸
  if (cropperInstance.value) {
    // 自定义选项：设置为自由裁剪模式
    if (size === 'custom') {
      cropperInstance.value.setAspectRatio(NaN)
      return
    }
    
    // 获取容器尺寸
    const containerData = cropperInstance.value.getContainerData()
    let cropWidth, cropHeight
    
    if (size === 'small1inch') {
      // 小一寸：260×378px
      cropWidth = 260
      cropHeight = 378
    } else if (size === '1inch') {
      // 一寸照：295×413px
      cropWidth = 295
      cropHeight = 413
    } else if (size === 'large1inch') {
      // 大一寸：390×567px
      cropWidth = 390
      cropHeight = 567
    } else if (size === 'small2inch') {
      // 小二寸：413×531px
      cropWidth = 413
      cropHeight = 531
    } else if (size === '2inch') {
      // 二寸照：413×579px
      cropWidth = 413
      cropHeight = 579
    } else if (size === 'large2inch') {
      // 大二寸：413×625px
      cropWidth = 413
      cropHeight = 625
    }
    
    // 根据容器大小和原始图片尺寸计算缩放比例
    const scaleX = containerData.width / cropperImage.value.naturalWidth
    const scaleY = containerData.height / cropperImage.value.naturalHeight
    const scale = Math.min(scaleX, scaleY)
    
    const scaledWidth = cropWidth * scale
    const scaledHeight = cropHeight * scale
    
    // 设置裁剪框尺寸和位置（居中）
    cropperInstance.value.setCropBoxData({
      width: scaledWidth,
      height: scaledHeight,
      left: (containerData.width - scaledWidth) / 2,
      top: (containerData.height - scaledHeight) / 2
    })
  }
}

// 确认裁剪并保存图片
const confirmCrop = async () => {
  if (!cropperInstance.value) {
    showAlert('裁剪工具未初始化，请重试')
    return
  }
  
  try {
    // 根据当前选择的尺寸设置裁剪后的固定尺寸
    let cropWidth = 0
    let cropHeight = 0
    
    if (selectedSize.value === 'small1inch') {
      // 小一寸：260×378px
      cropWidth = 260
      cropHeight = 378
    } else if (selectedSize.value === '1inch') {
      // 一寸照：295×413px
      cropWidth = 295
      cropHeight = 413
    } else if (selectedSize.value === 'large1inch') {
      // 大一寸：390×567px
      cropWidth = 390
      cropHeight = 567
    } else if (selectedSize.value === 'small2inch') {
      // 小二寸：413×531px
      cropWidth = 413
      cropHeight = 531
    } else if (selectedSize.value === '2inch') {
      // 二寸照：413×579px
      cropWidth = 413
      cropHeight = 579
    } else if (selectedSize.value === 'large2inch') {
      // 大二寸：413×625px
      cropWidth = 413
      cropHeight = 625
    } else {
      // 自定义：使用裁剪框的实际尺寸
      const cropBoxData = cropperInstance.value.getCropBoxData()
      cropWidth = Math.round(cropBoxData.width)
      cropHeight = Math.round(cropBoxData.height)
    }
    
    // 获取裁剪后的canvas
    const canvas = cropperInstance.value.getCroppedCanvas({
      width: cropWidth,  // 固定宽度
      height: cropHeight, // 固定高度
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    
    if (!canvas) {
      showAlert('裁剪失败，请重试')
      return
    }
    
    // 将canvas转换为blob
    canvas.toBlob((blob) => {
      if (!blob) {
        showAlert('裁剪失败，请重试')
        return
      }
      
      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const fileName = `cropped_image_${Date.now()}.jpg`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      // 关闭裁剪模态框
      // closeCropper()
      // showAlert('裁剪成功，图片已保存')
    }, 'image/jpeg', 0.95)
  } catch (error) {
    console.error('裁剪失败:', error)
    showAlert('裁剪失败，请重试')
  }
}

onMounted(() => { 
  console.log(' WebSocket onMounted') 
  // 从本地存储加载数据
  loadFromStorage()
  eventBus.on('websocket-message', handleMessage) 
})

onUnmounted(() => { 
  console.log(' WebSocket onUnmounted') 
  eventBus.off('websocket-message', handleMessage) 
})
</script>

<style scoped>
.view-container {
  height: 100%;
  background-color: #1a1b1e;
  display: flex;
}

/* 调整左侧面板布局，确保按钮始终可见 */
.left-panel {
  width: 60%;
  padding: 24px;
  border-right: 1px solid #2f3136;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 100vh;
  /* 移除整体滚动，改为局部滚动 */
}

/* 头像选择容器 - 可滚动 */
.avatar-section-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 16px;
}

/* 头像选择容器滚动条样式 */
.avatar-section-container::-webkit-scrollbar {
  width: 6px;
}

.avatar-section-container::-webkit-scrollbar-track {
  background: #2f3136;
  border-radius: 3px;
}

.avatar-section-container::-webkit-scrollbar-thumb {
  background: #4776E6;
  border-radius: 3px;
}

/* 固定底部区域 */
.fixed-bottom-section {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #2f3136;
}

/* 同行显示的两个区域 */
.row-section {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  align-items: stretch;
}

/* 上传区域样式 */
.upload-section {
  flex: 1;
  max-width: 50%;
}

/* 颜色选择区域样式 */
.color-section {
  flex: 1;
}

/* 操作区域 - 垂直方向两端对齐 */
.operation-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  max-width: 50%;
}

.header {
  font-size: 24px;
  color: #4776E6;
  font-weight: 500;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 14px;
  color: #8e9297;
}

/* 参考图/热图标题和提示按钮容器 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* 提示按钮样式 */
.hint-button {
  background-color: rgba(71, 118, 230, 0.1);
  border: 1px solid #FF9900;
  border-radius: 6px;
  color: #FF9900;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-button:hover {
  background-color: rgba(255, 153, 0, 0.2);
  transform: translateY(-1px);
}

.hint-button:active {
  transform: translateY(0);
}

/* 颜色选择区域样式 */
.color-selection {
  display: flex;
  gap: 16px;
  padding: 8px 0;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #2f3136;
  border: 2px solid #40444b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option:hover {
  border-color: #4776E6;
  transform: translateY(-2px);
}

.color-option.active {
  border-color: #4776E6;
  background-color: rgba(71, 118, 230, 0.1);
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #40444b;
  transition: all 0.3s ease;
}

.color-preview.white {
  background-color: #ffffff;
}

.color-preview.blue {
  background-color: #4A90E2;
}

.color-preview.red {
  background-color: #E74C3C;
}

.color-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

textarea {
  width: 100%;
  height: 240px;
  background-color: #2f3136;
  border: 1px solid #40444b;
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: #4776E6;
}

.word-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 12px;
  color: #8e9297;
}

/* 修改上传区域样式，限制最大高度 */
.upload-area {
  background-color: #2f3136;
  border: 1px dashed #40444b;
  border-radius: 8px;
  min-height: 150px;
  max-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  padding: 16px;
}

.upload-area:hover {
  border-color: #4776E6;
}

.upload-content {
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 150px;
}

.upload-icon {
  font-size: 24px;
  color: #8e9297;
}

.upload-text {
  color: #8e9297;
  font-size: 14px;
}

.reference-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 260px;
  object-fit: contain;
}

.ratio-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ratio-button {
  background-color: #2f3136;
  border: 1px solid #40444b;
  padding: 12px 8px;
  border-radius: 8px;
  color: #8e9297;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.ratio-button:hover {
  border-color: #4776E6;
}

.ratio-button.active {
  background-color: #4776E6;
  border-color: #4776E6;
  color: #ffffff;
}

/* 头像选择区域样式 */
.avatar-selection {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  /* 移除滚动和高度限制，让内容充满父容器 */
}

.avatar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.avatar-section-title {
  font-size: 18px;
  color: #ffffff;
  font-weight: 500;
  padding-left: 4px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-auto-rows: min-content;
  gap: 12px;
  /* 移除滚动和高度限制，让内容充满父容器 */
}

.avatar-item {
  position: relative;
  aspect-ratio: 413/579;
  background-color: #2f3136;
  border: 2px solid #40444b;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-item:hover {
  border-color: #4776E6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.3);
}

.avatar-item.active {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.3);
  transform: translateY(-2px);
}

.avatar-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-tooltip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #ffffff;
  font-size: 12px;
  padding: 20px 8px 8px;
  text-align: center;
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* 移除hover显示逻辑，因为现在默认就显示 */
/* .avatar-item:hover .avatar-tooltip {
  opacity: 1;
} */

/* 为男性和女性头像添加不同的边框颜色 */
.male-avatars .avatar-item:hover {
  border-color: #00ff00;
}

.male-avatars .avatar-item.active {
  border-color: #00ff00;
  box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.3);
}

.female-avatars .avatar-item:hover {
  border-color: #ff0000;
}

.female-avatars .avatar-item.active {
  border-color: #ff0000;
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.3);
}

/* 头像选择区域的滚动条样式 */
.avatar-selection {
  scrollbar-width: thin;
  scrollbar-color: #4776E6 #2f3136;
}

/* 确保生成按钮始终在底部并保持间距 */
.generate-button {
  margin-top: auto;
  margin-bottom: 44px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
  flex-shrink: 0;
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hidden {
  display: none;
}

/* 美化下载按钮样式 */
.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(71, 118, 230, 0.3);
}

.action-button:active {
  transform: translateY(0);
}

.right-panel {
  flex: 1;
  height: 100vh;
  padding: 20px;
  padding-bottom: 64px;
  overflow-y: auto;
}

.top-bar {
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  z-index: 1000;
}

.right-buttons {
  display: flex;
  gap: 10px;
}

.top-button {
  background: transparent;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.top-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.redeem-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.redeem-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.4);
}

.redeem-button:active {
  transform: translateY(0);
}

.status-text {
  color: #8e9297;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
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

.gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 44px;
  flex: 1;
}

/* 加载中状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(71, 118, 230, 0.2);
  border-left: 4px solid #4776E6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #8e9297;
  font-size: 16px;
}

.image-group {
  min-height: calc(33.333vh - 20px);
  background-color: #2a2c34;
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.group-title {
  padding: 16px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #40444b;
}

/* 修改复制图标样式为序号样式 */
.item-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background-color: #4776E6;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 2px;
  margin-right: 8px;
}

.copy-icon {
  width: 16px;
  height: 16px;
  background-color: #8e9297;
  border-radius: 2px;
  margin-right: 8px;
  display: inline-block;
}

.image-container {
  padding: 16px;
  display: flex;
  justify-content: center;
}

/* 修改右侧图片展示样式，确保完整展示 */
.image-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 8px;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  max-height: 600px;
}

/* 图片操作按钮样式 */
.image-actions {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 12px;
}

.download-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: rgba(71, 118, 230, 0.9);
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.4);
  z-index: 10;
}

.download-button:hover {
  background-color: rgba(59, 98, 204, 1);
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(71, 118, 230, 0.6);
}

.download-button:active {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(71, 118, 230, 0.5);
}

/* 裁剪按钮样式 */
.crop-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: rgba(142, 84, 233, 0.9);
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(142, 84, 233, 0.4);
  z-index: 10;
}

.crop-button:hover {
  background-color: rgba(118, 68, 198, 1);
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(142, 84, 233, 0.6);
}

.crop-button:active {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(142, 84, 233, 0.5);
}

/* 裁剪模态框样式 */
.cus-cropper-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

/* 当裁剪模态框打开时，隐藏背后的页面元素 */
.view-container:has(.cropper-modal) .left-panel,
.view-container:has(.cropper-modal) .right-panel {
  display: none !important;
}

.cropper-modal-content {
  background-color: #2d2f36;
  border-radius: 12px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.cropper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #40444b;
}

.cropper-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
}

.close-button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: #40444b;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: #4776E6;
  transform: rotate(90deg);
}

.cropper-body {
  flex: 1;
  padding: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cropper-image-container {
  width: 100%;
  height: 100%;
  max-height: 60vh;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.image-zoom-controls {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 24px;
  backdrop-filter: blur(4px);
}

.cropper-image-container img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.cropper-options {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 200px;
  padding: 16px;
  background-color: #363840;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}

.cropper-options h4 {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.size-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}

/* 添加滚动条样式 */
.size-options::-webkit-scrollbar {
  width: 6px;
}

.size-options::-webkit-scrollbar-track {
  background: #363840;
  border-radius: 3px;
}

.size-options::-webkit-scrollbar-thumb {
  background: #4776E6;
  border-radius: 3px;
}

.size-options::-webkit-scrollbar-thumb:hover {
  background: #5a7ed9;
}

.size-option {
  padding: 12px;
  background-color: #40444b;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #ffffff;
}

.size-option:hover {
  background-color: #4a4d52;
  transform: translateY(-2px);
}

.size-option.active {
  border-color: #4776E6;
  background-color: rgba(71, 118, 230, 0.1);
}

.size-info {
  font-size: 12px;
  color: #b0b3b8;
}

/* 覆盖cropperjs的默认样式，确保背景不透明 */
.cropper-modal .cropper-container,
.cropper-modal .cropper-wrap-box,
.cropper-modal .cropper-canvas,
.cropper-modal .cropper-drag-box,
.cropper-modal .cropper-crop-box,
.cropper-modal .cropper-modal .cropper-view-box,
.cropper-modal .cropper-face,
.cropper-modal .cropper-line,
.cropper-modal .cropper-point {
  background-color: #000000 !important;
  background-image: none !important;
}

.cropper-modal .cropper-bg {
  background-color: #000000 !important;
  background-image: none !important;
}

.cropper-modal .cropper-canvas {
  background-color: #000000 !important;
}

.cropper-modal .cropper-view-box {
  background-color: #000000 !important;
}

.cropper-modal .cropper-drag-box {
  background-color: #000000 !important;
}

.cropper-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #40444b;
}

.zoom-buttons {
  display: flex;
  gap: 8px;
}

.zoom-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: #40444b;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-button:hover {
  background-color: #4776E6;
  transform: translateY(-2px);
}

.zoom-button:active {
  transform: translateY(0);
}

.cancel-button,
.confirm-button {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: #40444b;
  color: #ffffff;
}

.cancel-button:hover {
  background-color: #4a4d52;
}

.confirm-button {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: #ffffff;
}

.confirm-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 118, 230, 0.4);
}

.confirm-button:active {
  transform: translateY(0);
}

/* 空状态样式 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b8c91;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.empty-title {
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 16px;
}

.empty-description {
  text-align: center;
  max-width: 500px;
}

.empty-description p {
  font-size: 14px;
  color: #b0b3b8;
  margin: 0 0 16px 0;
}

.empty-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  background-color: #363840;
  border-radius: 8px;
  padding: 20px;
}

.empty-steps li {
  font-size: 14px;
  color: #b0b3b8;
  padding: 8px 0;
  border-bottom: 1px solid #40444b;
}

.empty-steps li:last-child {
  border-bottom: none;
}

.empty-steps li::before {
  content: "✓";
  color: #4776E6;
  margin-right: 8px;
  font-weight: bold;
}

</style>