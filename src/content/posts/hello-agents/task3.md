title: 'Task03 记忆与检索'
description: 'Hello Agents 进阶训练营 Task 03。记忆与检索。'
category: 'Agent 学习'
date: '2026.09.20'
---

> [hello-agents 第八章 记忆与检索](https://hello-agents.datawhale.cc/#/./chapter8/%E7%AC%AC%E5%85%AB%E7%AB%A0%20%E8%AE%B0%E5%BF%86%E4%B8%8E%E6%A3%80%E7%B4%A2)

本章为第七章的框架补上两个能力：**记忆系统**（`MemoryTool`）与**检索增强生成**（`RAGTool`）。两者都以工具形式注册进 `ToolRegistry`，不新增 Agent 类。

## 1. 运行

### 1.1 环境

| 项目          | 实测值                                                    |
| ------------- | --------------------------------------------------------- |
| Python        | 3.14.0（`uv run`）                                        |
| hello-agents  | 0.2.9                                                     |
| qdrant-client | 1.19.1                                                    |
| neo4j         | 6.3.1                                                     |
| openai        | 1.109.1                                                   |
| markitdown    | **未安装**（PDF/Office 转换不可用，仅 `.md`/`.txt` 兜底） |

外部服务：Qdrant 云（向量）、Neo4j Aura（知识图谱，仅语义记忆需要）、百炼 DashScope（嵌入）、OpenAI 兼容网关（LLM）。

### 1.2 环境变量

`task3/.env`（已被 `.gitignore` 的 `.env` 规则忽略，含真实密钥，不要提交）：

| 变量                                                                                             | 用途     |
| ------------------------------------------------------------------------------------------------ | -------- |
| `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL_ID`                                                  | LLM      |
| `QDRANT_URL` / `QDRANT_API_KEY` / `QDRANT_COLLECTION` / `QDRANT_VECTOR_SIZE` / `QDRANT_DISTANCE` | 向量库   |
| `NEO4J_URI` / `NEO4J_USERNAME` / `NEO4J_PASSWORD`                                                | 图数据库 |
| `EMBED_MODEL_TYPE` / `EMBED_MODEL_NAME` / `EMBED_API_KEY` / `EMBED_BASE_URL`                     | 嵌入     |

脚本里 `os.environ.setdefault("no_proxy", "iwhalecloud.com")` 是内网 LLM 网关必需的绕行；`load_dotenv()` 会自动找到同目录 `.env`。

### 1.3 命令

```sh
uv run python task3/test_mem.py   # 记忆工具：add / search / summary
uv run python task3/main.py       # 记忆 + RAG 工具接入 SimpleAgent
```

`main.py` 里 `RAGTool(knowledge_base_path="./knowledge_base")` 的路径相对**当前工作目录**解析，所以要在仓库根目录执行；知识库目录需要存在（`mkdir -p knowledge_base`），`add_text`/`add_document` 会把内容落成该目录下的 `.md` 文件。该目录当前为空，git 也不跟踪空目录，克隆后要自己建。

两个脚本的代码取自章节 8.2.2 与 8.1.4 的快速体验。**当前都无法直接跑通**：`MemoryTool` 默认启用 `semantic`，而语义记忆初始化必须连上 Neo4j——本机 `.env` 里的 Aura 实例已不可达，会在构造阶段直接抛 `neo4j.exceptions.ServiceUnavailable: Unable to retrieve routing information`（见 §3.1）。修好 Neo4j（或按 §3.1 的方案 B 跳过语义记忆）后即可运行。

### 1.4 实测输出（已跑通的部分）

`memory_types=["working", "episodic"]` 下的记忆工具：

```text
✅ 记忆已添加 (ID: 4be19682...)
✅ 记忆已添加 (ID: aab60456...)
✅ 记忆已添加 (ID: b18bc8da...)
🔍 找到 1 条相关记忆:
1. [情景记忆] 李四是前端工程师，擅长React和Vue.js开发 (重要性: 0.70)
🔍 找到 2 条相关记忆:
1. [情景记忆] 2026年9月20日，用户张三完成了第一个Python项目 (重要性: 0.80)
2. [工作记忆] 用户刚才问了关于Python函数的问题 (重要性: 0.60)
📊 记忆系统摘要
总记忆数: 3
  • 工作记忆: 1 条 (平均重要性: 0.60)
  • 情景记忆: 2 条 (平均重要性: 0.75)
```

`consolidate` + `forget` 实测：3 条工作记忆（0.9 / 0.3 / 0.75）执行 `working → episodic`、阈值 0.7 后，2 条被提升（重要性变为 0.99 / 0.83），剩下 0.3 那条被 `importance_based, threshold=0.5` 遗忘。

RAG 工具（`add_text` ×2 → `search` → `ask`）：

```text
✅ 文本已添加到知识库: rag_concept
1. 文档: **./knowledge_base/python_intro.md** (相似度: 0.886)
2. 文档: **./knowledge_base/rag_concept.md** (相似度: 0.407)

🤖 **智能问答结果**
根据提供的上下文，RAG（检索增强生成）是一种结合信息检索和文本生成的技术……
📚 **参考来源**
🟢 [1] rag_concept.md (相似度: 0.933)
🔵 [2] python_intro.md (相似度: 0.420)
⚡ 检索: 7578ms | 生成: 1809ms | 平均相似度: 0.677
```

`add_text` 会把文本落成 `knowledge_base/<document_id>.md`，再走 2.5 的完整流水线；`ask` 返回的答案里带引用来源与相似度，这是 RAG 相对裸 LLM 的可解释性收益。

## 2. 本章要点

### 2.1 两个根本局限

| 局限         | 表现                                                     | 对策                                          |
| ------------ | -------------------------------------------------------- | --------------------------------------------- |
| LLM 无状态   | 早期信息被上下文窗口挤掉；无法记住偏好；多轮回答前后矛盾 | 记忆系统（跨会话持久化 + 检索 + 遗忘 + 整合） |
| 内置知识静态 | 训练数据有截止点；领域深度不足；幻觉                     | RAG（生成前先从外部知识库检索并注入 Prompt）  |

注意：第七章的 `SimpleAgent._history` 只是进程内的消息列表，不跨会话、不可检索、不会遗忘——所以它不等于记忆系统。

### 2.2 记忆系统四层架构

```
基础设施层  MemoryManager / MemoryItem / MemoryConfig / BaseMemory
记忆类型层  WorkingMemory / EpisodicMemory / SemanticMemory / PerceptualMemory
存储后端层  QdrantVectorStore / Neo4jGraphStore / SQLiteDocumentStore
嵌入服务层  DashScopeEmbedding / LocalTransformerEmbedding / TFIDFEmbedding
```

`MemoryTool` 只管参数与会话上下文（自动生成 `session_id`、补 `timestamp`），真正的调度在 `MemoryManager`：它按 `memory_types` 决定实例化哪些记忆类型，并把 `add/retrieve/forget/consolidate` 分发下去。

### 2.3 四种记忆类型

| 类型     | 存储                  | 检索                                 | 评分公式                                           | 生命周期                          |
| -------- | --------------------- | ------------------------------------ | -------------------------------------------------- | --------------------------------- |
| 工作记忆 | 纯内存                | TF-IDF 词项相似度 ×0.7 + 关键词 ×0.3 | `相关度 × 时间衰减 × (0.8 + 0.4×重要性)`           | 容量 50 + TTL 60min，进程退出即失 |
| 情景记忆 | SQLite + Qdrant       | 结构化预过滤 + 向量检索              | `(向量 ×0.8 + 时间近因 ×0.2) × (0.8 + 0.4×重要性)` | 长期                              |
| 语义记忆 | Qdrant + Neo4j        | 向量检索 + 图检索（实体/关系）       | `(向量 ×0.7 + 图相似度 ×0.3) × (0.8 + 0.4×重要性)` | 长期                              |
| 感知记忆 | 按模态分集合的 Qdrant | 同模态/跨模态向量检索                | `(向量 ×0.8 + 时间近因 ×0.2) × (0.8 + 0.4×重要性)` | 按重要性动态管理                  |

三点值得记住：

1. **重要性权重只做 ±20% 调节**（区间 `[0.8, 1.2]`），不会压过相似度排序。
2. **时间近因用指数衰减** `exp(-0.1 × 小时数 / 24)`，下限 0.1——模拟遗忘曲线，24 小时内基本保持高分。
3. **权重差异来自数据形态**：情景记忆是事件，时效性是语义的一部分，所以留 0.2 给时间；语义记忆是知识，跨实体的关系推理比时间更重要，所以留 0.3 给图检索。

### 2.4 MemoryTool 的操作

`add`（4 种类型）、`search`、`summary`、`stats`、`update`、`remove`、`forget`、`consolidate`、`clear_all`。

- `search` 同时接受 `memory_type`（单数）和 `memory_types`（复数），`min_importance` 默认 0.1 过滤低质量记忆。
- `forget` 三策略：`importance_based`（阈值以下删除）、`time_based`（`max_age_days` 以上删除）、`capacity_based`（超容量时删最不重要的）。
- `consolidate`：把 `importance ≥ 阈值` 的短期记忆提升为长期记忆，默认 `working → episodic`、阈值 0.7，**整合时重要性会被放大**（实测 0.90 → 0.99、0.75 → 0.83，约 ×1.1）。

### 2.5 RAG：五层七步

```
任意格式文档 → MarkItDown → Markdown → 标题感知分段 → Token 分块(带重叠) → 嵌入 → Qdrant 存储检索
```

- **统一入口**：MarkItDown 把 PDF/Office/图片/音频都转成 Markdown，后续流程只处理一种格式。
- **标题感知分段** `_split_paragraphs_with_headings()`：按 `#/##/###` 维护 `heading_stack`，每段带 `heading_path`，语义边界即结构边界。
- **Token 分块** `_chunk_paragraphs()`：块内累积到 `chunk_tokens` 就切，尾部按 `overlap_tokens` 回退若干段做重叠，避免边界截断丢上下文。
- **中英混排 Token 估算** `_approx_token_len()`：CJK 字符按 1 token，其余按空白分词计数——不引入 tokenizer 也能控制块大小。
- **嵌入三级兜底**：百炼 API → 本地 `all-MiniLM-L6-v2` → TF-IDF。

### 2.6 三种检索策略

| 策略              | 解决什么               | 机制                                            | 代价              |
| ----------------- | ---------------------- | ----------------------------------------------- | ----------------- |
| 基础向量检索      | —                      | 查询直接编码后检索 top-k                        | 0 次额外 LLM 调用 |
| MQE 多查询扩展    | 用词差异导致漏召回     | LLM 生成 n 个语义等价的改写查询，各自检索后合并 | 1 次 LLM 调用     |
| HyDE 假设文档嵌入 | 问句与陈述句的语义鸿沟 | LLM 先写一段"假答案"，用它的向量去检索          | 1 次 LLM 调用     |

扩展检索统一走 `search_vectors_expanded()`：**扩展 → 各查询并行检索 → 按 `memory_id` 去重取最高分 → 排序**。候选池按 `top_k × candidate_pool_multiplier`（默认 4，至少 20）放大，再筛出 top-k。

## 3. 实测踩到的坑

### 3.1 Neo4j 实例不可达（阻塞主流程）

```text
ERROR:hello_agents.memory.storage.neo4j_store:❌ Neo4j服务不可用: Unable to retrieve routing information
ERROR:hello_agents.memory.types.semantic:❌ 数据库初始化失败: Unable to retrieve routing information
neo4j.exceptions.ServiceUnavailable: Unable to retrieve routing information
```

Qdrant 云与嵌入 API 均正常（`QDRANT ok: ['hello_agents_vectors', 'rag_knowledge_base']`），只有 Neo4j Aura 免费实例失效。由于 `SemanticMemory.__init__` 不做降级，异常直接冒泡。

- 方案 A（完整功能）：起本地 Neo4j，`NEO4J_URI=bolt://localhost:7687`，`docker run -p 7687:7687 -p 7474:7474 -e NEO4J_AUTH=neo4j/hello-agents-password neo4j:latest`。
- 方案 B（跳过语义记忆）：`MemoryTool(user_id="user123", memory_types=["working", "episodic"])`。注意此时 `add(memory_type="semantic")` 会返回 `❌ 添加记忆失败: 不支持的记忆类型: semantic`——不是静默失败，但 `test_mem.py` 的三条示例恰好都是 `semantic`，需要一起改。

### 3.2 章节 API 与 0.2.9 不一致

章节基于 0.2.0 写作，本机装的是 0.2.9，两处签名差异：

| 章节写法                                                      | 0.2.9 实际                                                                                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `memory_tool.run("add", content=...)` / `execute("add", ...)` | `memory_tool.run({"action": "add", "content": ...})`（`Tool.run(parameters: dict)`，无 `execute`）                                          |
| `rag_tool.execute("ask", enable_mqe=True, enable_hyde=True)`  | `rag_tool.run({"action": "ask", "enable_advanced_search": True})`——`RAGTool` 只暴露一个总开关，内部固定 `enable_mqe=True, enable_hyde=True` |

`task3/test_mem.py` 已经改成了 dict 形式，所以它的问题只在 Neo4j。

### 3.3 百炼嵌入单批上限 10 条 → 大文档索引静默变零向量（最坑）

`index_chunks()` 的 `batch_size=64`，而 `text-embedding-v3` 单请求最多 10 条：

```text
Value error, batch size is invalid, it should not be larger than 10.: input.contents   # n=11 与 n=25 均 400
```

25 个分块的文档走 `add_document` 时：

```text
[WARNING] Batch 0 encoding failed: Embedding REST 调用失败: 400 ...
[RAG] Retrying batch 0 with smaller chunks...
[WARNING] 小批次向量转换失败: only 0-dimensional arrays can be converted to Python scalars   # 重试路径形状处理错误
[ERROR] 批次 0 完全失败，使用零向量
[RAG] Qdrant upsert done: 4 vectors indexed
✅ 文档已添加到知识库: ch8.md
📊 分块数量: 25
```

结果是：**工具报告成功、分块数 25，实际写入的是零向量**，后续检索所有分数恒为 0.0，排序完全失效且没有任何异常抛出。同一份文档用 `chunk_size=2000` 切成 10 块就正常（`total_chunks=10` → `10 vectors indexed`）。单条 `add_text`（1 个分块）当然也不受影响，这也是小 demo 看不出问题的原因。

处置：用百炼嵌入时，按文档长度控制 `chunk_size` 使分块数 ≤ 10；文档更大时换本地嵌入（`EMBED_MODEL_TYPE=local`）或改框架的 `batch_size`。

### 3.4 `stats` 报错且分块数恒为 0

```text
ERROR:hello_agents.memory.storage.qdrant_store:❌ 获取集合信息失败: 'CollectionInfo' object has no attribute 'vectors_count'
📊 文档分块数: 0
```

`qdrant-client >= 1.19` 移除了 `CollectionInfo.vectors_count`，而 hello-agents 0.2.9 仍读该字段。数据其实写进去了（`count(exact=True)` 能查到），只是统计接口失效。

### 3.5 `search_vectors_expanded()` 的默认 store 指向另一个集合

直接调用 `search_vectors_expanded(query=...)` 会走 `_create_default_vector_store()`，它固定用集合 `hello_agents_rag_vectors`；而 `RAGTool` 默认写的是 `rag_knowledge_base`。不显式传 store 就永远检索到 0 条。正确做法是从管道里取：

```python
store = rag._pipelines["default"]["store"]
```

### 3.6 `rag_namespace` 与 `namespace` 不是一回事

`RAGTool(rag_namespace="x")` 只决定 `self._pipelines` 的键名，落库时打的标签来自每次调用传入的 `namespace`（默认 `"default"`）。实测 payload 里始终是 `rag_namespace: 'default'`，`stats` 同理。做多用户隔离时要显式传 `namespace=`，别指望构造函数那个参数。

## 4. 习题

### 4.1 四种记忆类型

**（1）为什么情景记忆强调时间（0.2），语义记忆强调图检索（0.3）？**

情景记忆存的是"事件"，事件的定义本身就包含"什么时候发生"。同样一条"用户完成了第一个 Python 项目"，一个月前和昨天的检索价值完全不同，所以 `(向量 ×0.8 + 时间近因 ×0.2)` 把时效性做成独立维度，再用指数衰减刻画遗忘曲线。

语义记忆存的是"知识"，它的价值在于知识之间的联系，而不是它何时被写入。把 0.3 的权重给图检索，换来的是纯向量检索做不到的能力：多跳关系、同文档/邻接片段等结构信号（0.2.9 里就是 `compute_graph_signals_from_pool()` 的 `same_doc_weight` / `proximity_weight`）。

两种设计的共同约束是：相关性权重合计为 1，重要性只做 ±20% 调节——**排序的主导权必须在相似度手里**，否则重要但无关的记忆会污染结果。

**（2）个人健康管理助手如何组合四种记忆？**

| 记忆类型 | 存什么               | 例子                                                                 |
| -------- | -------------------- | -------------------------------------------------------------------- |
| 工作记忆 | 当前会话的即时上下文 | "刚问了昨晚睡眠质量"、"用户说今天膝盖疼"（TTL 内有效，会话结束即弃） |
| 情景记忆 | 带时间戳的行为事件   | "2026-09-20 跑步 5km"、"09-19 晚餐碳水偏高"；按周/月回顾趋势         |
| 语义记忆 | 长期稳定的知识与偏好 | "对乳制品过敏"、"目标：三个月减重 5kg"、"静息心率基线 62"            |
| 感知记忆 | 多模态原始数据       | 体检报告截图、手环导出的数据文件、餐食照片                           |

分工的关键是**时效性 vs 持久性**：当日数据进情景记忆，趋势分析靠时间范围过滤；一旦某条规律被反复验证（连续两周睡眠 <6h），就应该 `consolidate` 成语义记忆里的规则，让后续所有建议都能直接引用。

**（3）工作记忆什么时候该整合？如何设计自动触发条件？**

该整合的不是"重要的工作记忆"本身，而是**被证明会重复使用的信息**。单看 `importance` 不够——用户自己打的分往往虚高。建议的组合触发条件：

```text
整合条件 = 重要性 ≥ 0.7
        AND (被检索命中次数 ≥ 2 OR 出现次数 ≥ 3)      # 复用信号
        AND 会话结束 / TTL 即将到期                     # 时机
        AND 与既有长期记忆的相似度 < 0.9                # 去重，避免堆积同义记忆
```

时机选在会话结束而不是 TTL 到期，是因为 TTL 清理是"顺手删"，两者抢同一个窗口容易丢数据。实现上把 `consolidate()` 挂到会话关闭钩子，再配一个低频的兜底定时任务即可。

### 4.2 RAG 的三个问题

**（1）没有标题结构的文档怎么分块？**

章节的 `_split_paragraphs_with_headings()` 依赖 `#` 层级，小说、法律条文里没有这个信号，退化成"整篇一段"或"按空行切"，块大小失控。可行的替代边界信号：

1. **结构模式识别**：法律条文用"第 X 条"、合同用"第 X 章/节"、小说用章节标题正则，先抽一层伪标题再复用现有流水线。
2. **语义边界**：对相邻段落算嵌入相似度，在相似度谷值处切（`cosine(p_i, p_{i+1})` 低于局部均值的段落边界即为候选切点），本质是 TextTiling。
3. **句级滑窗兜底**：以句子为单位累积 token，只允许在句末切分，块间按 15%~20% 重叠——牺牲边界精度，保证不切断句子。

落地建议：先用 1 拿到结构，再在超长段落上用 2 细化，3 作为任何情况下的兜底。同时把 `heading_path` 换成"伪标题路径"，引用来源仍然可定位。

**（2）基础检索 / MQE / HyDE 的效果对比（实测）**

测试集：6 个分块的小知识库（`llm_arch`、`vec_db`、`hallucination`、`chunking`、`python_intro`、`rag_concept`），查询故意用与文档措辞不重合的口语：`模型总爱胡说八道怎么办`（目标文档是讲"降低幻觉手段"的 `hallucination.md`）。

| 模式 | top-1            | top-1 分数 | top-2 / top-3                      |
| ---- | ---------------- | ---------- | ---------------------------------- |
| 基础 | hallucination.md | 0.574      | llm_arch 0.500 / chunking 0.481    |
| MQE  | hallucination.md | **0.769**  | chunking 0.549 / llm_arch 0.549    |
| HyDE | hallucination.md | **0.757**  | rag_concept 0.634 / chunking 0.536 |

读法（重要，别过度解读）：

- 三种模式 top-1 都命中，**排名没变，变的是分数间隔**：基础 0.574，MQE/HyDE 0.757~0.769。间隔越大，`min_score` 之类的阈值越容易卡准，也越不容易被噪声翻盘。
- HyDE 额外把 `rag_concept.md` 拉进 top-2，这是"假答案段落里会提到 RAG"带来的召回多样性——与章节说的"用答案找答案"一致。
- **无法复现章节提到的"召回率提升 30%~50%"**：6 个分块、无标注查询集的规模下，三种模式等价。要复现必须上更大的知识库 + 带 ground truth 的查询集，这个规模的实验没有统计意义。
- 成本是确定的：MQE 与 HyDE 各多 1 次 LLM 调用（`_prompt_mqe` / `_prompt_hyde`），基础检索为 0。所以选型顺序是：**基础 → 加 MQE（用词多样性问题）→ 再加 HyDE（问句/陈述句语义鸿沟）**，而不是默认全开。

补充：我还用本章正文（96KB Markdown，25 个分块）试了同样的对比，但全部分数为 0.0——被 §3.3 的批量嵌入缺陷拦住了，实验无效。这也是"动手对比前先确认索引真的写进去了"的教训。

**（3）三种嵌入方案选型**

| 维度   | 百炼 API（text-embedding-v3） | 本地 Transformer（all-MiniLM-L6-v2）              | TF-IDF                     |
| ------ | ----------------------------- | ------------------------------------------------- | -------------------------- |
| 准确性 | 最高，中文语义对齐好          | 中等；MiniLM 偏英文，中文需换 `bge-small-zh` 之类 | 无同义词能力，只有词面匹配 |
| 速度   | 网络往返 + 限流；单批 ≤10 条  | 首次加载模型慢，之后本地推理稳定                  | 极快（纯统计）             |
| 成本   | 按 token 计费                 | 一次性下载，推理免费                              | 0                          |
| 离线   | 不可用                        | 可用                                              | 可用                       |
| 维度   | 1024                          | 384                                               | 稀疏                       |

选型：**中文生产环境用百炼（或本地换中文专用模型）**；内网/断网部署选本地模型，但先确认中文效果；TF-IDF 只作为"什么都调不通"时的兜底，不要作为主方案——它连"胡说八道"和"幻觉"都匹配不上。切换成本很低：`EMBED_MODEL_TYPE` 一个变量，因为三种实现共用同一套 `get_text_embedder()` 接口。切换后注意 `QDRANT_VECTOR_SIZE` 要跟维度一起改，否则写入会被补零/截断（框架里有 `[WARNING] 向量维度异常` 提示）。

### 4.3 遗忘与归档

**（1）智能遗忘策略**

三种内置策略各看一个维度，都会误杀：`importance_based` 会删掉"重要但当时打分低"的记忆，`time_based` 会删掉"很旧但仍有价值"的知识，`capacity_based` 只在超限时才动作。加权评分方案：

```python
score = w_i * importance            # 0.4  内容价值
      + w_f * log1p(access_count) / log1p(MAX_ACCESS)   # 0.3  复用频率（对数压缩，避免热点记忆垄断）
      + w_r * exp(-age_days / HALF_LIFE)                # 0.2  时间近因（半衰期，比固定阈值平滑）
      + w_c * (1 - contradiction_rate)                  # 0.1  被后续记忆推翻的比例
# 遗忘条件：score < forget_threshold 且 最近 30 天未被检索
```

三点设计取舍：用 `log1p` 压频率、用半衰期替代"超过 N 天就删"、把"被推翻"作为负信号（用户改了偏好，旧偏好就该退场）。**必须带"最近未检索"这个硬条件**，否则低频但关键的记忆（比如过敏信息）会被分数误杀。

**（2）冷热分层归档**

不需要新概念，把 `BaseMemory` 当接口即可：热层是现有 Qdrant 集合，冷层可以是同集群的低配集合、对象存储里的序列化分块，或直接把 `importance` 降到检索阈值以下。

- **下沉**：`forget` 判定"该淘汰但 score 仍在中间区间"的记忆，从热集合删除、写入冷存储，保留 `memory_id`、`content_hash` 和向量（向量留着才能"按需唤醒"）。
- **恢复**：检索时若热层 top-1 相似度低于阈值，再查一次冷层，命中则把该记忆回写热层并重置 `access_count`。
- **与四种类型集成**：工作记忆不需要归档（本来就是临时的）；情景记忆按时间下沉最自然；语义记忆要谨慎，它是推理的依赖，宁可保留；感知记忆原始文件最占空间，优先下沉、只留向量与元数据。

**（3）"忘记"隐私数据够不够？**

不够。只删关系库里的行，向量库里可能还留着可反推的向量；Neo4j 里的实体/关系可能还在，甚至因为关系推理还能间接暴露"某人存在过"；备份、WAL、日志、嵌入缓存（框架里的 `content_hash` 缓存）都可能是副本。要做的是：

1. 按 `user_id` / `memory_id` 全链路删除：SQLite 行 + Qdrant 点（`delete` by filter）+ Neo4j 节点与关系。
2. 清理派生数据：`content_hash` 嵌入缓存、检索日志、导出的报告 JSON。
3. 清 Neo4j 时要**连孤立节点一起删**——只删边会留下悬空实体。
4. 把"删除"设计成可验证操作：删除后按同一 filter 再查一次，断言为空（这类删除请求需要审计留痕）。

### 4.4 学习助手的两个问题

**（1）什么时候用 RAG，什么时候用 Memory？**

| 问题类型          | 走哪条路                     | 例子                                       |
| ----------------- | ---------------------------- | ------------------------------------------ |
| 文档内容问答      | RAG                          | "论文里怎么定义稀疏注意力？"               |
| 用户自身状态/历史 | Memory                       | "我之前记过哪些笔记？"、"我上次问过什么？" |
| 两者都要          | RAG 检索 + Memory 提供上下文 | "根据我的进度，接下来该看哪一章？"         |

**智能路由**不该再加一层 LLM 分类器（多一次调用、还会错）。用确定性规则先分流：检索目标包含"我/之前/上次/记过"等第一人称历史指代 → Memory；包含文档专有名词或问的是客观知识 → RAG；两者都命中 → 并发查两条路，把 Memory 结果作为**用户上下文**、RAG 结果作为**事实依据**一起塞进 Prompt。规则覆盖不了的再用 LLM 兜底，且把路由决策记进情景记忆，便于事后复盘误判。

**（2）更智能的学习报告**

现在 `generate_report()` 只有计数。要分析轨迹、找盲点、给建议，需要组合四类记忆：

- **轨迹**：情景记忆按 `session_id` 聚合，得到"何时加载了哪份文档、问了哪些问题"，回答的是"学了什么"。
- **盲点**：语义记忆里的概念集合 − 已被提问/笔记覆盖的概念集合。更狠一点：对每条笔记做检索，看它能否被文档中的证据支撑（相似度低 = 只记了结论没理解依据）。
- **掌握度**：工作记忆里高频出现却反复追问的概念（同一概念被问 ≥3 次）＝ 尚未掌握；反之，被提问后不再出现的概念视为已消化。
- **建议**：把上面的信号交给 LLM 生成下一步学习计划，而不是让 LLM 凭空推荐。

用到的检索策略：概念覆盖用向量检索 + 图检索（语义记忆里概念之间的关系能推出"前置知识缺口"）；轨迹用情景记忆的时间范围过滤。

**（3）多用户部署的数据隔离**

- **Qdrant**：单集合 + payload 过滤（`user_id` / `rag_namespace`），配合字段索引，写入和查询都带 filter。优点是运维简单，缺点是过滤基数大时性能下降、且一次误删影响面大。用户量上去后按用户分 collection 或分 shard（Qdrant 的 `shard_key`），隔离性更好，代价是集合数量膨胀。
- **Neo4j**：用 `user_id` 属性做标签/属性过滤，或为每个用户建独立 database（企业版）/ 独立 label 前缀（社区版）。**绝不能只靠实体名去重**——不同用户的"张三"必须分成两个节点。
- **SQLite**：`memory.db` 单文件在多用户下是瓶颈，换成 Postgres 按 `user_id` 分区。
- **性能**：读多写少 → 加缓存（按 `(user_id, query_hash)` 缓存检索结果）；嵌入调用是最大成本项，批量化 + 结果缓存；跨用户的公共知识（文档本身）只索引一份，用 namespace 区分可见范围，不要每个用户复制一份向量。
- **安全边界**：所有查询强制注入 `user_id` 过滤条件，不能依赖调用方传参——隔离失败一次就是数据泄露。

### 4.5 知识图谱

**（1）自动抽取的准确性**

框架用 spaCy（`zh_core_web_sm` / `en_core_web_sm`）做实体关系抽取，误差主要来自：指代消解缺失（"他"、"该公司"无法归属到实体）、领域专名不在预训练词表里（"Qdrant"、"HyDE" 常被漏掉或误标）、关系方向搞反（"A 依赖 B" 抽成 `B → A`）、多义实体合并（同一名字的两个人被并成一个节点）。

质量评估机制建议按"抽样 + 一致性"两条腿走：

1. 抽取后立刻用 LLM 对采样实体做一次判定（是/不是该类型的实体），统计准确率，低于阈值就告警。
2. 监控图结构异常：孤立节点比例、自环边数量、同一实体名对应的邻居数突变——这些是抽取劣化的早期信号。
3. 高价值实体（出现频次高、被多次检索命中）人工抽检，其余按统计放行。

**（2）纯向量检索做不到的查询**

"找出所有与'张三'间接相关的人"——向量检索只能返回和查询语义相似的片段，无法沿关系走。用 Cypher 两跳查询即可：

```cypher
MATCH (p:Entity {name: '张三'})-[r1]-(mid:Entity)-[r2]-(other:Entity)
WHERE other.name <> '张三'
RETURN other.name, type(r1), type(r2), count(*) AS paths
ORDER BY paths DESC
```

同理还有：找出连接两个概念的最短路径（解释"这两个知识点怎么串起来"）、找出度数最高但从未被检索的实体（发现知识盲区）、按关系类型做传递闭包（"A 属于 B，B 属于 C" → 推断 A 属于 C）。这些都是图结构问题，与嵌入质量无关。

**（3）什么时候图检索能显著提升？**

| 查询类型                       | 向量检索 | 向量 + 图                                          |
| ------------------------------ | -------- | -------------------------------------------------- |
| 单概念定义（"什么是 HyDE"）    | 够用     | 无收益                                             |
| 多跳关系（"和 X 有关的人/事"） | 基本失效 | 显著提升                                           |
| 结构约束（"同一文档相邻段落"） | 无能力   | 显著提升（`same_doc_weight` / `proximity_weight`） |
| 长尾专名（模型词表里没有的词） | 召回差   | 图上的精确匹配能补回                               |

一句话：**向量负责"语义相近"，图负责"结构相连"**。查询意图落在"关系/路径/约束"上时图检索才有意义，落在"意思相近的一段话"上时它只是噪声来源。

## 5. 待办

- 章节习题里的动手题（4.3.1 智能遗忘评分、4.2.1 语义边界分块）目前只有设计，没有落成可运行代码。
