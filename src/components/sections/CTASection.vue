<template>
  <BaseSection>
    <div class="cta" ref="ctaRef">
      <div class="cta__bg">
        <div class="cta__gradient" ref="bgGradient"></div>
        <div class="cta__noise"></div>
        <div class="cta__orbs">
          <div class="cta__orb cta__orb--1"></div>
          <div class="cta__orb cta__orb--2"></div>
        </div>
      </div>

      <div class="cta__content">
        <div class="cta__header" ref="headerGroup">
          <h2 class="cta__title">
            {{ t('cta.title1') }}
            <span>{{ t('cta.title2') }}</span>
          </h2>
          <p class="cta__desc">
            {{ t('cta.description') }}
          </p>
          <div class="cta__actions" ref="actionsRef">
            <a :href="whatsappLink" target="_blank" rel="noopener" class="cta__btn cta__btn--primary" ref="btnPrimary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {{ t('cta.ctaWhatsapp') }}
            </a>
            <a href="#portfolio" class="cta__btn cta__btn--outline" ref="btnOutline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              {{ t('cta.ctaWork') }}
            </a>
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
import { useScrollReveal, useStagger, useParallaxSystem } from '@/composables/animations/useMotionSystem'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import { useWhatsApp } from '@/composables/services/useWhatsApp'
import { MOTION } from '@/composables/animations/motion.config'
import gsap from 'gsap'
import '@/styles/sections/cta.css'

const { t, locale } = useI18n()
const { headerReveal } = useScrollReveal()
const { stagger } = useStagger()
const { buttonHover } = useHoverSystem()
const { parallaxBg } = useParallaxSystem()
const { buildLink } = useWhatsApp()

const whatsappLink = buildLink('', locale.value)

const ctaRef = ref(null)
const headerGroup = ref(null)
const actionsRef = ref(null)
const btnPrimary = ref(null)
const btnOutline = ref(null)
const bgGradient = ref(null)

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    headerReveal(headerGroup.value)
    parallaxBg(bgGradient.value, 0.2)
    if (btnPrimary.value) buttonHover(btnPrimary.value)
    if (btnOutline.value) buttonHover(btnOutline.value)
    if (actionsRef.value) {
      stagger(actionsRef.value.querySelectorAll('.cta__btn'), {
        opacity: 0,
        y: 20,
        duration: MOTION.button,
        stagger: MOTION.stagger,
        delay: 0.3,
        ease: MOTION.ease.primary
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
