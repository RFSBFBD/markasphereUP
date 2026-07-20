<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
  >
    <div v-if="isOpen" class="mobile-menu" @click.self="$emit('close')" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div class="mobile-menu__panel">
        <nav class="mobile-menu__nav" aria-label="Mobile navigation">
          <RouterLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="mobile-menu__link"
            @click="$emit('close')"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <a :href="whatsappLink" target="_blank" rel="noopener" class="mobile-menu__cta" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          {{ t('mobileMenu.whatsapp') }}
        </a>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { useWhatsApp } from '@/composables/services/useWhatsApp'
import { MOTION } from '@/composables/animations/motion.config'
import { dirSign } from '@/composables/utils/direction'
import gsap from 'gsap'

const { t, locale } = useI18n()
const router = useRouter()

const props = defineProps({
  isOpen: Boolean,
  navigation: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const { buildLink } = useWhatsApp()
const whatsappLink = buildLink('', locale.value)

const lockScroll = () => {
  const scrollY = window.scrollY
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
}

const unlockScroll = () => {
  const top = parseInt(document.body.style.top || '0') * -1
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, top || 0)
}

watch(() => props.isOpen, (val) => {
  if (val) {
    lockScroll()
  } else {
    unlockScroll()
  }
})

watch(() => router.currentRoute.value.path, () => {
  if (props.isOpen) {
    emit('close')
  }
})

const onBeforeEnter = (el) => {
  const d = dirSign()
  gsap.set(el, { opacity: 0 })
  gsap.set(el.querySelector('.mobile-menu__panel'), { x: (100 * d) + '%' })
  gsap.set(el.querySelectorAll('.mobile-menu__link'), { opacity: 0, x: 20 * d })
}

const onEnter = (el, done) => {
  const tl = gsap.timeline({ onComplete: done })
  tl.to(el, { opacity: 1, duration: MOTION.button, ease: MOTION.ease.primary })
  tl.to(el.querySelector('.mobile-menu__panel'), { x: '0%', duration: MOTION.card * 0.6, ease: MOTION.ease.strong }, '-=0.1')
  tl.to(el.querySelectorAll('.mobile-menu__link'), { opacity: 1, x: 0, duration: MOTION.button, stagger: MOTION.staggerTight, ease: MOTION.ease.primary }, '-=0.25')
}

const onBeforeLeave = () => {}

const onLeave = (el, done) => {
  const d = dirSign()
  const tl = gsap.timeline({ onComplete: done })
  tl.to(el.querySelectorAll('.mobile-menu__link'), { opacity: 0, x: 20 * d, duration: MOTION.hover * 0.5, stagger: MOTION.staggerTight * 0.3, ease: MOTION.ease.inOut })
  tl.to(el.querySelector('.mobile-menu__panel'), { x: (100 * d) + '%', duration: MOTION.fast, ease: MOTION.ease.inOut }, '-=0.1')
  tl.to(el, { opacity: 0, duration: MOTION.hover * 0.6, ease: MOTION.ease.inOut }, '-=0.15')
}
</script>

<style scoped>
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.mobile-menu__panel {
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  width: min(320px, 85vw);
  height: 100%;
  background: var(--color-bg-alt);
  padding: calc(88px + var(--space-xl)) var(--space-xl) var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.mobile-menu__link {
  position: relative;
  font-family: var(--font-ar-h3);
  font-size: var(--text-h3);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  min-height: 48px;
  display: flex;
  align-items: center;
  padding-inline: var(--space-sm);
  padding-block: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: color var(--duration-fast) var(--ease-primary),
              padding var(--duration-fast) var(--ease-primary),
              background var(--duration-fast) var(--ease-primary);
}

.mobile-menu__link:hover {
  color: var(--color-text);
  background: var(--color-accent-hover);
  padding-inline-start: var(--space-lg);
}

.mobile-menu__link.router-link-exact-active {
  color: var(--color-accent);
  background: var(--color-accent-hover);
  font-weight: var(--weight-semibold);
  padding-inline-start: var(--space-lg);
}

.mobile-menu__link.router-link-exact-active::after {
  content: '';
  position: absolute;
  inset-inline-end: 0;
  width: 3px;
  height: 24px;
  background: var(--color-accent);
  border-radius: 2px;
}

.mobile-menu__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  height: 56px;
  border-radius: var(--radius-sm);
  background: var(--gradient-accent);
  color: #fff;
  font-family: var(--font-ar-body);
  font-size: var(--text-body);
  font-weight: var(--weight-medium);
  transition: transform var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.mobile-menu__cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-btn-accent-hover);
}
</style>
