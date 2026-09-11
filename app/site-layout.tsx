'use client'

import Link from 'next/link'
import { useState } from 'react'

const githubUrl = 'https://github.com/jokerwon'

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [dark, setDark] = useState(false)

  return (
    <div className={`${dark ? 'theme-dark' : ''} min-h-screen bg-page text-body transition-colors duration-150`}>
      <a className="absolute left-4 -top-25 z-10 bg-primary px-4 py-2 text-on-primary focus:top-4" href="#main-content">
        跳到主要内容
      </a>
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between border-b border-border px-10 max-[700px]:h-18 max-[700px]:px-5">
        <Link className="font-serif text-[28px] leading-none text-title no-underline" href="/" aria-label="Kai Weng 首页">
          K<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-3" aria-label="主导航">
          <Link
            className="rounded px-3 py-2 text-sm text-muted no-underline transition-colors duration-150 hover:text-title focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            href="/posts"
          >
            博客
          </Link>
          <a
            className="inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface hover:text-title focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="访问 Kai Weng 的 GitHub"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.99 10.99 0 0 1 5.75 0C17.03 4.99 18 5.3 18 5.3c.62 1.58.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.29c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
            </svg>
          </a>
          <button
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted transition-colors duration-150 hover:bg-surface hover:text-title focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            type="button"
            onClick={() => setDark((current) => !current)}
            aria-label={dark ? '切换浅色模式' : '切换暗色模式'}
          >
            {dark ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            )}
          </button>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
