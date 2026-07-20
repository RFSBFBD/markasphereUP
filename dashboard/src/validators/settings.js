import { z } from 'zod'

export const settingsSchema = z.object({
  site_name: z.string().min(2, 'اسم الموقع مطلوب').max(100),
  site_description: z.string().min(10).max(500),
  site_url: z.string().url('رابط الموقع غير صالح'),
  default_locale: z.enum(['ar', 'en']),
  contact_email: z.string().email('بريد إلكتروني غير صالح'),
  contact_phone: z.string().optional(),
  social_links: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    whatsapp: z.string().optional()
  }).optional(),
  analytics_id: z.string().optional(),
  maintenance_mode: z.boolean().default(false)
})

export const settingsUpdateSchema = settingsSchema.partial()
