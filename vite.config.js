import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite ka configuration file — React plugin use kar rahe hain. Agar aur options chahiye toh docs dekho: https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
