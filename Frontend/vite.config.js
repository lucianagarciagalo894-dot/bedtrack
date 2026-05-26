import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
    basicSsl()
  ],
  server: {
    https: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7186',
        changeOrigin: true,
        secure: false
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
  }
})