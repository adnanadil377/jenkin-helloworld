import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // allow external access
    port: 5174,        // choose your port
    strictPort: true   // fail if port is taken
  }
})
