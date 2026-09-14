import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

/**
 * 全部文章，按 date 降序、id 升序排列。
 * 同日文章的先后顺序由文件名（id）决定，保证列表稳定。
 */
export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts')
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id))
}

/**
 * 预计阅读时长：中文按每分钟 500 字估算，去除空白后计数，至少 1 分钟。
 */
export function estimateReadingMinutes(body: string | undefined): number {
  return Math.max(1, Math.ceil((body ?? '').replace(/\s/g, '').length / 500))
}

/**
 * 分类：frontmatter 的 category 优先（用于显示名如「AI 工具」），
 * 否则取 id 的第一段目录名（ai-tools/foo.md → ai-tools），根级文件无分类时返回「未分类」。
 *
 * 目录名会逐段 slug 化后进 URL（小写、空格转 -、中文百分号编码），请用 ASCII 命名；
 * dir/index.md 的 id 会塌缩为 dir（目录即一篇文章）。
 */
export function getCategory(entry: CollectionEntry<'posts'>): string {
  return entry.data.category ?? (entry.id.includes('/') ? entry.id.split('/')[0] : '未分类')
}
