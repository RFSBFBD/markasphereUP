<template>
  <div class="slider-wrapper" ref="wrapperRef">
    <button
      class="slider-btn slider-btn--prev"
      @click="$emit('prev')"
      :aria-label="prevLabel"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    <div class="slider-track" ref="trackRef">
      <slot/>
    </div>

    <button
      class="slider-btn slider-btn--next"
      @click="$emit('next')"
      :aria-label="nextLabel"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  prevLabel: { type: String, default: 'Previous' },
  nextLabel: { type: String, default: 'Next' }
})

defineEmits(['prev', 'next'])

const wrapperRef = ref(null)
const trackRef = ref(null)

defineExpose({ wrapperRef, trackRef })
</script>
