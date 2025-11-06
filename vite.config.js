import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/user/settings': {
        target: 'http://localhost:8088',      
        changeOrigin: true,
        secure: false
      },
      '/api/recommendations': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/word-study': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/quiz': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/questions': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/learning-sessions': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/question-answers': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/learning-analytics': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/sessions': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/daily-activity': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/weekly-graph': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/question-type-accuracy': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/weakness-distribution': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      },
      '/api/settings': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
