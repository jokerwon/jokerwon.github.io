import type { Metadata } from 'next'
import SiteLayout from './site-layout'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Kai Weng', template: '%s — Kai Weng' },
  description: 'Kai Weng 的个人主页、作品、经历与思考。',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body className="antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  )
}
