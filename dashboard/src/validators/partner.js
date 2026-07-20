import { z } from 'zod'

export const partnerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون 2 أحرف على الأقل').max(200),
  website: z.string().url('رابط غير صالح').optional().or(z.literal('')),
  active: z.boolean().default(true)
})

export const partnerUpdateSchema = partnerSchema.partial()
