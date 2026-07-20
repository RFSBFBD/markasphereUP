export const BLOG_CATEGORIES = [
  { value: 'news', label: 'أخبار' },
  { value: 'articles', label: 'مقالات' },
  { value: 'case-studies', label: 'دراسات حالة' },
  { value: 'design-tips', label: 'نصائح تصميم' },
  { value: 'announcements', label: 'إعلانات' },
]

export function slugify(input) {
  if (!input) return ''
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function categoryLabel(value) {
  const found = BLOG_CATEGORIES.find((c) => c.value === value)
  return found ? found.label : value || '—'
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function validateBlog(form) {
  const errors = {}
  if (!form.title_ar?.trim()) errors.title_ar = 'العنوان بالعربية مطلوب'
  if (!form.title_en?.trim()) errors.title_en = 'العنوان بالإنجليزية مطلوب'
  if (!form.slug?.trim()) errors.slug = 'الرابط المختصر مطلوب'
  if (!form.category) errors.category = 'التصنيف مطلوب'
  if (!form.content_ar?.trim()) errors.content_ar = 'المحتوى بالعربية مطلوب'
  if (!form.content_en?.trim()) errors.content_en = 'المحتوى بالإنجليزية مطلوب'
  return errors
}
