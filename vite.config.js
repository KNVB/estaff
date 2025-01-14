import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
dotenv.config({ path: './.env.' + process.env.NODE_ENV });
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host:true,
    port:3000,
    proxy: {
      "/publicAPI": {
        target: "http://localhost:"+ process.env.VITE_APP_SOCKET_PORT,
        changeOrigin: true,
      },
      "/privateAPI": {
        target: "http://localhost:"+ process.env.VITE_APP_SOCKET_PORT,
        changeOrigin: true,
      }
    }
  }
});
