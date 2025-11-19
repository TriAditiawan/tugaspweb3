// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/tugaspweb3/',   // PENTING: harus ada trailing slash
  plugins: [vue()]
})
