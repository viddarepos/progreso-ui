import 'dotenv/config'
import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react(), splitVendorChunkPlugin()],
  publicDir: 'public',
})
