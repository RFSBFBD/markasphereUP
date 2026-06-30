<template>
  <component
    :is="tag"
    :class="['base-heading', `base-heading--${variant}`]"
    :style="headingStyle"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'h2',
    validator: v => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].includes(v)
  },
  variant: {
    type: String,
    default: 'h2',
    validator: v => ['display-xl', 'display-lg', 'display-md', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'small', 'caption'].includes(v)
  },
  font: {
    type: String,
    default: 'display-ar',
    validator: v => ['display-ar', 'display-en', 'body-ar', 'body-en', 'ar-h1', 'ar-h2', 'ar-h3', 'ar-body', 'en-h1', 'en-h2', 'en-h3', 'en-body'].includes(v)
  },
  weight: {
    type: String,
    default: null,
    validator: v => v === null || ['regular', 'medium', 'semibold', 'bold', 'black'].includes(v)
  }
})

const fontMap = {
  'display-ar': 'var(--font-display-ar)',
  'display-en': 'var(--font-display-en)',
  'body-ar': 'var(--font-body-ar)',
  'body-en': 'var(--font-body-en)',
  'ar-h1': 'var(--font-ar-h1)',
  'ar-h2': 'var(--font-ar-h2)',
  'ar-h3': 'var(--font-ar-h3)',
  'ar-body': 'var(--font-ar-body)',
  'en-h1': 'var(--font-en-h1)',
  'en-h2': 'var(--font-en-h2)',
  'en-h3': 'var(--font-en-h3)',
  'en-body': 'var(--font-en-body)'
}

const weightMap = {
  'regular': 'var(--weight-regular)',
  'medium': 'var(--weight-medium)',
  'semibold': 'var(--weight-semibold)',
  'bold': 'var(--weight-bold)',
  'black': 'var(--weight-black)'
}

const headingStyle = computed(() => ({
  fontFamily: fontMap[props.font],
  ...(props.weight ? { fontWeight: weightMap[props.weight] } : {})
}))
</script>

<style scoped>
.base-heading {
  margin: 0;
  padding: 0;
}

.base-heading--display-xl { font-size: var(--text-display-xl); line-height: var(--lh-display); }
.base-heading--display-lg { font-size: var(--text-display-lg); line-height: var(--lh-display); }
.base-heading--display-md { font-size: var(--text-display-md); line-height: var(--lh-display); }
.base-heading--h1 { font-size: var(--text-h1); line-height: var(--lh-heading); }
.base-heading--h2 { font-size: var(--text-h2); line-height: var(--lh-heading); }
.base-heading--h3 { font-size: var(--text-h3); line-height: var(--lh-heading); }
.base-heading--h4 { font-size: var(--text-h4); line-height: var(--lh-heading); }
.base-heading--body-lg { font-size: var(--text-body-lg); line-height: var(--lh-body); }
.base-heading--body { font-size: var(--text-body); line-height: var(--lh-body); }
.base-heading--small { font-size: var(--text-small); }
.base-heading--caption { font-size: var(--text-caption); }
</style>
