<template>
  <component
    :is="tag"
    :class="['base-subtitle', `base-subtitle--${size}`, alignClass]"
    :style="subtitleStyle"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: v => ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].includes(v)
  },
  size: {
    type: String,
    default: 'body-lg',
    validator: v => ['h3', 'h4', 'body-lg', 'body', 'small'].includes(v)
  },
  font: {
    type: String,
    default: null,
    validator: v => v === null || ['display-ar', 'display-en', 'body-ar', 'body-en', 'ar-h1', 'ar-h2', 'ar-h3', 'ar-body', 'en-h1', 'en-h2', 'en-h3', 'en-body'].includes(v)
  },
  weight: {
    type: String,
    default: null,
    validator: v => v === null || ['regular', 'medium', 'semibold', 'bold', 'black'].includes(v)
  },
  align: {
    type: String,
    default: null,
    validator: v => v === null || ['start', 'center', 'end'].includes(v)
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

const subtitleStyle = computed(() => ({
  ...(props.font ? { fontFamily: fontMap[props.font] } : {}),
  ...(props.weight ? { fontWeight: weightMap[props.weight] } : {})
}))

const alignClass = computed(() => props.align ? `base-subtitle--align-${props.align}` : null)
</script>

<style scoped>
.base-subtitle {
  margin: 0;
  padding: 0;
  color: var(--color-text-muted);
}

.base-subtitle--h3 { font-size: var(--text-h3); line-height: var(--lh-heading); }
.base-subtitle--h4 { font-size: var(--text-h4); line-height: var(--lh-heading); }
.base-subtitle--body-lg { font-size: var(--text-body-lg); line-height: var(--lh-body); }
.base-subtitle--body { font-size: var(--text-body); line-height: var(--lh-body); }
.base-subtitle--small { font-size: var(--text-small); line-height: var(--lh-body); }

.base-subtitle--align-start { text-align: start; }
.base-subtitle--align-center { text-align: center; }
.base-subtitle--align-end { text-align: end; }
</style>
