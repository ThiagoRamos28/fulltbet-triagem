import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base casa com o nome do repositório publicado no GitHub Pages
// (https://thiagoramos28.github.io/fulltbet-triagem/), conforme PRODUCT.md.
export default defineConfig({
  base: '/fulltbet-triagem/',
  plugins: [react()],
})
