export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns'

/**
 * @description: 网站布局状态设置接口
 */
export interface GlobalState {
  layout: LayoutType
  maximize: boolean
  primary: string
  isCollapse: boolean
  isDark: boolean
  accordion: boolean
  watermark: boolean
  breadcrumb: boolean
  breadcrumbIcon: boolean
  footer: boolean
}

export interface TabsMenuProps {
  icon: string
  title: string
  path: string
  name: string
  close: boolean
  noCache: boolean
  active: boolean
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[]
}

/* AuthState */
export interface AuthState {
  authMenuList: AppRouteRecordRaw[]
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[]
}
