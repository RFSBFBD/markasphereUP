import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون 2 أحرف على الأقل').max(100),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().max(300).optional()
})

export const categoryUpdateSchema = categorySchema.partial()
