import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three/addons': path.resolve(__dirname, 'node_modules/three/examples/jsm'),
    },
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: [
      'lucide-react',
      '@mediapipe/tasks-vision'
    ],
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
})
