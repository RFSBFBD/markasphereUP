export const MEDIA_KEYS = ['logo', 'white_logo', 'favicon', 'og_image']

export const SETTINGS_FIELDS = [
  'site_name_ar',
  'site_name_en',
  'site_description_ar',
  'site_description_en',
  'company_email',
  'phone',
  'whatsapp',
  'google_maps_url',
  'address_ar',
  'address_en',
  'hero_title_ar',
  'hero_title_en',
  'hero_description_ar',
  'hero_description_en',
  'hero_button_text',
  'hero_button_url',
  'meta_title',
  'meta_description',
  'keywords',
  'google_verification',
  'facebook_verification',
  'twitter_verification',
  'facebook',
  'instagram',
  'linkedin',
  'behance',
  'dribbble',
  'github',
  'youtube',
  'tiktok',
  'x',
  'footer_copyright',
  'footer_description',
]

export const SOCIAL_FIELDS = [
  'facebook',
  'instagram',
  'linkedin',
  'behance',
  'dribbble',
  'github',
  'youtube',
  'tiktok',
  'x',
]

export const URL_FIELDS = ['google_maps_url', 'hero_button_url', ...SOCIAL_FIELDS]

export function defaultSettings() {
  const row = { id: null }
  for (const f of SETTINGS_FIELDS) row[f] = ''
  for (const m of MEDIA_KEYS) row[m] = null
  return row
}

export function isValidEmail(v) {
  if (!v) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())
}

export function isValidUrl(v) {
  if (!v) return true
  try {
    const u = new URL(String(v).trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidPhone(v) {
  if (!v) return true
  return /^[+]?[\d\s().-]{6,20}$/.test(String(v).trim())
}

export function validateSettings(form) {
  const errors = {}
  if (!form.site_name_ar?.trim()) errors.site_name_ar = 'اسم الموقع بالعربية مطلوب'
  if (!form.site_name_en?.trim()) errors.site_name_en = 'اسم الموقع بالإنجليزية مطلوب'
  if (!form.company_email?.trim()) errors.company_email = 'البريد الإلكتروني للشركة مطلوب'
  else if (!isValidEmail(form.company_email)) errors.company_email = 'صيغة البريد الإلكتروني غير صحيحة'

  if (form.phone && !isValidPhone(form.phone)) errors.phone = 'صيغة رقم الهاتف غير صحيحة'
  if (form.whatsapp && !isValidPhone(form.whatsapp)) errors.whatsapp = 'صيغة رقم واتساب غير صحيحة'

  for (const k of URL_FIELDS) {
    if (form[k] && !isValidUrl(form[k])) errors[k] = 'الرابط غير صحيح'
  }
  return errors
}
