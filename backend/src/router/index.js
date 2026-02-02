import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    redirect: '/wallpaper',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'wallpaper',
        name: 'Wallpaper',
        component: () => import('@/pages/wallpaper/index.vue'),
        meta: { title: '壁纸管理' }
      },
      {
        path: 'classify',
        name: 'Classify',
        component: () => import('@/pages/classify/index.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/pages/banner/index.vue'),
        meta: { title: '轮播图管理' }
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/pages/notice/index.vue'),
        meta: { title: '公告管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore()
  
  if (to.meta.requiresAuth && !adminStore.token) {
    next('/login')
  } else if (to.path === '/login' && adminStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router