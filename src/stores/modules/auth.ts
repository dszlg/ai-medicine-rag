import { defineStore } from 'pinia'
import { AuthState } from '../interface'
import { staticRouter } from '@/router/modules/staticRouter'
import pinia from '..'

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    // 菜单
    authMenuList: []
  }),
  actions: {
    setAuthMenuList(list: AppRouteRecordRaw[]) {
      this.$patch(state => {
        // 将首页手动添加到菜单列表中
        state.authMenuList = staticRouter
          .find(route => route.path === '/')
          ?.children?.concat(list) as any
      })
    },
    resetAuthStore() {
      this.$reset()
    }
  }
})

export function useAuthStoreWithOut() {
  return useAuthStore(pinia)
}
