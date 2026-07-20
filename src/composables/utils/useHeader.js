import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { MOTION, reducedMotion } from '@/composables/animations/motion.config'

export function useHeader() {
  const headerRef = ref(null)
  const isScrolled = ref(false)

  let rafId = null

  const updateScroll = () => {
    isScrolled.value = window.scrollY > 40
  }

  const onScroll = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(updateScroll)
  }

  const entrance = (el) => {
    headerRef.value = el
    if (!el || reducedMotion()) return
    gsap.from(el, {
      opacity: 0,
      duration: MOTION.fast,
      delay: 0.1,
      ease: MOTION.ease.primary,
      clearProps: 'opacity'
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    updateScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { headerRef, entrance, isScrolled }
}
