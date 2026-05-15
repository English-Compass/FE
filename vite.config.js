import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 환경 변수 정의 (백엔드 URL)
  define: {
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('http://localhost:8080') // Gateway URL
  },
  server: {
    proxy: {
      // Gateway를 통해 모든 API 요청 라우팅
      // Gateway는 보통 8080 포트에서 실행
      // 모든 경로를 /api/{service-name}/** 형식으로 통일
      '/api': {
        target: 'http://localhost:8080', // Gateway 포트
        changeOrigin: true,
        secure: false
      }
    }
  }
})
