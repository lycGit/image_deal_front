import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../home/HomePage.vue'
import MJDrawing from '../views/MJDrawing.vue'
import KLDrawing from '../views/KLDrawing.vue'
import D3Drawing from '../views/D3Drawing.vue'
import MagicAvatar from '../views/MagicAvatar.vue'
import AIParagraph from '../views/AIParagraph.vue'
import ImageSwap from '../views/ImageSwap.vue'
import MultiSwap from '../views/MultiSwap.vue'
import VideoSwap from '../views/VideoSwap.vue'
import AIDressing from '../views/AIDressing.vue'
import AIVideoVidu from '../views/AIVideoVidu.vue'
import AIVideoKL from '../views/AIVideoKL.vue'
import AIVideoPrka from '../views/AIVideoPrka.vue'
import ChatRoom from '@/socket/ChatRoom.vue'
import ExchangeCodePage from '../views/ExchangeCodePage.vue' // 导入新页面组件
import HeadshotDrawing from '../views/HeadshotDrawing.vue'
import ArtPhotoDrawing from '../views/ArtPhotoDrawing.vue'
import ImageCropperDemo from '../views/ImageCropperDemo.vue' // 导入图片裁剪演示页面
import Introduce from '../views/Introduce.vue' 
import ImageCompress from '../views/ImageCompress.vue' // 导入图片压缩页面

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      keepAlive: true,
      componentName: 'HomePage'
    },
    children: [
      {
        path: '',
        name: 'mjDrawing',
        component: MJDrawing,
        meta: {
          keepAlive: true,
          componentName: 'MJDrawing'
        }
      },
      {
        path: '/mj-drawing',
        name: 'mjDrawing',
        component: MJDrawing,
        meta: {
          keepAlive: true,
          componentName: 'MJDrawing'
        }
      },
      {
        path: '/kl-drawing',
        name: 'klDrawing',
        component: KLDrawing,
        meta: {
          keepAlive: true,
          componentName: 'KLDrawing'
        }
      },
      {
        path: '/d3-drawing',
        name: 'd3Drawing',
        component: D3Drawing,
        meta: {
          keepAlive: true,
          componentName: 'D3Drawing'
        }
      },
      {
        path: '/magic-avatar',
        name: 'magicAvatar',
        component: MagicAvatar,
        meta: {
          keepAlive: true,
          componentName: 'MagicAvatar'
        }
      },
      {
        path: '/ai-paragraph',
        name: 'aiParagraph',
        component: AIParagraph,
        meta: {
          keepAlive: true,
          componentName: 'AIParagraph'
        }
      },
      {
        path: '/image-swap',
        name: 'imageSwap',
        component: ImageSwap,
        meta: {
          keepAlive: true,
          componentName: 'ImageSwap'
        }
      },
      {
        path: '/multi-swap',
        name: 'multiSwap',
        component: MultiSwap,
        meta: {
          keepAlive: true,
          componentName: 'MultiSwap'
        }
      },
      {
        path: '/video-swap',
        name: 'videoSwap',
        component: VideoSwap,
        meta: {
          keepAlive: true,
          componentName: 'VideoSwap'
        }
      },
      {
        path: '/ai-dressing',
        name: 'aiDressing',
        component: AIDressing,
        meta: {
          keepAlive: true,
          componentName: 'AIDressing'
        }
      },
      {
        path: '/ai-video-vidu',
        name: 'aiVideoVidu',
        component: AIVideoVidu,
        meta: {
          keepAlive: true,
          componentName: 'AIVideoVidu'
        }
      },
      {
        path: '/ai-video-kl',
        name: 'aiVideoKL',
        component: AIVideoKL,
        meta: {
          keepAlive: true,
          componentName: 'AIVideoKL'
        }
      },
      {
        path: '/ai-video-prka',
        name: 'aiVideoPrka',
        component: AIVideoPrka,
        meta: {
          keepAlive: true,
          componentName: 'AIVideoPrka'
        }
      },
      {
        path: '/chat-room',
        name: 'chatRoom',
        component: ChatRoom,
        meta: {
          keepAlive: true,
          componentName: 'ChatRoom'
        }
      }
    ]
  },
  {
    path: '/exchange-code',
    name: 'exchangeCode',
    component: ExchangeCodePage,
    meta: {
      keepAlive: false,
      componentName: 'ExchangeCodePage'
    }
  },
  {
    path: '/head-shot',
    name: 'headshot',
    component: HeadshotDrawing,
    meta: {
      keepAlive: false,
      componentName: 'HeadshotDrawing'
    }
  },
  {
    path: '/art-photo',
    name: 'artphoto',
    component: ArtPhotoDrawing,
    meta: {
      keepAlive: false,
      componentName: 'ArtPhotoDrawing'
    }
  },
  {
    path: '/image-cropper',
    name: 'imageCropper',
    component: ImageCropperDemo,
    meta: {
      keepAlive: false,
      componentName: 'ImageCropperDemo'
    }
  },
    {
    path: '/introduce',
    name: 'introduce',
    component: Introduce,
    meta: {
      keepAlive: false,
      componentName: 'IntroducePage'
    }
  },
  {
    path: '/image-compress',
    name: 'imageCompress',
    component: ImageCompress,
    meta: {
      keepAlive: false,
      componentName: 'ImageCompress'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 