<template>
  <BaseSection>
    <div class="section6">
      <div class="section6__header" ref="headerRef">
        <p class="section6__tag">{{ t('testimonials.tag') }}</p>
        <h2 class="section6__title">{{ t('testimonials.title') }}</h2>
      </div>

      <div class="testimonials__slider" ref="sliderRef">
        <button
          class="testimonials__nav testimonials__nav--prev"
          @click="slidePrev"
          aria-label="Previous testimonials"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div class="testimonials__track" ref="trackRef">
          <div
            class="portfolio-card"
            v-for="item in testimonials"
            :key="item.id"
          >
            <TestimonialCard
              :testimonial="item"
              :locale="locale"
            />
          </div>
        </div>

        <button
          class="testimonials__nav testimonials__nav--next"
          @click="slideNext"
          aria-label="Next testimonials"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import TestimonialCard from '@/components/shared/TestimonialCard.vue'
import { testimonials } from '@/data/site/testimonials'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { createSlider } from '@/composables/services/PortfolioSlider'
import { getSliderSpeed } from '@/composables/services/slider.config'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import '@/styles/sections/testimonials.css'

const { t, locale } = useI18n()
const { headerReveal } = useScrollReveal()
const { cardHover } = useHoverSystem()

const slider = createSlider()
const { slideNext, slidePrev } = slider

const headerRef = ref(null)
const sliderRef = ref(null)
const trackRef = ref(null)

onMounted(() => {
  headerReveal(headerRef.value)
  slider.init(trackRef.value, sliderRef.value, getSliderSpeed('testimonials'), (clone) => {
    cardHover(clone)
  })
})

onUnmounted(() => {
  slider.destroy()
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
</style>
