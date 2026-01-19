import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'build', // Changed from 'dist' to 'build' for Hostinger compatibility
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    emptyOutDir: true
  }
})
