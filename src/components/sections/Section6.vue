<template>
  <BaseSection>
    <div class="section6">
      <div class="section6__header" ref="headerRef">
        <p class="section6__tag">{{ t('testimonials.tag') }}</p>
        <h2 class="section6__title">{{ t('testimonials.title') }}</h2>
      </div>

      <div v-if="!testimonials.length" class="section6__state">{{ t('testimonials.empty') }}</div>

      <div v-else class="testimonials__viewport" ref="viewportRef">
        <div class="testimonials__track" ref="trackRef">
          <div
            class="portfolio-card"
            v-for="item in loopItems"
            :key="item.__key"
          >
            <TestimonialCard
              :testimonial="item"
              :locale="locale"
            />
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import TestimonialCard from '@/components/shared/TestimonialCard.vue'
import { SITE, loadSiteSettings } from '@/components/constants/site'
import { testimonials as testimonialsFallback } from '@/data/site/testimonials'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import gsap from 'gsap'
import '@/styles/sections/testimonials.css'

const { t, locale } = useI18n()
const { headerReveal } = useScrollReveal()
const { cardHover } = useHoverSystem()

const headerRef = ref(null)
const viewportRef = ref(null)
const trackRef = ref(null)

const testimonials = computed(() => {
  const db = SITE.testimonials
  return Array.isArray(db) && db.length ? db : testimonialsFallback
})

// Duplicate the list so the marquee can loop seamlessly.
const loopItems = computed(() =>
  testimonials.value.concat(testimonials.value).map((item, i) => ({ ...item, __key: i }))
)

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

let cleanup = null

function startMarquee() {
  const track = trackRef.value
  const viewport = viewportRef.value
  if (!track || !viewport || track.children.length === 0) return

  const setX = gsap.quickSetter(track, 'x', 'px')
  let x = 0
  let paused = false
  let inView = true
  let observer = null
  const speed = 0.55 // px per frame — very slow, luxurious

  function onEnter() { paused = true }
  function onLeave() { paused = false }

  viewport.addEventListener('mouseenter', onEnter)
  viewport.addEventListener('mouseleave', onLeave)
  viewport.addEventListener('focusin', onEnter)
  viewport.addEventListener('focusout', onLeave)

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting)
    }, { rootMargin: '120px 0px' })
    observer.observe(viewport)
  }

  requestAnimationFrame(() => {
    const halfWidth = track.scrollWidth / 2
    if (halfWidth <= 0) return
    setX(0)

    function update() {
      if (paused || !inView) return
      x -= speed * gsap.ticker.deltaRatio()
      if (x <= -halfWidth) x += halfWidth
      setX(x)
    }

    gsap.ticker.add(update)

    cleanup = () => {
      gsap.ticker.remove(update)
      if (observer) observer.disconnect()
      viewport.removeEventListener('mouseenter', onEnter)
      viewport.removeEventListener('mouseleave', onLeave)
      viewport.removeEventListener('focusin', onEnter)
      viewport.removeEventListener('focusout', onLeave)
      gsap.set(track, { x: 0 })
    }
  })
}

function init() {
  if (prefersReducedMotion) return
  headerReveal(headerRef.value)
  if (trackRef.value) {
    ;[...trackRef.value.children].forEach((el) => {
      const card = el.querySelector('.testimonial-card')
      if (card) cardHover(card)
    })
  }
  startMarquee()
}

onMounted(async () => {
  await loadSiteSettings()
  if (testimonials.value.length) {
    await nextTick()
    init()
  }
})

watch(testimonials, async (list) => {
  if (!list.length) return
  await nextTick()
  if (cleanup) { cleanup(); cleanup = null }
  init()
})

onUnmounted(() => {
  if (cleanup) cleanup()
})
</script>

<style scoped>
.section6__header {
  text-align: center;
  margin-bottom: var(--space-3xl);
}

.section6__tag {
  font-family: var(--font-en-body);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.section6__title {
  font-family: var(--font-ar-h2);
  font-weight: 600;
  font-size: var(--text-display-lg);
  line-height: var(--lh-heading);
  color: var(--color-text);
}

@media (max-width: 640px) {
  .section6__title { font-size: var(--text-h2); }
}

.section6__state {
  text-align: center;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  padding: var(--space-3xl) 0;
}

.testimonials__viewport {
  overflow: hidden;
  width: 100%;
  direction: ltr;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}

.testimonials__track {
  display: flex;
  align-items: stretch;
  width: max-content;
  gap: var(--space-lg);
  will-change: transform;
}

.testimonials__track .portfolio-card {
  width: 400px;
}

@media (max-width: 1024px) {
  .testimonials__track .portfolio-card { width: 340px; }
}

@media (max-width: 640px) {
  .testimonials__track .portfolio-card { width: 280px; }
}
</style>
