import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
})

export const signupSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون 2 أحرف على الأقل').max(100),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword']
})

export const passwordResetSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح')
})

export const passwordUpdateSchema = z.object({
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword']
})
