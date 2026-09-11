import type { Metadata } from 'next'
import Link from 'next/link'
import DesignDocument from '@/DESIGN.md'

export const metadata: Metadata = {
  title: '原研哉式 Web UI 设计规范 — Kai Weng',
  description: '一份面向 Web 产品界面的设计规范，覆盖视觉、组件、内容、交互与评审门禁。',
}

const updatedAt = '2026-09-11'
const readingMinutes = 22

export default function DesignNotePage() {
  return (
    <main className="min-h-screen bg-page text-body">
      <a className="absolute left-4 -top-25 z-10 bg-primary px-4 py-2 text-on-primary focus:top-4" href="#article-content">
        跳到正文
      </a>
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between border-b border-border px-10 max-[700px]:h-18 max-[700px]:px-5">
        <Link className="font-serif text-[28px] leading-none text-title no-underline" href="/" aria-label="Kai Weng 首页">
          K<span className="text-accent">.</span>
        </Link>
        <Link className="text-sm text-primary underline decoration-1 underline-offset-[5px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" href="/#notes">
          返回文章
        </Link>
      </header>

      <article id="article-content" className="mx-auto max-w-7xl px-10 pb-32 max-[700px]:px-5 max-[700px]:pb-20" tabIndex={-1}>
        <header className="grid grid-cols-[minmax(0,1fr)_minmax(260px,360px)] gap-16 border-b border-border py-24 max-[700px]:block max-[700px]:py-16">
          <div>
            <p className="mb-6 text-xs tracking-[0.08em] text-muted">文章 / 设计</p>
            <h1 className="max-w-190 font-serif text-[clamp(40px,6vw,68px)] font-semibold leading-[1.2] tracking-[-0.02em] text-title">原研哉式 Web UI 设计规范</h1>
          </div>
          <div className="self-end border-t border-border-strong pt-5 text-sm leading-7 text-muted max-[700px]:mt-12">
            <dl className="grid grid-cols-[72px_1fr] gap-x-5 gap-y-1">
              <dt>作者</dt>
              <dd className="m-0 text-title">Kai Weng</dd>
              <dt>更新</dt>
              <dd className="m-0 text-title"><time dateTime={updatedAt}>2026 年 9 月 11 日</time></dd>
              <dt>阅读</dt>
              <dd className="m-0 text-title">约 {readingMinutes} 分钟</dd>
            </dl>
          </div>
        </header>

        <div className="markdown-body mx-auto max-w-190 pt-20 max-[700px]:pt-12">
          <DesignDocument />
        </div>
      </article>
    </main>
  )
}
