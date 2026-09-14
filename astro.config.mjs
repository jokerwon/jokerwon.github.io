import { defineConfig, fontProviders } from 'astro/config'
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
  // Fonts API（官方推荐）：本地 woff2 → @font-face + cssVariable 由 Font 组件注入。
  // fallbacks 留空：完整回退栈写在 global.css 的 --font-sans/--font-serif/--font-mono 里。
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'LXGW WenKai',
      cssVariable: '--font-wenkai',
      fallbacks: [],
      options: {
        variants: [
          { src: ['./src/assets/fonts/lxgw-wenkai-lite-regular.woff2'], weight: '400', style: 'normal' },
          { src: ['./src/assets/fonts/lxgw-wenkai-lite-medium.woff2'], weight: '500 600', style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'LXGW WenKai Mono',
      cssVariable: '--font-wenkai-mono',
      fallbacks: [],
      options: {
        variants: [
          { src: ['./src/assets/fonts/lxgw-wenkai-mono-lite-regular.woff2'], weight: '400', style: 'normal' },
          { src: ['./src/assets/fonts/lxgw-wenkai-mono-lite-medium.woff2'], weight: '500 600', style: 'normal' },
        ],
      },
    },
  ],
})
