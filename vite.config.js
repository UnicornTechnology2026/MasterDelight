import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// assetsInlineLimit keeps images inside the JS bundle so the app works offline
export default defineConfig({ plugins: [react()], build: { assetsInlineLimit: 1e7 } })
