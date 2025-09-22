import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Menambahkan plugin React untuk Vite
  plugins: [react()],
  
  // Konfigurasi server development
  server: {
    // Port untuk server frontend
    port: 5173,
    // Atur proxy jika perlu untuk menghindari masalah CORS
    proxy: {
      '/api': {
        // Target backend Go yang akan kita buat
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // Konfigurasi alias untuk mempermudah impor
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});