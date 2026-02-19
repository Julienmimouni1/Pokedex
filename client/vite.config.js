import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/pokemon': 'http://localhost:3000',
      '/team': 'http://localhost:3000',
      '/type': 'http://localhost:3000'
    }
  }
})
