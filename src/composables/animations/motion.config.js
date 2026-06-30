export const MOTION = {
  hero: 1.1,
  card: 0.8,
  button: 0.35,
  hover: 0.3,
  section: 0.9,
  fast: 0.35,
  normal: 0.8,
  slow: 1.1,
  stagger: 0.14,
  staggerTight: 0.12,
  staggerWide: 0.18,
  yDistance: 50,
  ease: {
    primary: 'power2.out',
    strong: 'power3.out',
    inOut: 'power2.inOut'
  }
}

export const DEVICE = {
  mobile: 640,
  tablet: 1024,
  hover: 768
}

export const isMobile = () => window.innerWidth <= DEVICE.mobile
export const isTablet = () => window.innerWidth <= DEVICE.tablet
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isTouch = () => 'ontouchstart' in window
export const mobileScale = (val) => isMobile() ? val * 0.5 : isTablet() ? val * 0.7 : val
