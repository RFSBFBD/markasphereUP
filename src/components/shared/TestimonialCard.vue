<template>
  <div class="testimonial-card" ref="cardRef">
    <div class="testimonial-card__accent card-glow"></div>
    <div class="testimonial-card__quote-mark">"</div>
    <blockquote class="testimonial-card__quote">
      {{ locale === 'ar' ? testimonial.reviewAr : testimonial.reviewEn }}
    </blockquote>
    <div class="testimonial-card__author">
      <div class="testimonial-card__avatar">
        {{ testimonial.clientName.charAt(0) }}
      </div>
      <div class="testimonial-card__info">
        <p class="testimonial-card__name">{{ testimonial.clientName }}</p>
        <p class="testimonial-card__role">{{ testimonial.role }}, {{ testimonial.company }}</p>
      </div>
    </div>
    <div class="testimonial-card__stars">
      <svg v-for="s in 5" :key="s" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import { useReveal } from '@/composables/animations/useMotionSystem'
import { MOTION } from '@/composables/animations/motion.config'
import gsap from 'gsap'

const props = defineProps({
  testimonial: { type: Object, required: true },
  locale: { type: String, default: 'ar' }
})

const { cardHover } = useHoverSystem()
const { reveal } = useReveal()
const cardRef = ref(null)

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    if (cardRef.value) {
      reveal(cardRef.value, {
        opacity: 0,
        y: 24,
        duration: MOTION.card,
        ease: MOTION.ease.primary
      })
      cardHover(cardRef.value, {
        lift: -8,
        shadowLift: '0 20px 56px rgba(0, 0, 0, 0.15)'
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
