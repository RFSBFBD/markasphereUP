export const PROJECT_CATEGORIES = [
  { value: 'visual-identity', label: 'الهويات البصرية', labelEn: 'Visual Identity' },
  { value: 'company-profiles', label: 'بروفايلات الشركات', labelEn: 'Company Profiles' },
  { value: 'websites', label: 'المواقع الإلكترونية', labelEn: 'Websites' },
  { value: 'social-media', label: 'السوشيال ميديا', labelEn: 'Social Media' },
  { value: 'video', label: 'الفيديو والمونتاج', labelEn: 'Video Editing' },
  { value: 'marketing', label: 'الحملات التسويقية', labelEn: 'Marketing Campaigns' },
  { value: 'print', label: 'المطبوعات التجارية', labelEn: 'Print Design' },
]

export function categoryLabel(value, locale = 'ar') {
  const c = PROJECT_CATEGORIES.find((x) => x.value === value)
  if (!c) return value || '—'
  return locale === 'en' ? c.labelEn : c.label
}

export function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ACCEPTED_IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp']
export const MAX_COVER_BYTES = 2 * 1024 * 1024
export const MAX_GALLERY_BYTES = 2 * 1024 * 1024
export const COVER_RATIO = '1600 × 900'
export const GALLERY_RATIO = '1200 × 900'

export function humanSize(bytes) {
  if (!bytes) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function pathFromUrl(url) {
  if (!url || typeof url !== 'string') return null
  const marker = '/object/public/projects/'
  const i = url.indexOf(marker)
  return i === -1 ? null : url.slice(i + marker.length)
}

export function getImageSize(file) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      resolve(null)
    }
    img.src = URL.createObjectURL(file)
  })
}

export function validateImageFile(file, maxBytes = MAX_COVER_BYTES) {
  if (!file) return 'لم يتم اختيار ملف'
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'الصيغة غير مدعومة (JPG، PNG، WEBP فقط)'
  }
  if (file.size > maxBytes) {
    return `حجم الملف يتجاوز الحد المسموح (${humanSize(maxBytes)})`
  }
  return null
}
