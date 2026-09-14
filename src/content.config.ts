import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// 日期格式：YYYY.MM.DD（如 2026.09.11）
const datePattern = /^\d{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])$/

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    date: z.string().regex(datePattern),
    updatedDate: z.string().regex(datePattern).optional(),
  }),
})

export const collections = { posts }
