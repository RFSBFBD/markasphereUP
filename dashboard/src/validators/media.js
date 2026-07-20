import { z } from 'zod'

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const mediaUploadSchema = z.object({
  file: z.instanceof(File).refine(f => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    return ALLOWED_EXTENSIONS.includes(ext)
  }, 'نوع الملف غير مسموح').refine(f => {
    return f.size <= MAX_FILE_SIZE
  }, 'حجم الملف يتجاوز 5 ميغابايت'),
  bucket: z.string(),
  path: z.string().optional(),
  alt: z.string().max(200).optional()
})

export const mediaDeleteSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url()
})

export const mediaUpdateSchema = z.object({
  id: z.string().uuid(),
  alt: z.string().max(200).optional()
})
