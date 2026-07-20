import { z } from 'zod'

export const teamMemberSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون 2 أحرف على الأقل').max(100),
  role: z.string().min(2, 'المسمى الوظيفي مطلوب').max(100),
  bio: z.string().min(10).max(1000),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  social_links: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal(''))
  }).optional(),
  active: z.boolean().default(true)
})

export const teamMemberUpdateSchema = teamMemberSchema.partial()
