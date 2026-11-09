import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'charts-vendor': ['recharts'],
          'ui-vendor': ['lucide-react', 'canvas-confetti', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
