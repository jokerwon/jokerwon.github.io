---
title: 'Agency Agents：独立开发者如何零成本雇一支 AI 专家团队'
description: '介绍 Agency Agents 的核心能力、真实使用案例、安装方式与独立开发者实践建议。'
category: 'AI 工具'
date: '2026.09.11'
---

## 1. 一个人，干一个团队的活

做独立开发这几年，我的日常是这样的：上午写代码，下午改产品，晚上写推文做增长，睡前还要回用户反馈。代码是我写，增长是我做，客服也是我当。

这不是我一个人的困境，几乎是所有 indie hacker 的标配。我们最大的瓶颈不是技术，是**分身乏术**：

- 想雇个增长黑客？算算工资，产品收入还不够付他一个月薪水。
- 想用 AI 顶上？"act as a senior developer" 这类通用提示词，输出质量全靠运气。
- 自己写 prompt？每个工具格式不一样，Claude Code、Cursor、Codex 各装一套，维护起来又是一摊事。

说白了，**独立开发者需要的不是一个更聪明的聊天机器人，而是一个结构化的专业角色体系**——有人管增长、有人管代码审查、有人管品牌调性，而且这些"人"能在你手头的工具里直接干活。

最近我发现了一个叫 **Agency Agents** 的开源项目，它把这件事做成了产品。

## 2. Agency Agents 是什么：AI agent 的安装器

一句话：**Agency Agents 是一个本地优先、跨工具的 AI agent persona 安装器。**

先说清它不做什么：不做云端 agent 市场，不做 agent 运行时。Agent.ai、UpAgents 那些走的是"云端雇佣 agent、按任务付费"的路子。Agency Agents 完全是另一条路——它把 230+ 个精心打磨的 AI 专家角色写成 Markdown 源文件，开源放在 GitHub 上，catalog 仓库已经攒了 145k+ stars。再配一个 Tauri 2 + Svelte 5 的原生桌面 App 当管理面板，点几下，这些角色就装进了你自己的 AI 工具。

每个 agent 不是三行提示词，而是一份完整的角色规范：身份、性格、使命、工作流程、交付物、成功标准。比如 Frontend Developer 知道怎么评审组件结构，Growth Hacker 知道怎么规划主题序列，Reality Checker 则是个"默认怀疑一切结论、必须见证据"的质量门角色。

它的气质就两点：

- **MIT 协议，完全免费**。没有付费层，靠 GitHub Sponsors 自愿赞助。
- **无账户、无遥测、本地优先**。安装台账、目录、状态全在你自己的机器上。

对独立开发者来说，这两个词翻译过来就是：**零成本，零顾虑。**

## 3. 为什么独立开发者要关注它

### 痛点一：雇不起专业团队

增长、安全、UX、文案，这些职能在创业公司里都有专人专岗，独立开发者只能自己硬扛或者将就通用 AI。Agency Agents 的解法是把"雇专家"变成"装专家"：`growth-hacker`、`security-architect`、`content-creator` 这些角色开箱即用，每个都带明确的工作边界和成功标准，输出不再是泛泛的建议。

### 痛点二：工具切换，配置碎片化

我手上同时有 Claude Code、Cursor、Gemini CLI。同一个 persona，Claude 要 `~/.claude/agents/*.md`，Cursor 要 `.cursor/rules/*.mdc`，Codex 要 TOML。手动维护三份副本，改一处忘两处是常态。Agency Agents 的解法是**一次定义，多工具分发**：同一个源 persona 确定性渲染成各工具的格式，装到哪儿、装的哪个版本、改没改过，本地台账记得清清楚楚。

### 痛点三：AI 配置悄悄"漂移"

agent 文件装进去之后，你大概率会手改几行。时间一长，本地文件跟上游版本差了多少、哪些改动该保留、哪些该随上游更新，完全是一笔糊涂账。Agency Agents 有个"对账"（Reconciliation）功能：重新渲染规范源、逐字节比对，把每个文件标记为当前、过期、已修改或已删除。漂移问题第一次有了一个专门的工具来管。

