const doctorRoutes: AppRouteRecordRaw[] = [
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
    component: () => import('@/views/doctor/dashboard/index.vue'),
    meta: { title: '数据概览', hidden: false, icon: 'DataAnalysis' }
  },
  {
    path: '/consults',
    name: 'consults',
    component: () => import('@/views/doctor/consults/index.vue'),
    meta: { title: '待回复咨询', hidden: false, icon: 'Service' }
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: () => import('@/views/doctor/appointments/index.vue'),
    meta: { title: '我的预约', hidden: false, icon: 'Calendar' }
  },
  {
    path: '/patients',
    name: 'patients',
    component: () => import('@/views/doctor/patients/index.vue'),
    meta: { title: '患者档案', hidden: false, icon: 'Document' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { title: '个人中心', hidden: false, icon: 'User' }
  }
]

export default doctorRoutes
