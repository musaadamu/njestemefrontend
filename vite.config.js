import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set the development server port to 3000 if you prefer
    hmr: {
      overlay: false, // Disable the error overlay
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
