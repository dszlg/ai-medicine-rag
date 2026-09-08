import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// element-plus组件自动引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 获取环境变量
  const root = process.cwd()
  const env = loadEnv(mode, root)
  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            directives: true
          })
        ],
        dts: 'src/typings/auto-imports.d.ts'
      }),
      Components({ resolvers: [ElementPlusResolver()], dts: 'src/typings/components.d.ts' })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      // loadEnv 已经在上面被调用，直接使用 env 中的值（loadEnv 返回的都是字符串）
      port: Number(env.VITE_PORT) || 3000,
      open: env.VITE_OPEN === 'true'
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/var.scss" as *;`
        }
      }
    }
  }
})
