import { onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { MOTION, isMobile, reducedMotion, mobileScale } from '@/composables/animations/motion.config'

gsap.registerPlugin(ScrollTrigger)

export function usePageLoadAnimation() {
  function heroEntrance({ tag, lines, desc, actions, clients, scroll }) {
    if (reducedMotion()) return

    const tl = gsap.timeline({
      defaults: { ease: MOTION.ease.strong }
    })

    if (tag) {
      tl.from(tag, {
        y: 15,
        opacity: 0,
        duration: isMobile() ? 0.3 : MOTION.hero * 0.5
      }, 0.1)
    }

    if (lines && lines.length) {
      tl.from(lines, {
        y: mobileScale(MOTION.yDistance),
        opacity: 0,
        duration: isMobile() ? 0.35 : MOTION.hero,
        stagger: isMobile() ? 0.06 : MOTION.stagger
      }, 0.2)
    }

    if (desc) {
      tl.from(desc, {
        y: mobileScale(25),
        opacity: 0,
        duration: isMobile() ? 0.3 : MOTION.normal
      }, isMobile() ? 0.45 : 0.55)
    }

    if (actions) {
      tl.from(actions.children || actions, {
        y: 15,
        opacity: 0,
        duration: isMobile() ? 0.25 : MOTION.button,
        stagger: MOTION.staggerTight
      }, isMobile() ? 0.55 : 0.7)
    }

    if (clients) {
      tl.from(clients, {
        y: 15,
        opacity: 0,
        duration: isMobile() ? 0.25 : MOTION.fast
      }, isMobile() ? 0.7 : 0.9)
    }

    if (scroll && !isMobile()) {
      tl.from(scroll, {
        opacity: 0,
        duration: MOTION.fast
      }, 1.1)
    }

    return tl
  }

  return { heroEntrance }
}

export function useScrollReveal() {
  const triggers = []

  function sectionReveal(el, options = {}) {
    if (!el || reducedMotion()) return

    const children = options.children || el.children
    const childArray = Array.from(children)

    if (!childArray.length) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: options.start || 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    tl.from(childArray, {
      y: mobileScale(options.y ?? MOTION.yDistance),
      opacity: 0,
      duration: options.duration ?? (isMobile() ? 0.35 : MOTION.section),
      stagger: options.stagger ?? (isMobile() ? 0.05 : MOTION.staggerWide),
      ease: options.ease || MOTION.ease.primary
    })

    triggers.push(tl)
    return tl
  }

  function headerReveal(el, options = {}) {
    if (!el || reducedMotion()) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    const children = Array.from(el.children)

    tl.from(children, {
      y: mobileScale(options.y ?? 35),
      opacity: 0,
      duration: isMobile() ? 0.35 : MOTION.section,
      stagger: isMobile() ? 0.06 : (options.stagger ?? MOTION.staggerWide),
      ease: options.ease || MOTION.ease.primary
    })

    triggers.push(tl)
    return tl
  }

  function staggerCards(cards, options = {}) {
    if (!cards || !cards.length || reducedMotion()) return

    const triggerEl = options.trigger || cards[0]

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: options.start || 'top 82%',
        toggleActions: 'play none none none'
      }
    })

    tl.from(cards, {
      y: mobileScale(options.y ?? MOTION.yDistance),
      opacity: 0,
      duration: options.duration ?? (isMobile() ? 0.3 : MOTION.card),
      stagger: options.stagger ?? (isMobile() ? 0.04 : MOTION.staggerWide),
      ease: options.ease || MOTION.ease.primary
    })

    triggers.push(tl)
    return tl
  }

  function counterReveal(el, target) {
    if (!el || reducedMotion()) return

    const obj = { val: 0 }

    gsap.to(obj, {
      val: target,
      duration: isMobile() ? 0.5 : MOTION.hero,
      ease: MOTION.ease.primary,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val)
      }
    })
  }

  onUnmounted(() => {
    triggers.forEach(t => {
      if (t.scrollTrigger) t.scrollTrigger.kill()
      if (t.kill) t.kill()
    })
  })

  return { sectionReveal, headerReveal, staggerCards }
}

