import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
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

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    name: 'home',
    component: MJDrawing
  },
  {
    path: '/mj-drawing',
    name: 'mjDrawing',
    component: MJDrawing
  },
  {
    path: '/kl-drawing',
    name: 'klDrawing',
    component: KLDrawing
  },
  {
    path: '/d3-drawing',
    name: 'd3Drawing',
    component: D3Drawing
  },
  {
    path: '/magic-avatar',
    name: 'magicAvatar',
    component: MagicAvatar
  },
  {
    path: '/ai-paragraph',
    name: 'aiParagraph',
    component: AIParagraph
  },
  {
    path: '/image-swap',
    name: 'imageSwap',
    component: ImageSwap
  },
  {
    path: '/multi-swap',
    name: 'multiSwap',
    component: MultiSwap
  },
  {
    path: '/video-swap',
    name: 'videoSwap',
    component: VideoSwap
  },
  {
    path: '/ai-dressing',
    name: 'aiDressing',
    component: AIDressing
  },
  {
    path: '/ai-video-vidu',
    name: 'aiVideoVidu',
    component: AIVideoVidu
  },
  {
    path: '/ai-video-kl',
    name: 'aiVideoKL',
    component: AIVideoKL
  },
  {
    path: '/ai-video-prka',
    name: 'aiVideoPrka',
    component: AIVideoPrka
  },
  {
    path: '/chat-room',
    name: 'chatRoom',
    component: ChatRoom
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 