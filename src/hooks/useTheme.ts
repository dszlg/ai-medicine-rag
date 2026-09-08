import { useGlobalStore } from '@/stores/modules/global'
import { DEFAULT_PRIMARY } from '@/config'
import { ElMessage } from 'element-plus'
import { ThemeType } from './interface'
import { storeToRefs } from 'pinia'
import { menuTheme } from '@/styles/theme/menu'
import { getDarkColor, getLightColor } from '@/utils/color'

export const useTheme = () => {
  const globalStore = useGlobalStore()
  const { isDark, primary } = storeToRefs(globalStore)

  // 切换暗黑模式：同时修改主题颜色、侧边栏、头部颜色
  const switchDark = () => {
    const html = document.documentElement as HTMLElement
    if (isDark.value) html.setAttribute('class', 'dark')
    else html.setAttribute('class', '')
    changePrimary(primary.value)
  }

  //修改主题颜色
  const changePrimary = (val: string | null) => {
    if (!val) {
      val = DEFAULT_PRIMARY
      ElMessage({
        message: '主题颜色已重置',
        type: 'success'
      })
    }
    document.documentElement.style.setProperty('--el-color-primary', val)
    document.documentElement.style.setProperty(
      '--el-color-primary-dark-2',
      isDark.value ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
    )
    for (let i = 1; i <= 9; i++) {
      const primaryColor = isDark.value
        ? `${getDarkColor(val, i / 10)}`
        : `${getLightColor(val, i / 10)}`
      document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor)
    }
    globalStore.setGlobalState('primary', val)
  }

  // 设置菜单样式
  const setMenuTheme = () => {
    let type: ThemeType = 'light'
    if (isDark.value) type = 'dark'
    const theme = menuTheme[type]
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value)
    }
  }

  // 初始化主题
  const initTheme = () => {
    switchDark()
  }

  return {
    switchDark,
    changePrimary,
    setMenuTheme,
    initTheme
  }
}
