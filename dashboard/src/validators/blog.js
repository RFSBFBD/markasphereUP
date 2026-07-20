import { z } from 'zod'

export const blogSchema = z.object({
  title: z.string().min(2, 'العنوان يجب أن يكون 2 أحرف على الأقل').max(300),
  slug: z.string().min(2).max(350).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(50, 'المحتوى قصير جداً'),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  meta_title: z.string().max(70).optional(),
  meta_description: z.string().max(160).optional(),
  canonical_url: z.string().url().optional().or(z.literal(''))
})

export const blogUpdateSchema = blogSchema.partial()
