import type { Metadata } from 'next'
import SiteLayout from './site-layout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kai Weng — 开发者',
  description: 'Kai Weng 的个人主页、作品、经历与思考。',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  )
}
