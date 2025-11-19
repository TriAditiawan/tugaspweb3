// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/tugaspweb3/',   // <--- penting (sesuaikan nama repo)
  plugins: [vue()]
})
