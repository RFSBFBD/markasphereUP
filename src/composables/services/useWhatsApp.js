import { WHATSAPP_NUMBER, WHATSAPP_URL } from '@/composables/services/contact.config'

// The official WhatsApp number is the single source of truth.
const PHONE = WHATSAPP_NUMBER

export function useWhatsApp() {
  const buildLink = (serviceName, locale = 'ar') => {
    const phone = PHONE
    const msg = serviceName
      ? (locale === 'ar'
          ? `مرحباً، أريد طلب خدمة "${serviceName}" من MarkaSphere`
          : `Hello, I would like to request the "${serviceName}" service from MarkaSphere`)
      : (locale === 'ar'
          ? 'مرحباً، أريد التواصل مع MarkaSphere'
          : 'Hello, I would like to get in touch with MarkaSphere')
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
  }

  const openWhatsApp = (serviceName, locale = 'ar') => {
    window.open(buildLink(serviceName, locale), '_blank', 'noopener')
  }

  return { buildLink, openWhatsApp, PHONE, WHATSAPP_URL }
}
