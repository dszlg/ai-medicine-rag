import { createRouter, createWebHistory } from 'vue-router'
import { staticRouter, errorRouter } from './modules/staticRouter'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { getProfile } from '@/api/profile'
import { roleType } from '@/typings/api/user'
import { addRoutes } from './helper'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...staticRouter, ...errorRouter] as any
})

router.beforeEach(async (to, from) => {
  NProgress.start()

  // 动态设置页面标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

  const userStore = useUserStoreWithOut()
  if (userStore.getLogin) {
    try {
      // 获取用户信息, 获取不到就跳转到登录页面
      await getProfile()
      if (!userStore.getIsSetUser) {
        userStore.setUser()
        // 重新添加路由
        await addRoutes(userStore.getRole as roleType)
        return { path: to.fullPath, replace: true }
      } else {
        // 登录状态下访问登录页面, 返回上一个页面
        if (to.path === '/login') {
          return { path: from.fullPath, replace: true }
        }
        // 登录状态下访问其他页面则放行
        else {
          return true
        }
      }
    } catch (error) {
      // 信息校验失败
      userStore.logout()
      return { path: '/login' }
    }
  } else {
    if (to.path === '/login') {
      return true
    } else {
      return { path: '/login' }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

router.onError(error => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

export default router
