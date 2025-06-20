import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022' // Added to support top-level await
  },
  // optimizeDeps needed for some CJS/ESM interop issues, might help here too
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
  }
})
