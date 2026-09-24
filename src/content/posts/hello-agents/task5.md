---
title: 'Task05 智能体通信协议'
description: 'Hello Agents 进阶训练营 Task 05。智能体通信协议。'
category: 'Agent 学习'
date: '2026.09.24'
---

> [hello-agents 第十章 智能体通信协议](https://hello-agents.datawhale.cc/#/./chapter10/%E7%AC%AC%E5%8D%81%E7%AB%A0%20%E6%99%BA%E8%83%BD%E4%BD%93%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE)

本章讲三种通信协议如何分工：**MCP**（智能体↔工具，Anthropic）、**A2A**（智能体↔智能体，Google）、**ANP**（大规模智能体网络，社区），并在 HelloAgents 中统一封装为 `MCPTool` / `A2ATool` / `ANPTool`（都继承 `BaseTool`），智能体像用普通工具一样用协议。

本目录做了两件事。

- [`main.py`](https://github.com/jokerwon/hello-agents/blob/main/task5/main.py)：把章节 10.1–10.5 的核心示例在本机 `hello-agents 0.2.9` 上真实跑一遍（MCP 内存传输、MCP stdio 自定义服务器、工具自动展开、A2A 双服务协作、ANP 发现/负载均衡），**不依赖 LLM、不依赖外网**，可重复执行；
- 本 README：章节学习记录、实测与章节的差异清单、心得与习题思路。

MCP 是三协议中唯一生态成熟、开箱即用的（内置演示服务器 `add(10,20)=30.0` 一次跑通）；A2A 在 HelloAgents 里是**披着 a2a-sdk 外衣的 Flask REST 模拟**，且 extras 依赖没锁上界，装上 a2a-sdk 1.x 会静默退化成"未安装"；ANP 是纯内存概念实现，进程一退数据全无。章节自己说得对：协议处于早期，**应用为主，别造轮子，锁好版本**。

## 1. 运行

### 1.1 环境

| 项目         | 实测值                             | 备注                                                        |
| ------------ | ---------------------------------- | ----------------------------------------------------------- |
| Python       | 3.14.0（`uv run`）                 |                                                             |
| hello-agents | **0.2.9**（章节基于 `0.2.2` 写作） |                                                             |
| fastmcp      | 2.14.7                             | extras 约束 `>=2.0,<3.0`                                    |
| mcp          | 1.30.0                             | fastmcp 底层依赖                                            |
| a2a-sdk      | **0.3.26**                         | extras 写 `>=0.1.0` 无上界，必须手动 pin `<1.0`，见 §3.2    |
| flask        | 3.1.3                              | `A2AServer.run()` 运行时必需，但**不在 extras 里**，见 §3.4 |

### 1.2 安装

```sh
uv add "hello-agents[protocols]==0.2.9"   # 拉入 fastmcp + a2a-sdk
uv add "a2a-sdk>=0.2,<1.0"                # 1.x 移除了 a2a.client.A2AClient，必须锁住
uv add flask                              # A2AServer 起 HTTP 服务用
```

### 1.3 命令

```sh
uv run python task5/main.py        # 五段演示全部跑一遍
uv run python task5/main.py --serve  # (内部用) 以 stdio 子进程方式启动自定义 MCP 服务器
```

`main.py` 单文件自带 MCP 服务器：主流程用 `[sys.executable, __file__, "--serve"]` 把自己作为 stdio 子进程拉起，省掉第二个文件。

### 1.4 实测输出（节选）

**§1 MCP Memory 传输**（内置演示服务器，章节 10.1.4 快速体验）：

```text
list_tools: 找到 6 个工具:
- add: 加法计算器
- subtract: 减法计算器
- multiply: 乘法计算器
- divide: 除法计算器
- greet: 友好问候
- get_system_info: 获取系统信息

add(10, 20) = 工具 'add' 执行结果:
30.0
```

与章节预期一致（6 个工具、30.0）。

**§2 MCP Stdio 传输**（`MCPClient` 直连自定义天气服务器，章节 10.2.2/10.5.1）：

```text
发现工具: ['get_weather', 'list_supported_cities']
get_weather(深圳) = {"city": "深圳", "temperature": 29.5, "humidity": 78, "condition": "阵雨"}
list_supported_cities() = {"cities": ["北京", "深圳"], "count": 2}
```

**§3 MCPTool 自动展开**（章节 10.2.4(1)：name 前缀防冲突）：

```text
展开为 2 个工具: ['weather_get_weather', 'weather_list_supported_cities']
{
  "type": "function",
  "function": {
    "name": "weather_get_weather",
    "description": "获取指定城市的当前天气",
    "parameters": {"type": "object", "properties": {"city": {"type": "string", "description": ""}}, "required": ["city"]}
  }
}
```

展开后就是标准 OpenAI function schema，MCP 工具最终仍以 Function Calling 形式喂给 LLM（印证 §10.2.1"两者互补而非竞争"）。

**§4 A2A 双服务协作**（researcher:5050 → writer:5051，章节 10.3.3）：

```text
A2A_AVAILABLE: True (需要 a2a-sdk<1.0；1.x 移除了 a2a.client.A2AClient)
researcher /info: {'capabilities': {}, 'description': '研究员', 'name': 'researcher', 'protocol': 'A2A', 'skills': ['research'], 'version': '1.0.0'}
步骤1 研究: {'topic': 'AI在医疗领域的应用', 'findings': 'AI在医疗领域的应用的研究结果'}
步骤2 成文:
# AI在医疗领域的应用

基于研究：AI在医疗领域的应用的研究结果

文章内容...
```

**§5 ANP 发现/负载均衡/网络**（章节 10.4.2/10.4.3）：

```text
按类型发现 2 个 nlp 服务
负载均衡选最低负载: nlp_agent_1 (load=0.3)
网络统计: {'network_id': 'ai_cluster', 'total_nodes': 3, 'active_nodes': 3, 'total_connections': 1, 'nodes': ['nlp_agent_1', 'nlp_agent_2', 'gpu_node_0']}
```

## 2. 学习笔记

### 2.1 为什么需要通信协议（10.1）

单体智能体（第七章 ReAct）有三个根本限制。

1. **工具集成困境**：每接一个新服务（GitHub/数据库/天气）都要手写一个 Tool 类，HTTP、认证、错误处理重复造，API 一变全改；
2. **能力扩展瓶颈**：能力被锁死在预定义工具集里，无法运行时发现新服务；
3. **协作缺失**：多智能体（研究员+撰写员+编辑）只能手动编排。

协议的价值 = 标准化接口 + 互操作 + 动态发现 + 可扩展，类比 TCP/IP 之于互联网。

### 2.2 三种协议一张表（10.1.2）

|          | MCP                                                           | A2A                                                  | ANP                                                  |
| -------- | ------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| 提出方   | Anthropic                                                     | Google                                               | 开源社区（尚不成熟）                                 |
| 解决什么 | 智能体↔工具/资源                                              | 智能体↔智能体点对点                                  | 大规模网络中发现与连接                               |
| 设计哲学 | 上下文共享                                                    | 对等通信                                             | 去中心化服务发现                                     |
| 拓扑     | Host-Client-Server 三层                                       | 网状 P2P（对抗星型协调器的单点故障/瓶颈/扩展难）     | 开放网络                                             |
| 核心抽象 | Tools（主动执行）/ Resources（被动数据）/ Prompts（指导模板） | Task（生命周期：创建→协商→执行→完成/失败）+ Artifact | DID 身份 + `.well-known/agent-descriptions` 端点索引 |
| 选型     | 要访问外部服务选它                                            | 少数智能体紧密协作选它                               | 构建生态级网络才考虑                                 |

### 2.3 MCP 工作机制（10.2）

- **三层架构**：Host（用户界面，如 Claude Desktop）→ Client（协议通信）→ Server（功能实现），关注点分离，开发者只写 Server。
- **工具选择五步**：`list_tools()` 发现 → 工具描述注入系统提示词 → LLM 推理决定调不调、调哪个 → Server 执行 → 结果回填生成回答。**全自动，工具描述质量决定调用质量**。
- **vs Function Calling**：FC 是模型内在能力（"会打电话"），MCP 是连接标准（"电话网"），互补不竞争。FC 每家 LLM 格式不同（OpenAI `parameters` vs Claude `input_schema`），MCP 一份服务器全模型通用。
- **五种传输**：Memory（测试）、Stdio（本地开发，最常用）、HTTP / SSE / StreamableHTTP（生产远程，`MCPTool` 只支持前两种，远程要直接用 `MCPClient(transport_type=...)`）。
- **自动展开**：`MCPTool(name="fs")` 加入 Agent 时把服务器所有工具展开成 `fs_read_file` 等独立工具，name 作前缀防冲突；调用时参数自动做字符串→数字等类型转换。
- **生态**：优先用官方（modelcontextprotocol/servers）和大厂背书的社区服务器（awesome-mcp-servers / mcpservers.org）；发布走 Smithery（`smithery.yaml` + Dockerfile，标准端口 8081）。

### 2.4 A2A（10.3）与 ANP（10.4）

- A2A 用 P2P 网状替代中央协调器；请求生命周期四步：代理发现（AgentCard）→ 身份验证 → 发消息 → 流式消息。HelloAgents 里落地为 `A2AServer`（`@server.skill()` 注册技能 + `run(host, port)` 起服务）和 `A2AClient`（`execute_skill` / `ask`），多智能体协作 = 多个 Server 各占端口 + Client 串联（研究员→撰写员→编辑）。
- ANP 三个目标：服务发现（按语义/功能找到能干活的智能体）、智能路由（多个候选按负载/成本挑最优）、动态扩展（新节点即插即用）。信任根基是 DID：私钥签名请求 → 对方解析 DID 拿公钥验签。HelloAgents 的落地是 `ANPDiscovery`（注册/按类型发现）、`ANPNetwork`（节点+连边+统计），纯概念模拟。

### 2.5 自定义 MCP 服务器（10.5）

写自己的 Server 的四个动机：封装业务逻辑、代理私有数据、性能优化、功能定制。开发范式极简：`MCPServer(name)` → 写普通 Python 函数（docstring 即工具描述）→ `add_tool(fn)` → `run()`。`main.py` 里的天气服务器（mock 版）就是这么 30 行写完的。发布到 Smithery 需要 `pyproject.toml` + `smithery.yaml` + Dockerfile 三件套。

## 3. 实测与章节的差异

按踩坑严重程度排序。

### 3.1 extra 名不对

章节：`pip install "hello-agents[protocol]==0.2.2"`。0.2.9 实际叫 **`protocols`**（`Provides-Extra: search, memory, rag, protocols, evaluation, rl, memory-rag, all`）。装错名字 pip 只会警告不报错，运行到 `MCPTool()` 才炸 `ImportError: 创建内置 MCP 服务器需要 fastmcp 库`。

### 3.2 a2a-sdk 版本漂移（最阴的坑）

extras 声明 `a2a-sdk>=0.1.0` **无上界**。2026-09 实测 uv 解析到 1.1.5，而 hello-agents 0.2.9 的探测代码是：

```python
try:
    from a2a.client import A2AClient   # a2a-sdk 1.x 已移除，改叫 Client/ClientFactory
    A2A_AVAILABLE = True
except ImportError:
    A2A_AVAILABLE = False
```

结果 `A2A_AVAILABLE=False`，所有 A2A 功能退化成"请安装 a2a-sdk"的友好报错，**明明装了却说没装**。必须手动 pin `a2a-sdk>=0.2,<1.0`（0.3.26 实测可用）。这是早期协议生态的常态：上游 breaking change + 下游不锁版本 = 静默失效。

### 3.3 A2A 实现与官方协议无关

模块 docstring 写"基于官方 a2a-sdk 库实现"，实际读源码（`protocols/a2a/implementation.py`）：

- `A2AServer.run()` 是**纯 Flask REST**：`GET /info`、`GET /skills`、`POST /execute/<skill>`、`POST /ask`、`GET /health`；
- `A2AClient` 是 requests 对上述端点的 HTTP 封装；
- 官方 sdk 的 `A2AClient` 只在模块顶部被 import 当**可用性探针**，通信链路完全没用到。

也就是说它不是官方 A2A（JSON-RPC、AgentCard、Task 生命周期、流式消息统统没有），**与真正的 a2a-sdk 生态不互通**。章节其实自己承认了："现有实现大部分为 Sample Code……只采用模拟协议思想的方式"。学思想可以，生产对接官方协议要直接用 a2a-sdk 或 AgentConnect。

### 3.4 Flask 是隐藏依赖

`A2AServer.run()` 需要 Flask，但 `protocols` extra 不声明它，运行时才抛 `ImportError: A2A server requires Flask`。需要 `uv add flask`。

### 3.5 MCPTool 每次调用都重连

实测日志里每次 `run()` 都是完整的 `🔗 连接 → 调用 → 🔌 断开` 循环，stdio 模式下意味着**每次工具调用都 spawn 一个子进程**（自定义服务器场景实测每次拉起 `main.py --serve`，FastMCP banner 都重新打一遍）。低频调用无所谓，高频/生产场景应复用 `MCPClient` 长连接（`async with` 包住多次 `call_tool`）。另外内置服务器连接时会打出 `docket.worker` 的 INFO 日志噪音，与演示无关。

### 3.6 小项

- 自动展开后的参数 schema 里 `description` 为空字符串（函数签名只有类型注解时，FastMCP 无从生成参数说明），又一次印证"工具描述质量至关重要"，参数级 docstring/Field 描述值得补；
- fastmcp 被 hello-agents 锁在 `<3.0.0`，但运行时 banner 提示"Update available: 4.0.8"，上游版本策略混乱，跟随 pin 即可；
- 章节天气服务器依赖外网 wttr.in，内网环境不可靠，`main.py` 改为 mock 数据（协议链路本身不受影响）；
- 章节 A2A 协作示例用 `eval()` 解析上游智能体的字符串输出（`main.py` 原样保留并加了注释），示例代码自己就踩了习题 5 问的安全坑，生产应传 JSON + `json.loads`；
- ANP 实现是纯内存字典（非官方 [AgentConnect](https://github.com/agent-network-protocol/AgentConnect)），无持久化、无真实 DID/网络，注册的服务进程退出即消失；
- "文档声明 vs 实际实现"还有一处更直接的证据：`tools/builtin/__init__.py` 声称 `A2ATool` "基于 python-a2a v0.5.10"、`ANPTool` "基于 agent-connect v0.3.7"，但整个 hello_agents 包里没有任何 `import python_a2a` / `import agent_connect`，venv 中两个包也均未安装（实测 `PackageNotFoundError`），`protocols` extra 只声明 fastmcp + a2a-sdk；`anp/implementation.py` 自己写着"由于 agent-connect 的 API 比较底层，我们创建一个简化的实现"。与 §3.3 同一套路：docstring 里的"基于 XX 库"只是出处注脚，不是运行时依赖；
- `MCPTool.__init__` 构造时即执行 `_discover_tools()`，且该函数吞掉一切异常、失败时把工具列表置空，stdio 子进程启动失败不会报错，`get_expanded_tools()` 静默返回 `[]`。`main.py` §3 对此加了空列表保护，排查时先区分"启动失败"与"服务器确实没有工具"。

## 4. 心得

1. **三协议的本质是"通信对象"的分层**：工具（MCP）、对等智能体（A2A）、开放网络（ANP）。分层清晰后选型是平凡的：先问"我要连的是工具还是智能体"，再问"规模是一个房间还是一个互联网"。现阶段只有 MCP 一层是"已解决"的，另外两层还在概念验证期，章节反复强调"应用为主、无需造轮子"是诚实的。

2. **HelloAgents 最聪明也最粗暴的一个决定：把协议统一压进 `BaseTool`**。对智能体来说"另一个智能体"和"一个计算器"是同构的，`agent.add_tool(A2ATool(...))` 就能让 LLM 自主决定何时咨询专家，集成成本几乎为零。代价是把 A2A 的 Task 生命周期、协商和流式进度全部压扁成一次同步 `run()`；协议里最有价值的"长任务状态机"在工具抽象里消失了。这是教学框架的合理取舍，也划出了它到生产的距离。

3. **MCP 的核心洞察是"描述即接口"**。工具发现机制把"LLM 何时调用什么"的责任从硬编码转移到了自然语言描述上，写 MCP 工具约等于写一份给 LLM 看的 API 文档，docstring 质量直接决定调用准确率。这和 Function Calling 的经验一致：schema 描述是给模型的第一提示词。实测中参数 description 为空的问题（§3.6）就是反面教材。

4. **早期生态里，锁版本比选协议更重要**。本章最大的实测坑（§3.2）是 `a2a-sdk>=0.1.0` 一个缺失的上界导致整块功能静默失效，且报错信息（"请安装 a2a-sdk"）指向错误方向。接入任何年轻协议生态时，先看依赖声明有没有上界，没有就自己 pin；"装了却报未安装"优先怀疑版本漂移而非环境。

5. **安全是现状**。章节示例代码里就有 `eval()` 解析对端输入，Flask 服务无任何认证绑到 localhost，MCP 客户端还默认信任服务器全部工具。习题 5 问的权限控制/端到端加密/信任评估，恰恰是这些协议目前最薄的部分。ANP 的 DID 验签是唯一把身份认证写进协议设计的一层，方向正确但 HelloAgents 的实现还没碰到它。自己写 Agent 系统时的底线：跨进程/跨网络的数据一律 `json.loads` 不 `eval`，MCP 工具接入前人工过一遍 `list_tools` 白名单，服务端口默认绑 127.0.0.1。

## 5. 习题思路（简述）

**习题 1（客服系统选型）**：访问客户数据库/订单系统 → MCP（现成 database server，标准工具接口）；多个专业客服智能体协作 → A2A（对等通信 + 任务委托）；大规模并发用户 → ANP（服务发现 + 负载路由）。三者可组合：接待员 Agent 经 ANP 发现可用的专家 Agent，经 A2A 委托任务，专家 Agent 各自经 MCP 访问数据库，协议分层刚好对应"找到谁 / 怎么谈 / 怎么干活"。

**习题 2（stdio + JSON-RPC）**：优势是进程隔离（服务器崩溃不拖垮智能体）、零网络攻击面、实现简单（一行命令拉起）。局限是仅限单机、每次调用有进程生命周期开销（实测 §3.5 每次重连）、无原生多客户端共享。远程扩展即章节已给的 `transport_type="sse"/"streamable_http"`，需补认证（OAuth/token）与 TLS。

**习题 3（审稿人扩展）**：加第三个 `A2AServer(reviewer)` 带 `review` 技能，流程 writer 产出 → reviewer 打分+意见 → 低于阈值回 writer 修订（循环上限 N 次）→ 通过则终止。冲突解决可在消息体里加 `proposal/counter_proposal/vote` 字段，多数票或权重票聚合。A2A 与 AutoGen 是协议与框架的关系：框架决定智能体内部怎么想，协议决定智能体之间怎么谈；互通方案是给 AutoGen agent 包一层 A2AServer（技能=对话入口），反向用 A2AClient 包成 AutoGen 的一个 participant。

**习题 4（拓扑演进）**：10 个节点星型足够（协调成本低）；1000 个节点必须分层（按域/能力分簇，簇内星型、簇间网状）+ 分片注册中心，否则发现查询和协调器都会先崩。路由算法：候选集 = 能力匹配过滤，得分 = w1·能力相关度 + w2·(1-负载) + w3·(1/成本) + w4·历史成功率，取最高。容错：`/health` 心跳探活（HelloAgents 的 A2AServer 已自带该端点）→ 连续失败摘除注册 → 同能力备份节点接管 → 任务状态持久化以便重放。

**习题 5（安全）**：MCP 权限控制 = 客户端侧工具白名单 + 危险操作（写/删/exec 类工具）人工确认门 + 服务器进程沙箱（容器/受限用户）。端到端加密 = ANP 白皮书路线：DID 文档发布公钥，X25519 密钥协商 + AEAD 加密，签名保证完整性与身份。信任评估 = 历史行为（成功率/延迟/违约率）+ 对端评价 + 社区声誉加权成动态分数，低分节点降级（限流/只读/拒连）。
