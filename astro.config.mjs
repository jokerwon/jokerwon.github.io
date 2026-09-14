import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://jokerwon.github.io',
  base: process.env.GITHUB_PAGES_BASE_PATH || '/',
  output: 'static',
  outDir: './out',
  build: {
    format: 'directory',
  },
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