export function useParallaxSystem() {
  const triggers = []

  function parallaxBg(el, speed = 0.3) {
    if (!el || reducedMotion() || isMobile()) return

    const tl = gsap.to(el, {
      yPercent: -20 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      }
    })

    triggers.push(tl)
    return tl
  }

  onUnmounted(() => {
    triggers.forEach(t => {
      if (t.scrollTrigger) t.scrollTrigger.kill()
      if (t.kill) t.kill()
    })
  })

  return { parallaxBg }
}

export function useFade() {
  function fadeIn(target, vars = {}) {
    if (!target || reducedMotion()) return
    return gsap.to(target, {
      opacity: 1,
      duration: vars.duration || MOTION.normal,
      ease: vars.ease || MOTION.ease.primary,
      ...vars
    })
  }

  function fadeOut(target, vars = {}) {
    if (!target || reducedMotion()) return
    return gsap.to(target, {
      opacity: 0,
      duration: vars.duration || MOTION.normal,
      ease: vars.ease || MOTION.ease.primary,
      ...vars
    })
  }

  return { fadeIn, fadeOut }
}

export function useReveal() {
  function reveal(target, vars = {}) {
    if (!target || reducedMotion()) return null

    const hasScrollTrigger = vars.scrollTrigger
    const scrollTriggerConfig = hasScrollTrigger === true
      ? { trigger: target, start: 'top 80%', toggleActions: 'play none none none' }
      : typeof hasScrollTrigger === 'object'
        ? { start: 'top 80%', toggleActions: 'play none none none', ...hasScrollTrigger }
        : null

    const { scrollTrigger, ...fromVars } = vars

    if (scrollTriggerConfig) {
      const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig })
      tl.from(target, fromVars)
      return tl
    }

    return gsap.from(target, fromVars)
  }

  return { reveal }
}

export function useStagger() {
  function stagger(targets, vars = {}) {
    if (!targets || !targets.length || reducedMotion()) return null

    const hasScrollTrigger = vars.scrollTrigger
    const triggerEl = hasScrollTrigger === true ? targets[0] :
      typeof hasScrollTrigger === 'object' && hasScrollTrigger.trigger ? hasScrollTrigger.trigger : null
    const scrollTriggerConfig = hasScrollTrigger === true
      ? { trigger: triggerEl, start: 'top 82%', toggleActions: 'play none none none' }
      : typeof hasScrollTrigger === 'object'
        ? { start: 'top 82%', toggleActions: 'play none none none', ...hasScrollTrigger }
        : null

    const { scrollTrigger, ...fromVars } = vars
    fromVars.stagger = fromVars.stagger ?? MOTION.stagger

    if (scrollTriggerConfig) {
      const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig })
      tl.from(targets, fromVars)
      return tl
    }

    return gsap.from(targets, fromVars)
  }

  return { stagger }
}

export function useScale() {
  function scaleIn(target, vars = {}) {
    if (!target || reducedMotion()) return null
    return gsap.from(target, {
      scale: 0,
      opacity: 0,
      duration: vars.duration || MOTION.card,
      ease: vars.ease || MOTION.ease.primary,
      ...vars
    })
  }

  return { scaleIn }
}

export function useSlide() {
  function slideIn(target, vars = {}) {
    if (!target || reducedMotion()) return null
    const direction = vars.direction || 'up'
    const distance = vars.distance || mobileScale(MOTION.yDistance)
    const axis = { up: { y: distance }, down: { y: -distance }, left: { x: distance }, right: { x: -distance } }
    return gsap.from(target, {
      opacity: 0,
      duration: vars.duration || MOTION.normal,
      ease: vars.ease || MOTION.ease.primary,
      ...axis[direction],
      ...vars
    })
  }

  return { slideIn }
}
