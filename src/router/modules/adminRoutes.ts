// 管理员路由
const adminRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: '',
    redirect: '/dashboard',
    meta: {
      hidden: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/admin/dashboard/index.vue'),
    meta: { title: '数据概览', hidden: false, icon: 'DataAnalysis' }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/admin/users/index.vue'),
    meta: { title: '用户管理', hidden: false, icon: 'User' }
  },
  {
    path: '/doctors',
    name: 'doctors',
    component: () => import('@/views/admin/doctors/index.vue'),
    meta: { title: '医生管理', hidden: false, icon: 'Suitcase' }
  },
  {
    path: '/departments',
    name: 'departments',
    component: () => import('@/views/admin/departments/index.vue'),
    meta: { title: '科室管理', hidden: false, icon: 'Setting' }
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('@/views/admin/knowledge/index.vue'),
    meta: { title: '知识库', hidden: false, icon: 'Reading' }
  },
  {
    path: '/consults',
    name: 'consults',
    component: () => import('@/views/admin/consults/index.vue'),
    meta: { title: '咨询管理', hidden: false, icon: 'Service' }
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: () => import('@/views/admin/appointments/index.vue'),
    meta: { title: '预约管理', hidden: false, icon: 'Calendar' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/views/admin/articles/index.vue'),
    meta: { title: '文章管理', hidden: false, role: ['admin', 'doctor'], icon: 'Tickets' }
  },
  {
    path: '/notices',
    name: 'notices',
    component: () => import('@/views/admin/notices/index.vue'),
    meta: { title: '公告管理', hidden: false, icon: 'Document' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: '个人中心', hidden: false, icon: 'User' }
  }
]

export default adminRoutes
