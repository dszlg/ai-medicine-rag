import { defineStore } from 'pinia'
import type { GlobalState } from '../interface/index'
import { DEFAULT_PRIMARY } from '@/config'

export const useGlobalStore = defineStore('globalStore', {
  state: (): GlobalState => ({
    // 页面布局
    layout: 'classic',
    // 是否全屏
    maximize: false,
    // 主题色
    primary: DEFAULT_PRIMARY,
    // 是否暗黑模式
    isDark: false,
    // 是否折叠侧边栏
    isCollapse: false,
    // 手风琴
    accordion: true,
    // 水印
    watermark: false,
    // 面包屑
    breadcrumb: true,
    // 面包屑图标
    breadcrumbIcon: false,
    // 页脚
    footer: true
  }),
  actions: {
    setGlobalState<K extends keyof GlobalState>(key: K, value: GlobalState[K]) {
      this.$patch({
        [key]: value
      })
    }
  },
  persist: {
    key: 'global-state'
  }
})
