<template>
  <section class="hero">
    <div class="hero__bg">
      <div class="hero__gradient" ref="bgGradient"></div>
      <div class="hero__noise"></div>
      <div class="hero__grid-lines">
        <span v-for="i in 6" :key="i"></span>
      </div>
    </div>

    <div class="container hero__content">
      <p ref="tag" class="hero__tag">
        <span class="hero__tag-dot"></span>
        {{ t('hero.tag') }}
      </p>

      <h1 ref="title" class="hero__title">
        <span class="hero__title-line" ref="line1">{{ t('hero.title1') }}</span>
        <span class="hero__title-line hero__title-line--accent" ref="line2">
          {{ t('hero.title2') }}
        </span>
        <span class="hero__title-line" ref="line3">{{ t('hero.title3') }}</span>
      </h1>

      <p ref="desc" class="hero__desc">
        {{ t('hero.description') }}
      </p>

      <div ref="actions" class="hero__actions">
        <a :href="whatsappLink" target="_blank" rel="noopener" class="hero__btn hero__btn--primary" ref="btnPrimary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span>{{ t('hero.ctaWhatsapp') }}</span>
        </a>
        <a href="#portfolio" class="hero__btn hero__btn--outline" ref="btnOutline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span>{{ t('hero.ctaWork') }}</span>
        </a>
      </div>

      <div ref="clients" class="hero__clients">
        <span class="hero__clients-label">{{ t('hero.clients') }}</span>
        <div class="hero__clients-avatars">
          <div class="hero__client-avatar" v-for="i in 4" :key="i" :style="{ zIndex: 5 - i }">
            {{ ['A', 'B', 'C', 'D'][i-1] }}
          </div>
          <span class="hero__clients-count">{{ t('hero.clientsCount') }}</span>
        </div>
      </div>
    </div>

    <div ref="scrollIndicator" class="hero__scroll">
      <span>Scroll</span>
      <div class="hero__scroll-line"></div>
    </div>

    <div class="hero__side-text">
      <span>MarkaSphere © 2025</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParallaxSystem } from '@/composables/animations/useMotionSystem'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import { useWhatsApp } from '@/composables/services/useWhatsApp'
import { MOTION } from '@/composables/animations/motion.config'
import gsap from 'gsap'

const { t } = useI18n()

const { buttonHover } = useHoverSystem()
const { parallaxBg } = useParallaxSystem()
const { buildLink } = useWhatsApp()

const whatsappLink = buildLink()

const tag = ref(null)
const line1 = ref(null)
const line2 = ref(null)
const line3 = ref(null)
const desc = ref(null)
const actions = ref(null)
const clients = ref(null)
const scrollIndicator = ref(null)
const btnPrimary = ref(null)
const btnOutline = ref(null)
const bgGradient = ref(null)

let ctx = null

onMounted(() => {
  const isMobile = window.innerWidth <= 640
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ctx = gsap.context(() => {
    if (bgGradient.value) {
      gsap.from(bgGradient.value, {
        scale: 1.15,
        opacity: 0,
        duration: reducedMotion ? 0.3 : MOTION.hero,
        ease: MOTION.ease.primary
      })
    }

    if (!reducedMotion) {
      const tl = gsap.timeline({
        defaults: { ease: MOTION.ease.strong }
      })

      if (tag.value) {
        tl.from(tag.value, {
          clipPath: 'inset(0 100% 0 0)',
          duration: isMobile ? 0.4 : MOTION.hero * 0.6,
          ease: MOTION.ease.strong
        }, isMobile ? 0.1 : 0.15)
      }

      const lines = [line1.value, line2.value, line3.value].filter(Boolean)
      if (lines.length) {
        tl.from(lines, {
          clipPath: 'inset(0 0 100% 0)',
          y: isMobile ? 20 : 40,
          duration: isMobile ? 0.4 : MOTION.hero,
          stagger: isMobile ? 0.06 : MOTION.stagger,
          ease: MOTION.ease.strong
        }, isMobile ? 0.2 : 0.3)
      }

      if (desc.value) {
        tl.from(desc.value, {
          y: isMobile ? 15 : 30,
          opacity: 0,
          duration: isMobile ? 0.35 : MOTION.normal,
          ease: MOTION.ease.primary
        }, isMobile ? 0.5 : 0.7)
      }

      if (actions.value) {
        tl.from(actions.value.children, {
          scale: 0.92,
          opacity: 0,
          duration: isMobile ? 0.3 : MOTION.button,
          stagger: isMobile ? 0.05 : MOTION.staggerTight,
          ease: MOTION.ease.strong
        }, isMobile ? 0.6 : 0.9)
      }

      if (clients.value) {
        tl.from(clients.value, {
          y: isMobile ? 10 : 20,
          opacity: 0,
          duration: isMobile ? 0.3 : MOTION.fast,
          ease: MOTION.ease.primary
        }, isMobile ? 0.7 : 1.1)
      }

      if (scrollIndicator.value && !isMobile) {
        tl.from(scrollIndicator.value, {
          opacity: 0,
          y: 12,
          duration: MOTION.fast,
          ease: MOTION.ease.strong
        }, 1.3)
      }
    }

    parallaxBg(bgGradient.value, 0.3)

    if (btnPrimary.value) buttonHover(btnPrimary.value)
    if (btnOutline.value) buttonHover(btnOutline.value)
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__gradient {
  width: 100%;
  height: 100%;
  background: var(--gradient-hero);
  will-change: transform;
}

.hero__noise {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  opacity: 0.4;
}

.hero__grid-lines {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10%;
  pointer-events: none;
}

.hero__grid-lines span {
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
}

.hero__content {
  position: relative;
  z-index: 1;
  padding-top: calc(88px + var(--space-3xl));
  padding-bottom: var(--space-5xl);
  width: 100%;
}

.hero__tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-en-body);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-lg);
}

.hero__tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.hero__title {
  font-family: var(--font-ar-h1);
  font-weight: 800;
  font-size: var(--text-display-xl);
  line-height: 1.15;
  letter-spacing: var(--ls-display);
  color: #fff;
  margin-bottom: var(--space-xl);
}

.hero__title-line { display: block; }
.hero__title-line + .hero__title-line { margin-top: 0.1em; }

.hero__title-line--accent {
  color: var(--color-accent);
  position: relative;
}

.hero__title-line--accent::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-accent);
  opacity: 0.3;
  border-radius: var(--radius-none);
}

