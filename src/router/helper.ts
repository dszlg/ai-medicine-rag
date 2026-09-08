import { useRouter, RouteRecordRaw } from 'vue-router'
import { useAuthStoreWithOut } from '@/stores/modules/auth'
import router from './index'

/**
 * 根据角色类型添加路由和添加左侧菜单
 */
export const addRoutes = async (role: 'user' | 'admin' | 'doctor') => {
  const routes: AppRouteRecordRaw[] = []

  if (role === 'admin') {
    const { default: res } = await import('@/router/modules/adminRoutes')
    routes.push(...res)
  }

  if (role === 'user') {
    const { default: res } = await import('@/router/modules/userRoutes')
    routes.push(...res)
  }

  if (role === 'doctor') {
    const { default: res } = await import('@/router/modules/doctorRoutes')
    routes.push(...res)
  }

  // 添加路由菜单
  const authStore = useAuthStoreWithOut()
  authStore.setAuthMenuList(routes)

  for (const route of routes) {
    router.addRoute('layout', route as RouteRecordRaw)
  }
}

/**
 *  重置路由和左侧菜单
 */
export const resetRouter = () => {
  const authStore = useAuthStoreWithOut()

  // 删除路由
  authStore.authMenuList.forEach(route => {
    const { name } = route
    if (name) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })

  // 重置路由菜单
  authStore.resetAuthStore()
}
