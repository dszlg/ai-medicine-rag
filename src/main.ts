import { createApp } from 'vue'
import pinia from '@/stores/index'

import App from './App.vue'
import router from './router'

// 引入全局样式
import '@/styles/reset.scss'
import '@/styles/common.scss'
import '@/styles/element-dark.scss'
import '@/styles/element.scss'

// 引入图标字体和自定义字体
import '@/assets/iconfont/iconfont.scss'
import '@/assets/fonts/font.scss'

// 引入element-plus图标
import * as Icons from '@element-plus/icons-vue'
// element dark主题样式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

// 全局注册element-plus图标组件
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)

app.mount('#app')
