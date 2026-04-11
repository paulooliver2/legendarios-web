import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // host: true torna o Vite acessível fora do container Docker
    host: true,
    proxy: {
      '/api': {
        // Em Docker: API_PROXY_TARGET=http://api:3333
        // Em dev local: http://localhost:3333
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:3333',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
