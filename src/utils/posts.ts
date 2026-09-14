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
