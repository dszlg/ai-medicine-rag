import { HOME_ICON } from '@/config'

const userRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: '',
    redirect: '/home',
    meta: {
      hidden: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/user/home/index.vue'),
    meta: {
      title: '首页',
      hidden: false,
      affix: true,
      icon: HOME_ICON
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/user/chat/index.vue'),
    meta: { title: 'AI 问诊', hidden: false, icon: 'ChatLineSquare' }
  },
  {
    path: '/consult',
    name: 'consult',
    component: () => import('@/views/user/consult/index.vue'),
    meta: { title: '在线咨询', hidden: false, icon: 'Service' }
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: () => import('@/views/user/appointment/index.vue'),
    meta: { title: '预约挂号', hidden: false, icon: 'Calendar' }
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/views/user/records/index.vue'),
    meta: { title: '健康档案', hidden: false, icon: 'Document' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/views/user/articles/index.vue'),
    meta: { title: '健康资讯', hidden: false, icon: 'Reading' }
  },
  {
    path: '/articles/:id',
    name: 'articleDetail',
    component: () => import('@/views/user/articleDetail/index.vue'),
    meta: { title: '资讯详情', hidden: true, icon: 'Tickets', role: ['admin', 'doctor', 'user'] }
  },
  {
    path: '/notices/:id',
    name: 'noticeDetail',
    component: () => import('@/views/user/noticeDetail/index.vue'),
    meta: { title: '公告详情', hidden: true, icon: 'Tickets', role: ['admin', 'doctor', 'user'] }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: '个人中心', hidden: false, icon: 'User' }
  }
]

export default userRoutes
