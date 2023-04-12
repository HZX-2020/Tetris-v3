import { defineConfig } from 'vite'
import{resolve} from 'path'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  plugins: [vue()],
  resolve: {
    // 配置路径别名
    alias: {
      '@': resolve(__dirname, './src'),
      '#': resolve(__dirname, './types'),
    },
  },
})
