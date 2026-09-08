import { defineStore } from 'pinia'
import router from '@/router'
import { LoginResultVO } from '@/typings/api/login'
import { addRoutes, resetRouter } from '@/router/helper'
import { HOME_URL, LOGIN_URL } from '@/config'
import { roleType } from '@/typings/api/user'

interface UserInfoVO extends Omit<LoginResultVO, 'access_token' | 'token_type'> {}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isSetUser: false,
    isLogin: false,
    access_token: '',
    token_type: '',
    role: '',
    user_id: 0,
    username: '',
    nickname: '',
    avatar: ''
  }),
  getters: {
    getLogin(): boolean {
      return this.isLogin
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getToken(): string {
      return this.access_token
    },
    getRole(): string {
      return this.role
    },
    getInfo(): UserInfoVO {
      return {
        role: this.role,
        user_id: this.user_id,
        username: this.username,
        nickname: this.nickname,
        avatar: this.avatar
      }
    }
  },
  actions: {
    /**
     * 保存用户登陆后的信息
     */
    setUserInfoAction(req: LoginResultVO) {
      this.$patch(state => {
        state.isSetUser = true
        state.isLogin = true
        state.access_token = req.access_token
        state.role = req.role
        state.user_id = req.user_id
        state.username = req.username
        state.nickname = req.nickname ? req.nickname : ''
        state.avatar = req.avatar ? req.avatar : ''
      })
    },
    setUser() {
      this.isSetUser = true
    },
    async login(req: LoginResultVO) {
      // 1.保存用户信息
      this.setUserInfoAction(req)
      // 2.添加路由包括菜单
      await addRoutes(req.role as roleType)
      // 3.跳转到首页
      switch (this.getRole) {
        case 'admin':
        case 'doctor':
          router.replace('/dashboard')
          break
        case 'user':
          router.replace(HOME_URL)
          break
      }
    },
    async logout() {
      // 删除用户信息
      this.$reset()

      // 删除路由包括菜单
      await resetRouter()

      // 跳转到登录页
      router.replace(LOGIN_URL)
    }
  },
  persist: {
    key: 'user-store',
    pick: ['isLogin', 'access_token', 'role', 'user_id', 'username', 'nickname', 'avatar']
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore()
}
