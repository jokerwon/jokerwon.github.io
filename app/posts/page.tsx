import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '博客 — Kai Weng',
  description: 'Kai Weng 写下的文章与思考。',
}

const posts = [
  {
    href: '/posts/agency-agnets',
    category: 'AI 工具',
    date: '2026.09.11',
    title: 'Agency Agents：独立开发者如何零成本雇一支 AI 专家团队',
    description: '介绍 Agency Agents 的核心能力、真实使用案例、安装方式与独立开发者实践建议。',
  },
]

export default function PostsPage() {
  return (
    <section className="mx-auto min-h-[calc(100vh-80px)] max-w-7xl px-10 py-24 max-[700px]:px-5 max-[700px]:py-16" aria-labelledby="posts-title">
      <p className="mb-4 text-xs tracking-[0.08em] text-muted">BLOG / 博客</p>
      <h1 id="posts-title" className="mb-20 font-serif text-[clamp(40px,6vw,68px)] font-semibold leading-[1.2] tracking-[-0.02em] text-title max-[700px]:mb-14">
        写下来，
        <br />
        <em className="not-italic text-primary">留着以后再看。</em>
      </h1>
      <div className="border-t border-border-strong">
        {posts.map((post) => (
          <article className="grid grid-cols-[180px_1fr_auto] gap-10 border-b border-border py-10 max-[700px]:block" key={post.href}>
            <p className="text-xs tracking-[0.08em] text-muted max-[700px]:mb-4">
              {post.category} · {post.date}
            </p>
            <div>
              <h2 className="mb-3 font-serif text-2xl font-semibold leading-[1.45] text-title">{post.title}</h2>
              <p className="max-w-150 text-sm leading-[1.8] text-muted">{post.description}</p>
            </div>
            <Link
              className="group self-center text-sm text-primary underline decoration-1 underline-offset-[5px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent max-[700px]:mt-6 max-[700px]:inline-block"
              href={post.href}
            >
              阅读全文
              <ArrowRight className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" size={16} strokeWidth={1.75} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
