import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    proxy: {
      '/web': {
        target: 'http://localhost:9999', // 后端服务的地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/web/, '')
      },
      '/upload': {
        target: 'https://picui.cn', // 后端服务的地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, '')
      }
    }
  },
  resolve: {
    alias: {
        "@": resolve(__dirname, "src")  
    }    
  }
})