## 4. 核心能力拆解

### 4.1 四个支柱：Agents / Tools / Teams / Projects

App 的界面围绕四个面板组织：

- **Agents**：三栏目录，按部门筛选、预览源文件、逐工具部署。16 个部门覆盖工程、营销、销售、设计、测试、支持……
- **Tools**：自动检测你机器上装了哪些 AI 工具和版本，支持项目级安装与批量操作。
- **Teams**：把常用的一组 agent 存成团队阵容，通过 Agentfile 导出/导入——等于把你的"虚拟公司编制"变成一个可分享的文件。
- **Projects**：把安装限定到具体仓库，用"目标 × 工具"网格精确配置哪个项目装哪些角色。

### 4.2 Runbooks：一键部署一个"创业团队"

v0.3.0 上线的 Runbooks 是我最喜欢的功能。它把 NEXUS 编排框架里的场景剧本变成了一键部署的团队阵容，内置了 Startup MVP、Enterprise Feature、Incident Response、Marketing Campaign 等剧本。

选个"Startup MVP"剧本，点一下，你的工具里就多了一支为做 MVP 量身定制的虚拟团队。我第一次跑这个剧本时，看着工具里凭空多出一排角色，真有点招了人的感觉。对独立开发者来说，这几乎是把"组队"这个动作的成本降到了零。

### 4.3 NEXUS：多 agent 协作的流水线

Catalog 仓库还附带一套叫 NEXUS 的 7 阶段编排框架：

```
Discover → Strategize → Scaffold → Build → Harden → Launch → Operate
```

阶段之间设质量门，强调证据驱动的评估。官方数据说缺乏结构化协调时，多 agent 项目在交接边界失败的概率可达 73%——这个数字不一定精确，但方向我认同：多个 AI 角色各干各的，最后合不到一起，是很多人用多 agent 翻车的真实原因。NEXUS 至少给出了一个有纪律的组织方式。

## 5. 真实案例：别的独立开发者怎么用的

光看功能没感觉，我翻了社区里的真实用法，挑三个对独立开发者最有参考价值的。

### 案例一：把 Twitter 增长交给 agent 做 30 天实验

Reddit 用户 Bright_Sentence3277 做了款帮人职业转型的产品 Proppel。典型的独立开发者处境：代码要写，增长没人做。他做了一个 30 天实验，把 Twitter 增长交给 `growth-hacker`、`content-creator`、`social-media-strategist` 这批角色。

他的几个经验值得抄：

- **先喂品牌上下文**：产品定位、目标用户、品牌调性一次性给足，之后生成推文只说"基于已有上下文"。
- **把 agent 当增长负责人用**：不是让它写单条推文，而是让它规划主题序列、推荐发布时间、设计互动策略。
- **人工最终审核**：生成归生成，发布前必须人眼过一遍。
- **设定实验周期**：30 天后对比粉丝增长、互动率、转化，再决定要不要长期投入。

### 案例二：给散装技能加一个"指令外壳"

另一个用户 Appleaaaaa 发现的问题更普遍：装了一堆 AI 技能之后，模型自己决定何时调用、按什么顺序调用，结果"开头含糊、执行不可控"。他的解法是把营销类 agent 按漏斗分组——PMM 定位 → Demand Gen 获客 → Ops Tracking 追踪——再加一个轻量 orchestrator 做路由，显式设置"本阶段完成，等待批准再继续"的停止点。

这给独立开发者的启发是：**agent 多了不是自动变强，需要治理。** 编排器只管"该调用谁、什么顺序、何时停"，具体业务逻辑留在各 agent 文件里。

### 案例三：用 NEXUS-Sprint 组一个 MVP 团队

官方示例 Nexus Spatial 展示了完整的玩法。一个横跨 AI 编排、空间计算、企业服务的产品，同时启用 8 个专家 agent，各推各的章节。旁边站着个 Reality Checker 当证据关卡：任何"完成"结论都得附可验证的证据，防止 agent 自我感觉良好地给自己打"通过"。

