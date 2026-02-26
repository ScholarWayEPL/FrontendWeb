import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
  },
  optimizeDeps: {
    include: ['@reduxjs/toolkit', 'react-redux'],
  },
  ssr: {
    noExternal: ['@reduxjs/toolkit'],
  },
})
