import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // allowedHosts: ['.ngrok-free.app'],
    hmr: {
      // protocol: 'wss',
      protocol: 'ws',
      // host: '2796-2c0f-2a80-93d-2310-3561-3733-aa50-a19a.ngrok-free.app',
       host: 'localhost',
      port: 5173,
      hmr: false
    },
  },
})
