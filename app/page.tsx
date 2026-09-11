"use client";

import { useState } from "react";

const navItems = [
  { label: "关于", href: "#about" },
  { label: "作品", href: "#work" },
  { label: "经历", href: "#experience" },
  { label: "文章", href: "#notes" },
  { label: "联系", href: "#contact" },
];

const principles = [
  ["01", "先理解，再行动", "把复杂问题拆成可以被看见、被讨论、被完成的下一步。"],
  ["02", "让内容留下来", "不追逐短暂的注意力，为值得回看的内容建立清晰结构。"],
  ["03", "保持开放", "好的作品不是答案的终点，而是下一次思考能够继续发生的容器。"],
];

export default function Home() {
  const [dark, setDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState("全部");
  const filters = ["全部", "作品", "文章"];

  return (
    <main className={dark ? "site dark" : "site"}>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Jokerwon 首页">J<span>.</span></a>
        <nav aria-label="主导航">
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <button className="theme-toggle" type="button" onClick={() => setDark(!dark)} aria-label={dark ? "切换浅色模式" : "切换暗色模式"}>
          <span aria-hidden="true">{dark ? "○" : "◐"}</span> {dark ? "浅色" : "暗色"}
        </button>
      </header>

      <div id="top" className="hero-wrap">
        <section id="main-content" className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" aria-hidden="true" />前端工程师 · Kai Weng</p>
            <h1 id="hero-title">你好，我是<br /><em>Kai Weng</em>。</h1>
            <p className="hero-lede">热忱之心不可泯灭。这里是我的个人空间，记录我做过的作品、走过的经历，以及那些值得慢慢想清楚的事情。</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">看看我在做什么 <span aria-hidden="true">↘</span></a>
              <a className="text-link" href="#about">先了解我 <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="hero-mark" aria-label="个人标记：Jokerwon" role="img">
            <div className="mark-ring ring-one" /><div className="mark-ring ring-two" /><div className="mark-core">J<span>.</span></div>
            <p>PERSONAL<br />ARCHIVE / 2026</p>
          </div>
        </section>
        <div className="hero-foot"><span>向下阅读</span><span className="line" /><span>01 — 05</span></div>
      </div>

      <section id="about" className="section about-section" aria-labelledby="about-title">
        <div className="section-heading"><p className="section-index">01 / 关于</p><h2 id="about-title">留一点空间，<br /><em>让事情发生。</em></h2></div>
        <div className="about-body"><p className="large-copy">我是一名专注于把想法做成可用界面的前端工程师。个人网站不必急着证明什么，它首先应该是一处可靠的入口：让你知道我是谁、我正在关注什么，以及我们是否有值得一起完成的事。</p><p className="small-copy">我的座右铭是「热忱之心不可泯灭」。目前这里是我的公开档案起点。随着真实的项目、工作与文字准备好，它们会依次来到这里；没有内容，不代表没有方向，只是还没有把未经整理的东西交出来。</p></div>
      </section>

      <section id="work" className="section work-section" aria-labelledby="work-title">
        <div className="section-heading split-heading"><div><p className="section-index">02 / 作品</p><h2 id="work-title">正在形成的<br /><em>工作台。</em></h2></div><div className="filters" role="group" aria-label="内容筛选">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "filter active" : "filter"} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>)}</div></div>
        <div className="empty-state"><div className="empty-number">0<span>件</span></div><div><p className="empty-kicker">{activeFilter === "全部" ? "公开作品尚未归档" : `公开${activeFilter}尚未归档`}</p><h3>这里会放下具体的工作。</h3><p>当前没有可以诚实展示的公开内容。你可以先从关于我开始，或直接联系我，了解正在进行中的事情。</p><a className="text-link" href="#about">阅读关于我 <span aria-hidden="true">→</span></a></div></div>
      </section>

      <section id="experience" className="section experience-section" aria-labelledby="experience-title">
        <div className="section-heading"><p className="section-index">03 / 经历</p><h2 id="experience-title">走过的路，<br /><em>仍在路上。</em></h2></div>
        <div className="timeline-empty"><span className="timeline-marker" aria-hidden="true" /><div><h3>经历资料待补充</h3><p>目前已确认身份：前端工程师。工作经历、技能与合作方式将在整理完成后公开；这里不会用一组漂亮但无从验证的关键词代替真实信息。</p><a className="button button-secondary" href="https://github.com/jokerwon" target="_blank" rel="noreferrer">查看 GitHub <span aria-hidden="true">↗</span></a></div></div>
      </section>

      <section className="section principles-section" aria-labelledby="principles-title"><div className="section-heading"><p className="section-index">04 / 方法</p><h2 id="principles-title">我如何<br /><em>靠近问题。</em></h2></div><div className="principles">{principles.map(([number, title, description]) => <article className="principle" key={number}><p className="principle-number">{number}</p><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section id="notes" className="section notes-section" aria-labelledby="notes-title"><div className="section-heading split-heading"><div><p className="section-index">05 / 文章</p><h2 id="notes-title">一些还没写完的<br /><em>想法。</em></h2></div><p className="aside-note">文章会在这里保持<br />作者、日期与上下文。</p></div><div className="notes-empty"><span aria-hidden="true">—</span><p>暂时没有公开文章。<br />先把想法想清楚，再把它写下来。</p></div></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="section-index">联系 / GitHub</p><h2 id="contact-title">如果你想聊聊，<br /><em>欢迎找到我。</em></h2><p>目前最直接的公开入口是 GitHub。项目、代码与后续更新会在那里逐步留下记录。</p><a className="button button-primary" href="https://github.com/jokerwon" target="_blank" rel="noreferrer">访问 GitHub <span aria-hidden="true">↗</span></a></section>

      <footer className="site-footer"><span>© 2026 Kai Weng</span><span>前端工程师 · 热忱之心不可泯灭</span><a href="https://github.com/jokerwon" target="_blank" rel="noreferrer">GitHub ↗</a></footer>
    </main>
  );
}
