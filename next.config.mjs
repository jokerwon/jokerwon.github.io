import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_PAGES_BASE_PATH || ''

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  output: 'export',
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  reactStrictMode: true,
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [
      [
        '@shikijs/rehype',
        {
          themes: {
            light: 'vitesse-light',
            dark: 'vitesse-dark',
          },
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