.hero__desc {
  font-family: var(--font-en-body);
  font-weight: 400;
  font-size: var(--text-body-lg);
  line-height: var(--lh-body);
  color: rgba(255, 255, 255, 0.6);
  max-width: 560px;
  margin-bottom: var(--space-2xl);
}

.hero__actions {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  flex-wrap: wrap;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  height: 56px;
  padding-inline: 32px;
  border-radius: var(--radius-sm);
  font-family: var(--font-ar-body);
  font-size: var(--text-body);
  font-weight: 500;
  transition: box-shadow var(--duration-normal) var(--ease-primary),
              border-color var(--duration-normal) var(--ease-primary),
              background var(--duration-normal) var(--ease-primary),
              transform var(--duration-normal) var(--ease-primary);
  cursor: pointer;
  will-change: transform;
  text-decoration: none;
}

.hero__btn:active {
  transform: scale(0.97);
}

.hero__btn--primary {
  background: var(--gradient-accent);
  color: #fff;
  box-shadow: var(--shadow-btn-accent);
}

.hero__btn--primary:hover {
  box-shadow: var(--shadow-btn-accent-hover);
}

.hero__btn--primary svg {
  transition: transform var(--duration-fast) var(--ease-primary);
}

.hero__btn--primary:hover svg {
  transform: scale(1.1);
}

.hero__btn--outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.hero__btn--outline:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.hero__clients {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-top: var(--space-3xl);
}

.hero__clients-label {
  font-family: var(--font-body-ar);
  font-size: var(--text-small);
  color: rgba(255, 255, 255, 0.4);
}

.hero__clients-avatars {
  display: flex;
  align-items: center;
}

.hero__client-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gradient-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid var(--color-primary);
  margin-inline-start: -8px;
}

.hero__client-avatar:first-child { margin-inline-start: 0; }

.hero__clients-count {
  margin-inline-start: var(--space-sm);
  font-family: var(--font-body-en);
  font-size: var(--text-small);
  color: var(--color-accent);
}

.hero__scroll {
  position: absolute;
  bottom: 40px;
  inset-inline-end: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  color: rgba(255, 255, 255, 0.4);
  font-size: var(--text-caption);
  font-family: var(--font-body-en);
}

.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
}

.hero__scroll-line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-accent);
  animation: scrollLine 1.8s ease-in-out infinite;
}

@keyframes scrollLine {
  0% { top: -100%; }
  50% { top: 0; }
  100% { top: 100%; }
}

.hero__side-text {
  position: absolute;
  bottom: 40px;
  inset-inline-start: 40px;
  z-index: 1;
}

.hero__side-text span {
  font-family: var(--font-body-en);
  font-size: var(--text-caption);
  color: rgba(255, 255, 255, 0.25);
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

@media (max-width: 1024px) {
  .hero__content { padding-top: calc(88px + var(--space-2xl)); padding-bottom: 80px; }
  .hero__title { font-size: var(--text-display-lg); }
}

@media (max-width: 768px) {
  .hero__content { padding-top: calc(88px + var(--space-xl)); padding-bottom: 60px; }
  .hero__title { font-size: var(--text-display-md); margin-bottom: var(--space-lg); }
  .hero__desc { font-size: var(--text-body); max-width: 100%; }
  .hero__actions { gap: var(--space-md); }
}

@media (max-width: 640px) {
  .hero__content { padding-top: calc(80px + var(--space-lg)); padding-bottom: 50px; }
  .hero__title { font-size: 32px; margin-bottom: var(--space-md); }
  .hero__desc { margin-bottom: var(--space-xl); }
  .hero__scroll { display: none; }
  .hero__side-text { display: none; }
  .hero__actions { flex-direction: column; align-items: stretch; gap: var(--space-sm); }
  .hero__btn { justify-content: center; height: 50px; padding-inline: 24px; font-size: var(--text-small); }
  .hero__btn:active { transform: scale(0.97); }
  .hero__clients { flex-direction: column; align-items: flex-start; gap: var(--space-sm); margin-top: var(--space-2xl); }
  .hero__grid-lines { display: none; }
  .hero__tag { margin-bottom: var(--space-md); }
}
</style>
