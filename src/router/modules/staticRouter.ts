import { LOGIN_URL } from '@/config'

// 静态路由
export const staticRouter: AppRouteRecordRaw[] = [
  {
    path: LOGIN_URL,
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录/注册',
      hidden: false
    }
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    meta: {},
    children: []
  }
]

// 页面路由错误
export const errorRouter: AppRouteRecordRaw[] = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/ErrorMessage/403.vue'),
    meta: {
      title: '403'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/ErrorMessage/404.vue'),
    meta: {
      title: '404'
    }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/components/ErrorMessage/500.vue'),
    meta: {
      title: '500'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Not Found',
    component: () => import('@/components/ErrorMessage/404.vue'),
    meta: {
      title: '404'
    }
  }
]
