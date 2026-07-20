import { DEVICE } from '@/composables/animations/motion.config'

export const SLIDER_SPEED = {
  portfolio: { desktop: 17, tablet: 14, mobile: 10 },
  testimonials: { desktop: 13, tablet: 11, mobile: 8 },
  partners: { desktop: 8, tablet: 6, mobile: 4 },
  blog: { desktop: 15, tablet: 13, mobile: 10 }
}

function getDevice() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 9999
  if (w <= DEVICE.mobile) return 'mobile'
  if (w <= DEVICE.tablet) return 'tablet'
  return 'desktop'
}

export function getSliderSpeed(key) {
  const speeds = SLIDER_SPEED[key]
  if (!speeds) return 30
  if (typeof speeds === 'number') return speeds
  return speeds[getDevice()]
}
