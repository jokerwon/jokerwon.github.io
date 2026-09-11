import Image from 'next/image'
import kaiAvatar from '@/public/images/kai-avatar.webp'

const githubUrl = 'https://github.com/jokerwon'

const principles = [
  { number: '01', title: '先弄明白，再动手', description: '碰到复杂问题，我会先把目标和边界问清楚，再拆成下一步。' },
  { number: '02', title: '做能用的东西', description: '想法落到产品里，才有机会被验证。比起漂亮概念，我更在意它能不能解决问题。' },
  { number: '03', title: '保持好奇', description: '技术会变，答案也会变。多试一次、多问一句，通常比急着下结论更有用。' },
]

const arrowDownRightIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 7 10 10" />
    <path d="M17 7v10H7" />
  </svg>
)

const arrowRightIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-1">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const externalLinkIcon = (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

export default function Home() {
  const sectionClass = 'mx-auto grid max-w-7xl grid-cols-2 gap-16 border-t border-border px-10 py-32 max-[700px]:block max-[700px]:px-5 max-[700px]:py-20'
  const sectionTitleClass = 'mt-4 font-serif text-[clamp(32px,4vw,48px)] font-semibold leading-[1.33] tracking-[-0.02em] text-title max-[700px]:text-4xl [&_em]:not-italic [&_em]:text-primary'
  const sectionIndexClass = 'mb-0 text-xs tracking-[0.08em] text-muted'
  const focusRingClass = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
  const buttonClass = `inline-flex min-h-12 items-center gap-6 rounded px-4 py-2 text-sm no-underline transition-[background-color,border-color,transform] duration-150 hover:-translate-y-0.5 ${focusRingClass}`
  const textLinkClass = `group text-sm text-primary underline decoration-1 underline-offset-[5px] ${focusRingClass}`

  return (
    <>
      <div id="top" className="mx-auto max-w-7xl px-10 max-[700px]:px-5">
        <section
          className="flex min-h-[calc(100vh-80px)] max-h-200 items-center justify-between gap-16 max-[700px]:block max-[700px]:min-h-0 max-[700px]:py-20"
          aria-labelledby="hero-title"
        >
          <div className="max-w-165 py-24 max-[700px]:py-0">
            <p className="mb-8 flex items-center gap-2 text-xs tracking-[0.08em] text-muted">
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
              开发者 · Kai Weng
            </p>
            <h1
              id="hero-title"
              className="mb-8 font-serif text-[clamp(40px,6vw,72px)] font-semibold leading-[1.2] tracking-[-0.02em] text-title max-[700px]:text-5xl [&_em]:not-italic [&_em]:text-primary"
            >
              你好，我是
              <br />
              <em>Kai Weng</em>。
            </h1>
            <p className="mb-10 max-w-125 text-lg leading-[1.67] text-muted max-[700px]:text-base">这里是我的个人网站，放项目、经历和偶尔写下来的思考。</p>
            <div className="flex items-center gap-8">
              <a className={`${buttonClass} bg-primary text-on-primary hover:bg-primary-hover`} href="#work">
                看看我在做什么 {arrowDownRightIcon}
              </a>
              <a className={textLinkClass} href="#about">
                先了解我{' '}
                {arrowRightIcon}
              </a>
            </div>
          </div>
          <figure className="relative m-0 size-80 shrink-0 max-[700px]:mx-auto max-[700px]:mt-20 max-[700px]:mb-10 max-[700px]:size-55">
            <Image
              className="absolute inset-4 size-[calc(100%-32px)] rounded-full object-cover saturate-[.88] max-[700px]:inset-3 max-[700px]:size-[calc(100%-24px)]"
              src={kaiAvatar}
              alt="Kai Weng 的卡通人物形象"
              priority
              sizes="(max-width: 700px) 220px, 320px"
            />
            <figcaption className="absolute -bottom-6 left-1/2 z-2 -translate-x-1/2 whitespace-nowrap text-center text-[10px] leading-[1.6] tracking-[0.16em] text-muted max-[700px]:-bottom-8">
              PERSONAL
              <br />
              ARCHIVE / 2026
            </figcaption>
          </figure>
        </section>
        <div className="flex items-center gap-4 pb-8 text-[11px] tracking-[0.08em] text-muted max-[700px]:pb-0">
          <span>向下阅读</span>
          <span className="h-px w-12 bg-border-strong" />
          <span>01 — 05</span>
        </div>
      </div>

      <section id="about" className={sectionClass} aria-labelledby="about-title">
        <div className="max-[700px]:mb-14">
          <p className={sectionIndexClass}>01 / 关于</p>
          <h2 id="about-title" className={sectionTitleClass}>
            我是谁，
            <br />
            <em>从这里说起。</em>
          </h2>
        </div>
        <div className="max-w-130 pt-10 max-[700px]:pt-0">
          <p className="mb-10 text-2xl leading-[1.55] text-title max-[700px]:text-xl">
            我是一名开发者，喜欢从一个模糊的念头出发，把它一点点做成真正能用的产品。这个网站是我的公开入口。你可以在这里了解我做过什么、最近在关注什么。
          </p>
          <p className="text-sm text-muted">「热忱之心不可泯灭」是我一直记着的一句话。网站才刚起步，有些地方还空着。作品、经历和文章整理好后，我会陆续放上来。没准备好的内容，不急着凑数。</p>
        </div>
      </section>

      <section id="work" className={sectionClass} aria-labelledby="work-title">
        <div className="max-[700px]:mb-14">
          <p className={sectionIndexClass}>02 / 作品</p>
          <h2 id="work-title" className={sectionTitleClass}>
            做过什么，
            <br />
            <em>放在这里。</em>
          </h2>
        </div>
        <div className="grid grid-cols-[140px_1fr] self-end border-t border-border-strong py-10 max-[700px]:grid-cols-[90px_1fr] max-[700px]:gap-5">
          <div className="font-serif text-[64px] leading-none text-primary max-[700px]:text-[44px]">
            0<span className="ml-2 font-sans text-sm text-muted">件</span>
          </div>
          <div>
            <p className="mb-2 text-xs tracking-[0.08em] text-muted">还没有公开内容</p>
            <h3 className="mb-3 text-xl font-semibold text-title">作品还在整理。</h3>
            <p className="mb-6 max-w-100 text-sm text-muted">等资料准备好，我会把项目背景、做法和结果一起放上来。现在可以先了解我，或者直接来聊聊。</p>
            <a className={textLinkClass} href="#about">
              阅读关于我{' '}
              {arrowRightIcon}
            </a>
          </div>
        </div>
      </section>

      <section id="experience" className={sectionClass} aria-labelledby="experience-title">
        <div className="max-[700px]:mb-14">
          <p className={sectionIndexClass}>03 / 经历</p>
          <h2 id="experience-title" className={sectionTitleClass}>
            一路做过的事，
            <br />
            <em>慢慢补上。</em>
          </h2>
        </div>
        <div className="relative self-end border-t border-border-strong py-10 pl-8">
          <span className="absolute -top-1.25 -left-1.25 size-2.25 rounded-full bg-accent" aria-hidden="true" />
          <div>
            <h3 className="mb-3 text-xl font-semibold text-title">履历还在整理</h3>
            <p className="mb-6 max-w-100 text-sm text-muted">与其先摆上一串空泛的关键词，我更愿意等资料齐了再更新。想先看看代码，可以去 GitHub。</p>
            <a className={`${buttonClass} mt-6 border border-border-strong text-primary`} href={githubUrl} target="_blank" rel="noopener noreferrer">
              查看 GitHub {externalLinkIcon}
            </a>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} max-w-none bg-surface px-[max(40px,calc((100%-1200px)/2))] max-[700px]:px-5`} aria-labelledby="principles-title">
        <div className="max-[700px]:mb-14">
          <p className={sectionIndexClass}>04 / 方法</p>
          <h2 id="principles-title" className={sectionTitleClass}>
            我做事的
            <br />
            <em>三个习惯。</em>
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-8 pt-10 max-[700px]:block max-[700px]:pt-0">
          {principles.map(({ number, title, description }) => (
            <article className="border-t border-border-strong pt-4 max-[700px]:mb-10" key={number}>
              <p className="mb-12 text-xs tracking-[0.08em] text-muted max-[700px]:mb-6">{number}</p>
              <h3 className="mb-4 text-xl font-semibold text-title">{title}</h3>
              <p className="max-w-100 text-sm text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="notes" className={sectionClass} aria-labelledby="notes-title">
        <div className="flex flex-col justify-between max-[700px]:mb-14">
          <div>
            <p className={sectionIndexClass}>05 / 文章</p>
            <h2 id="notes-title" className={sectionTitleClass}>
              写下来，
              <br />
              <em>留着以后再看。</em>
            </h2>
          </div>
          <p className="pt-10 text-sm leading-[1.8] text-muted max-[700px]:pt-0">
            写过什么、什么时候写的，
            <br />
            都会一起留在这里。
          </p>
        </div>
        <article className="self-end border-t border-border-strong py-10">
          <p className="mb-3 text-xs tracking-[0.08em] text-muted">设计 · 2026.09.11</p>
          <h3 className="mb-4 font-serif text-2xl font-semibold leading-[1.45] text-title">原研哉式 Web UI 设计规范</h3>
          <p className="mb-7 max-w-120 text-sm leading-[1.8] text-muted">一份面向 Web 产品界面的完整规范，覆盖视觉、组件、内容、交互、无障碍与评审门禁。</p>
          <a className={textLinkClass} href="notes/design/">
            阅读全文{' '}
            {arrowRightIcon}
          </a>
        </article>
      </section>

      <section id="contact" className="mx-auto max-w-7xl border-t border-border px-10 pt-40 pb-32 max-[700px]:px-5 max-[700px]:pt-24 max-[700px]:pb-20" aria-labelledby="contact-title">
        <p className={sectionIndexClass}>联系 / GitHub</p>
        <h2 id="contact-title" className={`${sectionTitleClass} mb-8 max-w-175`}>
          有想法，
          <br />
          <em>来聊聊。</em>
        </h2>
        <p className="max-w-107.5 text-base text-muted">现在可以在 GitHub 找到我。代码和项目进展也会陆续放在那里。</p>
        <a className={`${buttonClass} mt-6 bg-primary text-on-primary hover:bg-primary-hover`} href={githubUrl} target="_blank" rel="noopener noreferrer">
          访问 GitHub {externalLinkIcon}
        </a>
      </section>

      <footer className="mx-auto flex max-w-7xl justify-between border-t border-border px-10 pt-6 pb-10 text-xs text-muted max-[700px]:grid max-[700px]:gap-3 max-[700px]:px-5 max-[700px]:pb-8">
        <span>© 2026 Kai Weng</span>
        <span>开发者 · 热忱之心不可泯灭</span>
        <a className="inline-flex items-center gap-1 no-underline transition-colors duration-150 hover:text-title" href={githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub {externalLinkIcon}
        </a>
      </footer>
    </>
  )
}
