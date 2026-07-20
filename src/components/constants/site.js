import { reactive } from 'vue'
import { settingsService } from '@/services/SettingsService'
import { WHATSAPP_URL, CONTACT_EMAIL, WHATSAPP_DISPLAY } from '@/composables/services/contact.config'

// Defaults keep the site fully functional before/without Supabase data.
const DEFAULT_FALLBACK = {
  name_en: 'MarkaSphere',
  name_ar: 'ماركا سفير',
  email: CONTACT_EMAIL,
  phone: WHATSAPP_DISPLAY,
  whatsapp: WHATSAPP_URL,
  googleMapsUrl: '',
  address_en: '',
  address_ar: '',
  socials: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    behance: '',
    snapchat: '',
    tiktok: '',
    x: ''
  },
  logo: '',
  whiteLogo: '',
  favicon: '',
  ogImage: '',
  partners: [],
  testimonials: [],
  hero: {},
  footer: {},
  raw: null
}

// Reactive singleton consumed by Footer.vue and ContactView.vue.
export const SITE = reactive({ ...DEFAULT_FALLBACK })

let loadPromise = null

function mapSettings(s) {
  if (!s) return DEFAULT_FALLBACK
  return {
    name_en: s.site_name_en || DEFAULT_FALLBACK.name_en,
    name_ar: s.site_name_ar || DEFAULT_FALLBACK.name_ar,
    email: s.company_email || s.email || DEFAULT_FALLBACK.email,
    phone: s.phone || DEFAULT_FALLBACK.phone,
    whatsapp: s.whatsapp || DEFAULT_FALLBACK.whatsapp,
    googleMapsUrl: s.google_maps_url || '',
    address_en: s.address_en || '',
    address_ar: s.address_ar || '',
    socials: {
      facebook: s.facebook || '',
      twitter: s.twitter || '',
      instagram: s.instagram || '',
      linkedin: s.linkedin || '',
      youtube: s.youtube || '',
      behance: s.behance || '',
      dribbble: s.dribbble || '',
      github: s.github || '',
      snapchat: s.snapchat || '',
      tiktok: s.tiktok || '',
      x: s.x || ''
    },
    logo: s.logo || '',
    whiteLogo: s.white_logo || s.logo || '',
    favicon: s.favicon || '',
    ogImage: s.og_image || s.og_image_url || '',
    partners: Array.isArray(s.partners) ? s.partners : [],
    testimonials: Array.isArray(s.testimonials) ? s.testimonials : [],
    hero: s,
    footer: s,
    raw: s
  }
}

export async function loadSiteSettings() {
  if (loadPromise) return loadPromise
  loadPromise = (async () => {
    try {
      const settings = await settingsService.getSiteSettings()
      Object.assign(SITE, mapSettings(settings))
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('[site] loadSiteSettings failed, using defaults', e)
      }
    }
  })()
  return loadPromise
}

export default SITE
