import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(2, 'العنوان يجب أن يكون 2 أحرف على الأقل').max(200),
  slug: z.string().min(2).max(250).regex(/^[a-z0-9-]+$/, 'slug غير صالح'),
  description: z.string().min(10).max(500),
  content: z.string().min(20),
  category_id: z.string().uuid('يجب اختيار تصنيف'),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  client_name: z.string().max(200).optional(),
  client_url: z.string().url('رابط غير صالح').optional().or(z.literal('')),
  completion_date: z.string().optional(),
  technologies: z.array(z.string()).optional().default([]),
  testimonial: z.string().max(1000).optional(),
  meta_title: z.string().max(70).optional(),
  meta_description: z.string().max(160).optional()
})

export const projectUpdateSchema = projectSchema.partial()
