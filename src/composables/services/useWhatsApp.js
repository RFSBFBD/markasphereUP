const PHONE = '201062777300'

export function useWhatsApp() {
  const buildLink = (serviceName) => {
    const msg = serviceName
      ? `مرحباً، أريد طلب خدمة "${serviceName}" من MarkaSphere`
      : 'مرحباً، أريد التواصل مع MarkaSphere'
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
  }

  const openWhatsApp = (serviceName) => {
    window.open(buildLink(serviceName), '_blank', 'noopener')
  }

  return { buildLink, openWhatsApp, PHONE }
}
