import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Injecter les variables d'environnement au build
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000/api'),
  },
})
