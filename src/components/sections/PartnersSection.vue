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

      <div v-if="!partners.length" class="partners__state">{{ t('partners.empty') }}</div>

      <div v-else class="partners__marquee">
        <div class="partners__row" ref="row1Viewport">
          <div class="partners__track" ref="row1Ref" role="list">
            <div
              class="partners__item"
              v-for="(partner, i) in row1Items"
              :key="'r1-' + partner.id + '-' + i"
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

        <div class="partners__row" ref="row2Viewport">
          <div class="partners__track partners__track--reverse" ref="row2Ref" role="list">
            <div
              class="partners__item"
              v-for="(partner, i) in row2Items"
              :key="'r2-' + partner.id + '-' + i"
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
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import { SITE, loadSiteSettings } from '@/components/constants/site'
import { partners as partnersFallback } from '@/data/site/partners'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { MOTION } from '@/composables/animations/motion.config'
import { getSliderSpeed } from '@/composables/services/slider.config'
import gsap from 'gsap'
import '@/styles/sections/partners.css'

const { t } = useI18n()
const { headerReveal } = useScrollReveal()

const headerRef = ref(null)
const row1Ref = ref(null)
const row2Ref = ref(null)
const row1Viewport = ref(null)
const row2Viewport = ref(null)

const partners = computed(() => {
  const db = SITE.partners
  return Array.isArray(db) && db.length ? db : partnersFallback
})

// Split into two rows for opposite-direction marquees.
const row1Items = computed(() => {
  const list = partners.value
  const half = Math.ceil(list.length / 2)
  return list.slice(0, half).concat(list.slice(0, half))
})
const row2Items = computed(() => {
  const list = partners.value
  const half = Math.ceil(list.length / 2)
  return list.slice(half).concat(list.slice(half))
})

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

const cleanups = []

function applyItemHover(item) {
  const name = item.querySelector('.partners__name')
  const line = item.querySelector('.partners__accent-line')
  if (!name || !line) return
  const activate = () => {
    gsap.to(name, { opacity: 1, color: '#1a1a1a', filter: 'grayscale(0%)', scale: 1.03, duration: MOTION.hover, ease: MOTION.ease.primary })
    gsap.to(line, { width: '100%', duration: MOTION.hover, ease: MOTION.ease.primary })
  }
  const deactivate = () => {
    gsap.to(name, { opacity: 0.5, color: '#888', filter: 'grayscale(100%)', scale: 1, duration: MOTION.hover, ease: MOTION.ease.primary })
    gsap.to(line, { width: '0%', duration: MOTION.hover, ease: MOTION.ease.primary })
  }
  item.addEventListener('mouseenter', activate)
  item.addEventListener('mouseleave', deactivate)
  item.addEventListener('focus', activate)
  item.addEventListener('blur', deactivate)
}

function startRow(trackEl, viewportEl, direction) {
  if (!trackEl || !viewportEl || trackEl.children.length === 0) return
  const setX = gsap.quickSetter(trackEl, 'x', 'px')
  let x = direction === 'rtl' ? -(trackEl.scrollWidth / 2) : 0
  let paused = false
  let inView = true
  let observer = null
  const speed = getSliderSpeed('partners') * 0.5 // very slow, luxurious

  const onEnter = () => { paused = true }
  const onLeave = () => { paused = false }
  viewportEl.addEventListener('mouseenter', onEnter)
  viewportEl.addEventListener('mouseleave', onLeave)
  viewportEl.addEventListener('focusin', onEnter)
  viewportEl.addEventListener('focusout', onLeave)

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting)
    }, { rootMargin: '120px 0px' })
    observer.observe(viewportEl)
  }

  requestAnimationFrame(() => {
    const halfWidth = trackEl.scrollWidth / 2
    if (halfWidth <= 0) return
    setX(x)

    function update() {
      if (paused || !inView) return
      if (direction === 'rtl') {
        x += speed * gsap.ticker.deltaRatio()
        if (x >= 0) x -= halfWidth
      } else {
        x -= speed * gsap.ticker.deltaRatio()
        if (x <= -halfWidth) x += halfWidth
      }
      setX(x)
    }

    gsap.ticker.add(update)
    cleanups.push(() => {
      gsap.ticker.remove(update)
      if (observer) observer.disconnect()
      viewportEl.removeEventListener('mouseenter', onEnter)
      viewportEl.removeEventListener('mouseleave', onLeave)
      viewportEl.removeEventListener('focusin', onEnter)
      viewportEl.removeEventListener('focusout', onLeave)
      gsap.set(trackEl, { x: 0 })
    })
  })
}

function init() {
  headerReveal(headerRef.value)
  ;[row1Ref.value, row2Ref.value].forEach((track) => {
    if (!track) return
    ;[...track.children].forEach(applyItemHover)
  })
  if (prefersReducedMotion) return
  // Row 1: left -> right (rtl), Row 2: right -> left (ltr)
  startRow(row1Ref.value, row1Viewport.value, 'rtl')
  startRow(row2Ref.value, row2Viewport.value, 'ltr')
}

onMounted(async () => {
  await loadSiteSettings()
  if (partners.value.length) {
    await nextTick()
    init()
  }
})

watch(partners, async (list) => {
  if (!list.length) return
  await nextTick()
  cleanups.forEach((fn) => fn())
  cleanups.length = 0
  init()
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  cleanups.length = 0
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

.partners__state {
  text-align: center;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  padding: var(--space-3xl) 0;
}

.partners__marquee {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.partners__row {
  overflow: hidden;
  width: 100%;
  direction: ltr;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
}

.partners__track {
  display: flex;
  align-items: center;
  overflow: visible;
  width: max-content;
  gap: var(--space-lg);
  will-change: transform;
}

@media (max-width: 1024px) {
  .partners__item { width: 130px; padding: var(--space-lg) var(--space-md); }
}

@media (max-width: 640px) {
  .partners__item { width: 100px; padding: var(--space-md); }
  .partners__name { font-size: var(--text-caption); }
}
</style>