对独立开发者，记住按规模选模式就够了：

- **NEXUS-Micro**（5–10 个 agent）：修个缺陷、跑个内容活动；
- **NEXUS-Sprint**（15–25 个 agent，2–6 周）：做 MVP 和功能开发，官方推荐的默认档；
- **NEXUS-Full**（全量 agent）：企业级产品全生命周期，个人开发者基本用不上。

## 6. 上手指南：十分钟装好你的第一个专家

macOS 上用 Homebrew 最省事：

```bash
brew tap msitarzewski/agency-agents
brew install --cask agency-agents
```

也可以从官网下载 `.dmg`（已签名公证）、Linux 的 `.deb/.AppImage` 或 Windows 安装包。不想装 App 的话，命令行也完全可以：

```bash
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents

# 按部门安装（推荐，按需取用）
./scripts/install.sh --tool claude-code --division engineering,marketing

# 装单个 agent
./scripts/install.sh --tool cursor --agent frontend-developer,code-reviewer

# 非 Claude 工具需要先转换格式
./scripts/convert.sh --tool codex
./scripts/install.sh --tool codex
```

几条来自社区实践的使用建议：

1. **别一次性全装**。230+ agent 全塞进去，轻则选择疲劳，重则触发工具的静默上限（opencode 会直接截断）。按部门、按需求装。
2. **指派角色要具体**。不要说"帮我写代码"，要说"用 Backend Architect 设计 API，用 Security Architect 做威胁建模"。
3. **自定义 agent 不必很长**。明确的使命 + 几条 Critical Rules + 成功标准，就足以显著改变模型行为。
4. **保持人工在环**。推文要审核、上线要验证，agent 的输出永远经过人确认。

## 7. 注意事项与局限

工具都有短板，用之前这些坑要知道：

1. **选择成本真实存在**。230+ agent 里大部分你用不上，全装只会添乱。按需安装是前提。
2. **非 Claude 工具多一步转换**。修改 agent 后要重新跑 `convert.sh` 才能同步到 Cursor、Codex 等格式，多工具党会有维护负担。
3. **部分工具还不是一等公民**。Aider、Windsurf、Kimi 等目前只是"识别到了"，真正安装需要等适配。
4. **Windows 安装包未签名**。首次启动会触发 SmartScreen 警告，手动放行即可，但介意的话要知道这一点。
5. **项目很新，迭代很快**。App 仓库 2026 年 6 月才建，v0.3.0 刚发布一个多月，功能和接口随时可能变。
6. **目录内容是英文的**。中文团队需要自己消化或本地化。

## 8. 总结与判断

独立开发者这个群体，本质上是在用一个人的时间换一个团队的产出。过去我们靠自动化工具省时间，现在 AI 给了一个新的杠杆：**把专业能力本身变成可安装的资产。**

Agency Agents 抓准的正是这个趋势。我的判断：

- 它是目前**独立开发者获取"结构化 AI 角色"成本最低的方式**——免费、开源、本地、跨工具，没有任何一个云端 agent 市场能给出这个组合。
- 那 230 个 agent 只是表面。真正的价值是"persona 作为可安装、可追踪、可更新的资产"这套范式。agent 文件可以进 Git、可以分享、可以对账，这和散落的提示词是两个物种。
- 风险在于项目早期：App 还新、社区讨论不活跃、中文生态几乎空白。但好在一切都开源在本地，最坏情况也不过是一堆随时能手动用的 Markdown 文件。

如果你也是一个人扛着产品、代码和增长，我建议至少试一下：Homebrew 装上 App，挑 engineering 和 marketing 两个部门装几个角色，把手头最烦的一件杂活丢给对应专家。感受一下"有人分担"是什么体验——然后你大概率就回不去了。

---

*参考来源：[Agency Agents 官网](https://agencyagents.app/) · [agency-agents catalog 仓库](https://github.com/msitarzewski/agency-agents) · [Agency Agents App 仓库](https://github.com/msitarzewski/agency-agents-app)*
