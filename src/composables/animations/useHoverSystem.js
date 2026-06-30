import { onUnmounted } from 'vue'
import gsap from 'gsap'
import { MOTION, reducedMotion, isTouch } from '@/composables/animations/motion.config'
import { dirSign } from '@/composables/utils/direction'

const HOVER_DEFAULTS = {
  duration: MOTION.hover,
  ease: MOTION.ease.strong,
  lift: -8,
  scale: 1.02,
  shadowLift: '0 20px 56px rgba(0, 0, 0, 0.12)',
  shadowBase: '0 0 0 rgba(0, 0, 0, 0)'
}

const isMobile = () => window.innerWidth <= 768 || isTouch()

export function useHoverSystem() {
  const activeTimelines = new Map()

  function cardHover(el, options = {}) {
    if (!el || !(el instanceof HTMLElement) || isMobile() || reducedMotion()) return

    const opts = { ...HOVER_DEFAULTS, ...options }
    const card = el
    const glow = card.querySelector('.card-glow')
    const icon = card.querySelector('.card-icon')
    const arrow = card.querySelector('.card-arrow')

    let enterTl = null
    let leaveTl = null

    const onEnter = () => {
      if (leaveTl) leaveTl.kill()

      enterTl = gsap.timeline({ defaults: { ease: opts.ease } })

      enterTl.to(card, {
        y: opts.lift,
        scale: opts.scale,
        duration: opts.duration,
        boxShadow: opts.shadowLift
      }, 0)

      if (glow) {
        enterTl.to(glow, {
          opacity: 1,
          duration: opts.duration
        }, 0)
      }

      if (icon) {
        enterTl.to(icon, {
          scale: 1.1,
          duration: opts.duration
        }, 0)
      }

      if (arrow) {
        enterTl.to(arrow, {
          x: 8 * dirSign(),
          opacity: 1,
          duration: opts.duration * 0.8
        }, 0)
      }
    }

    const onLeave = () => {
      if (enterTl) enterTl.kill()

      leaveTl = gsap.timeline({ defaults: { ease: opts.ease } })

      leaveTl.to(card, {
        y: 0,
        scale: 1,
        duration: opts.duration,
        boxShadow: opts.shadowBase
      }, 0)

      if (glow) {
        leaveTl.to(glow, {
          opacity: 0,
          duration: opts.duration
        }, 0)
      }

      if (icon) {
        leaveTl.to(icon, {
          scale: 1,
          duration: opts.duration
        }, 0)
      }

      if (arrow) {
        leaveTl.to(arrow, {
          x: 0,
          opacity: 0,
          duration: opts.duration * 0.8
        }, 0)
      }
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)

    activeTimelines.set(card, { onEnter, onLeave })
  }

  function imageCardHover(el, options = {}) {
    if (!el || !(el instanceof HTMLElement) || isMobile() || reducedMotion()) return

    const opts = { ...HOVER_DEFAULTS, ...options }
    const card = el
    const image = card.querySelector('.card-image')
    const overlay = card.querySelector('.card-overlay')
    const viewBtn = card.querySelector('.card-view')

    let enterTl = null
    let leaveTl = null

    const onEnter = () => {
      if (leaveTl) leaveTl.kill()

      enterTl = gsap.timeline({ defaults: { ease: opts.ease } })

      enterTl.to(card, {
        y: opts.lift,
        duration: opts.duration,
        boxShadow: opts.shadowLift
      }, 0)

      if (image) {
        enterTl.to(image, {
          scale: 1.08,
          duration: opts.duration * 1.2
        }, 0)
      }

      if (overlay) {
        enterTl.to(overlay, {
          opacity: 1,
          duration: opts.duration
        }, 0)
      }

      if (viewBtn) {
        enterTl.to(viewBtn, {
          scale: 1,
          duration: opts.duration * 0.8,
          ease: opts.ease
        }, opts.duration * 0.1)
      }
    }

    const onLeave = () => {
      if (enterTl) enterTl.kill()

      leaveTl = gsap.timeline({ defaults: { ease: opts.ease } })

      leaveTl.to(card, {
        y: 0,
        duration: opts.duration,
        boxShadow: opts.shadowBase
      }, 0)

      if (image) {
        leaveTl.to(image, {
          scale: 1,
          duration: opts.duration
        }, 0)
      }

      if (overlay) {
        leaveTl.to(overlay, {
          opacity: 0,
          duration: opts.duration * 0.8
        }, 0)
      }

      if (viewBtn) {
        leaveTl.to(viewBtn, {
          scale: 0.4,
          duration: opts.duration * 0.6
        }, 0)
      }
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)

    activeTimelines.set(card, { onEnter, onLeave })
  }

  function buttonHover(el, options = {}) {
    if (!el || !(el instanceof HTMLElement) || isMobile() || reducedMotion()) return

    const opts = { duration: MOTION.button, ease: MOTION.ease.primary, ...options }

    const onEnter = () => {
      gsap.to(el, {
        y: -4,
        scale: 1.03,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        duration: opts.duration,
        ease: opts.ease
      })
    }

    const onLeave = () => {
      gsap.to(el, {
        y: 0,
        scale: 1,
        boxShadow: 'none',
        duration: opts.duration,
        ease: opts.ease
      })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    activeTimelines.set(el, { onEnter, onLeave })
  }

  function iconButtonHover(el, options = {}) {
    if (!el || !(el instanceof HTMLElement) || isMobile() || reducedMotion()) return

    const opts = { duration: MOTION.hover, ease: MOTION.ease.primary, ...options }

    const onEnter = () => {
      gsap.to(el, {
        scale: 1.15,
        duration: opts.duration,
        ease: opts.ease
      })
    }

    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        duration: opts.duration,
        ease: opts.ease
      })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    activeTimelines.set(el, { onEnter, onLeave })
  }

  onUnmounted(() => {
    activeTimelines.forEach(({ onEnter, onLeave }, el) => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    })
    activeTimelines.clear()
  })

  function removeHover(el) {
    const entry = activeTimelines.get(el)
    if (entry) {
      el.removeEventListener('mouseenter', entry.onEnter)
      el.removeEventListener('mouseleave', entry.onLeave)
      activeTimelines.delete(el)
    }
  }

  return { cardHover, imageCardHover, buttonHover, iconButtonHover, removeHover }
}

export function useMagnetic() {
  function magnetic(el, options = {}) {
    if (!el || isMobile() || reducedMotion()) return
    const strength = options.strength || 0.3
    const duration = options.duration || 0.4

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * strength
      const y = (e.clientY - rect.top - rect.height / 2) * strength
      gsap.to(el, { x, y, duration, ease: 'power2.out' })
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration, ease: 'power2.out' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  }

  return { magnetic }
}
