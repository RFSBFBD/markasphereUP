<template>
  <BaseSection>
    <div class="partners">
      <div class="partners__header" ref="headerRef">
        <p class="partners__tag">{{ t('partners.tag') }}</p>
        <h2 class="partners__title">{{ t('partners.title') }}</h2>
        <p class="partners__subtitle">
          {{ t('partners.subtitle') }}
        </p>
      </div>

      <div class="partners__viewport">
        <div class="partners__grid" ref="gridRef" role="list">
          <div
            class="partners__item"
            v-for="(partner, i) in partners"
            :key="partner.id"
            role="listitem"
            tabindex="0"
          >
            <div class="partners__logo">
              <span class="partners__name">{{ partner.companyName }}</span>
            </div>
            <div class="partners__accent-line" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import { partners } from '@/data/site/partners'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { MOTION } from '@/composables/animations/motion.config'
import { getSliderSpeed } from '@/composables/services/slider.config'
import gsap from 'gsap'
import '@/styles/sections/partners.css'

const { t } = useI18n()
const { headerReveal } = useScrollReveal()

const headerRef = ref(null)
const gridRef = ref(null)

let cleanupMarquee = null
let ctx = null

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function applyItemHover(item) {
  const name = item.querySelector('.partners__name')
  const line = item.querySelector('.partners__accent-line')
  if (!name || !line) return

  function activate() {
    gsap.to(name, { opacity: 1, color: '#1a1a1a', filter: 'grayscale(0%)', scale: 1.03, duration: MOTION.hover, ease: MOTION.ease.primary })
    gsap.to(line, { width: '100%', duration: MOTION.hover, ease: MOTION.ease.primary })
  }

  function deactivate() {
    gsap.to(name, { opacity: 0.5, color: '#888', filter: 'grayscale(100%)', scale: 1, duration: MOTION.hover, ease: MOTION.ease.primary })
    gsap.to(line, { width: '0%', duration: MOTION.hover, ease: MOTION.ease.primary })
  }

  item.addEventListener('mouseenter', activate)
  item.addEventListener('mouseleave', deactivate)
  item.addEventListener('focus', activate)
  item.addEventListener('blur', deactivate)

  return { activate, deactivate }
}

function initMarquee() {
  const el = gridRef.value
  if (!el || el.children.length === 0) return

  const items = [...el.children]
  const speed = getSliderSpeed('partners')
  const cloneHandlers = []

  items.forEach(item => {
    const clone = item.cloneNode(true)
    const handlers = applyItemHover(clone)
    if (handlers) cloneHandlers.push({ el: clone, ...handlers })
    el.appendChild(clone)
  })

  const setX = gsap.quickSetter(el, 'x', 'px')
  let x = 0
  let paused = false
  let scrolling = false
  let inView = true
  let resumeTimeout = null
  let scrollResumeTimeout = null
  let observer = null

  function pauseMarquee() {
    paused = true
    if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null }
  }

  function scheduleResume(delay) {
    if (resumeTimeout) clearTimeout(resumeTimeout)
    resumeTimeout = setTimeout(() => { paused = false; resumeTimeout = null }, delay)
  }

  const onEnter = () => pauseMarquee()
  const onLeave = () => scheduleResume(500)
  const onFocusIn = () => pauseMarquee()
  const onFocusOut = (e) => { if (!el.contains(e.relatedTarget)) scheduleResume(500) }
  const onWindowScroll = () => {
    scrolling = true
    if (scrollResumeTimeout) clearTimeout(scrollResumeTimeout)
    scrollResumeTimeout = setTimeout(() => {
      scrolling = false
      scrollResumeTimeout = null
    }, 180)
  }

  el.addEventListener('mouseenter', onEnter)
  el.addEventListener('mouseleave', onLeave)
  el.addEventListener('focusin', onFocusIn)
  el.addEventListener('focusout', onFocusOut)
  window.addEventListener('scroll', onWindowScroll, { passive: true })

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      inView = entries.some(entry => entry.isIntersecting)
    }, { rootMargin: '120px 0px' })
    observer.observe(el.parentElement || el)
  }

  requestAnimationFrame(() => {
    const setWidth = el.scrollWidth / 2
    if (setWidth <= 0) return
    x = 0
    setX(0)

    function update() {
      if (paused || scrolling || !inView) return
      x -= speed * gsap.ticker.deltaRatio()
      if (x <= -setWidth) x += setWidth
      setX(x)
    }

    gsap.ticker.add(update)

    cleanupMarquee = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout)
      if (scrollResumeTimeout) clearTimeout(scrollResumeTimeout)
      if (observer) observer.disconnect()
      gsap.ticker.remove(update)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
      window.removeEventListener('scroll', onWindowScroll)
      cloneHandlers.forEach(({ el: cloneEl, activate, deactivate }) => {
        cloneEl.removeEventListener('mouseenter', activate)
        cloneEl.removeEventListener('mouseleave', deactivate)
        cloneEl.removeEventListener('focus', activate)
        cloneEl.removeEventListener('blur', deactivate)
      })
      cloneHandlers.length = 0
      gsap.set(el, { x: 0 })
      const all = [...el.children]
      const half = Math.floor(all.length / 2)
      for (let i = all.length - 1; i >= half; i--) {
        all[i].remove()
      }
    }
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    headerReveal(headerRef.value)

    ;[...gridRef.value.children].forEach(applyItemHover)

    if (!prefersReducedMotion) initMarquee()
  })
})

onUnmounted(() => {
  if (cleanupMarquee) cleanupMarquee()
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.partners { text-align: center; }

.partners__header { margin-bottom: var(--space-4xl); }

.partners__tag {
  font-family: var(--font-en-body);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.partners__title {
  font-family: var(--font-ar-h2);
  font-weight: 600;
  font-size: var(--text-display-lg);
  line-height: var(--lh-heading);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.partners__subtitle {
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  max-width: 480px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .partners__title { font-size: var(--text-h2); }
}
</style>
