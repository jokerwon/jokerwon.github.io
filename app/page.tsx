"use client";
import Image from "next/image";
import kaiAvatar from "@/public/images/kai-avatar.webp";

import { useState } from "react";

const navItems = [
  { label: "关于", href: "#about" },
  { label: "作品", href: "#work" },
  { label: "经历", href: "#experience" },
  { label: "文章", href: "#notes" },
  { label: "联系", href: "#contact" },
];

const filters = ["全部", "作品", "文章"];
const githubUrl = "https://github.com/jokerwon";

const principles = [
  { number: "01", title: "先弄明白，再动手", description: "碰到复杂问题，我会先把目标和边界问清楚，再拆成下一步。" },
  { number: "02", title: "做能用的东西", description: "想法落到产品里，才有机会被验证。比起漂亮概念，我更在意它能不能解决问题。" },
  { number: "03", title: "保持好奇", description: "技术会变，答案也会变。多试一次、多问一句，通常比急着下结论更有用。" },
];

export default function Home() {
  const [dark, setDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState("全部");

  return (
    <main className={dark ? "site dark" : "site"}>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Kai Weng 首页">K<span>.</span></a>
        <nav aria-label="主导航">
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <button className="theme-toggle" type="button" onClick={() => setDark(!dark)} aria-label={dark ? "切换浅色模式" : "切换暗色模式"}>
          <span aria-hidden="true">{dark ? "○" : "◐"}</span> {dark ? "浅色" : "暗色"}
        </button>
      </header>

      <div id="top" className="hero-wrap">
        <section id="main-content" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" aria-hidden="true" />开发者 · Kai Weng</p>
            <h1 id="hero-title">你好，我是<br /><em>Kai Weng</em>。</h1>
            <p className="hero-lede">这里是我的个人网站，放项目、经历和偶尔写下来的思考。</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">看看我在做什么 <span aria-hidden="true">↘</span></a>
              <a className="text-link" href="#about">先了解我 <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <figure className="hero-portrait">
            <Image
              className="portrait-image"
              src={kaiAvatar}
              alt="Kai Weng 的卡通人物形象"
              priority
              sizes="(max-width: 700px) 220px, 320px"
            />
            <figcaption>PERSONAL<br />ARCHIVE / 2026</figcaption>
          </figure>
        </section>
        <div className="hero-foot"><span>向下阅读</span><span className="line" /><span>01 — 05</span></div>
      </div>

      <section id="about" className="section about-section" aria-labelledby="about-title">
        <div className="section-heading"><p className="section-index">01 / 关于</p><h2 id="about-title">我是谁，<br /><em>从这里说起。</em></h2></div>
        <div className="about-body"><p className="large-copy">我是一名开发者，喜欢从一个模糊的念头出发，把它一点点做成真正能用的产品。这个网站是我的公开入口。你可以在这里了解我做过什么、最近在关注什么。</p><p className="small-copy">「热忱之心不可泯灭」是我一直记着的一句话。网站才刚起步，有些地方还空着。作品、经历和文章整理好后，我会陆续放上来。没准备好的内容，不急着凑数。</p></div>
      </section>

      <section id="work" className="section work-section" aria-labelledby="work-title">
        <div className="section-heading split-heading"><div><p className="section-index">02 / 作品</p><h2 id="work-title">做过什么，<br /><em>放在这里。</em></h2></div><div className="filters" role="group" aria-label="内容筛选">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "filter active" : "filter"} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>)}</div></div>
        <div className="empty-state"><div className="empty-number">0<span>件</span></div><div><p className="empty-kicker">{activeFilter === "全部" ? "还没有公开内容" : `还没有公开${activeFilter}`}</p><h3>作品还在整理。</h3><p>等资料准备好，我会把项目背景、做法和结果一起放上来。现在可以先了解我，或者直接来聊聊。</p><a className="text-link" href="#about">阅读关于我 <span aria-hidden="true">→</span></a></div></div>
      </section>

      <section id="experience" className="section experience-section" aria-labelledby="experience-title">
        <div className="section-heading"><p className="section-index">03 / 经历</p><h2 id="experience-title">一路做过的事，<br /><em>慢慢补上。</em></h2></div>
        <div className="timeline-empty"><span className="timeline-marker" aria-hidden="true" /><div><h3>履历还在整理</h3><p>与其先摆上一串空泛的关键词，我更愿意等资料齐了再更新。想先看看代码，可以去 GitHub。</p><a className="button button-secondary" href={githubUrl} target="_blank" rel="noopener noreferrer">查看 GitHub <span aria-hidden="true">↗</span></a></div></div>
      </section>

      <section className="section principles-section" aria-labelledby="principles-title"><div className="section-heading"><p className="section-index">04 / 方法</p><h2 id="principles-title">我做事的<br /><em>三个习惯。</em></h2></div><div className="principles">{principles.map(({ number, title, description }) => <article className="principle" key={number}><p className="principle-number">{number}</p><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section id="notes" className="section notes-section" aria-labelledby="notes-title"><div className="section-heading split-heading"><div><p className="section-index">05 / 文章</p><h2 id="notes-title">写下来，<br /><em>留着以后再看。</em></h2></div><p className="aside-note">写过什么、什么时候写的，<br />都会一起留在这里。</p></div><div className="notes-empty"><span aria-hidden="true">—</span><p>这里还空着。<br />想清楚了再写，不赶更新。</p></div></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><p className="section-index">联系 / GitHub</p><h2 id="contact-title">有想法，<br /><em>来聊聊。</em></h2><p>现在可以在 GitHub 找到我。代码和项目进展也会陆续放在那里。</p><a className="button button-primary" href={githubUrl} target="_blank" rel="noopener noreferrer">访问 GitHub <span aria-hidden="true">↗</span></a></section>

      <footer className="site-footer"><span>© 2026 Kai Weng</span><span>开发者 · 热忱之心不可泯灭</span><a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a></footer>
    </main>
  );
}
