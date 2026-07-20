<script setup>
import { SOCIAL_PLATFORMS } from '@/dashboard/modules/team/utils/helpers'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:modelValue'])

const icons = {
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 11-2.06-2.06 2.06 2.06 0 012.06 2.06zM7.12 20.45H3.55V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.19.69.8.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>',
  behance:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.58 7.25c.76 0 1.5.1 2.1.4.6.27 1.1.7 1.44 1.24.35.55.52 1.24.52 2.07 0 .83-.2 1.5-.6 2.03-.4.52-.98.9-1.72 1.13.96.18 1.68.6 2.16 1.24.48.65.72 1.46.72 2.44 0 .92-.2 1.68-.6 2.27-.4.6-.96 1.04-1.68 1.32-.72.27-1.55.41-2.48.41H1V7.25h7.58zm-.4 5.54c.68 0 1.2-.17 1.56-.5.37-.34.55-.85.55-1.53 0-.65-.17-1.11-.5-1.4-.34-.3-.83-.44-1.48-.44H3.86v3.87h4.32zm.2 6.02c.74 0 1.3-.16 1.68-.5.38-.33.57-.85.57-1.55 0-.65-.18-1.12-.54-1.42-.36-.3-.88-.45-1.56-.45H3.86v3.92h4.52zM16.06 17.6c.4.42.97.63 1.7.63.62 0 1.1-.17 1.43-.5.33-.34.48-.78.43-1.3h2.28c-.2 1.42-.76 2.43-1.68 3.03-.92.6-2.05.9-3.38.9-1.04 0-1.95-.2-2.71-.6-.77-.4-1.36-1-1.77-1.73-.4-.74-.6-1.6-.6-2.57 0-.96.2-1.8.6-2.54.4-.73 1-1.31 1.76-1.72.77-.42 1.65-.62 2.65-.62 1.16 0 2.13.27 2.9.82.78.55 1.32 1.34 1.6 2.37.27 1.02.24 2.1-.08 3.25h-5.7c0 .98.32 1.74.93 2.26zm.94-5.5c-.48 0-.86.13-1.13.4-.27.27-.45.65-.52 1.14h3.2c-.04-.5-.2-.88-.5-1.15-.3-.27-.7-.4-1.05-.4zm2.93-3.62v1.57h-4.46V8.48h4.46z"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.69l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.13 4.13H5.1l11.98 15.64z"/></svg>',
}

function update(key, val) {
  emit('update:modelValue', { ...props.modelValue, [key]: val })
}
</script>

<template>
  <div class="social">
    <div v-for="p in SOCIAL_PLATFORMS" :key="p.key" class="social__field">
      <span class="social__icon" v-html="icons[p.key]" />
      <input
        :value="modelValue[p.key] || ''"
        type="url"
        dir="ltr"
        :placeholder="p.label + ' URL'"
        @input="update(p.key, $event.target.value)"
      />
    </div>
  </div>
</template>

<style scoped>
.social { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.social__field { position: relative; display: flex; align-items: center; }
.social__icon {
  position: absolute; inset-inline-start: 11px; width: 18px; height: 18px; color: var(--ds-text-muted);
}
.social__icon :deep(svg) { width: 100%; height: 100%; }
.social__field input {
  width: 100%; padding: 10px 38px; border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm); background: var(--ds-surface-2);
  color: var(--ds-text); font-size: 13.5px; outline: none;
}
.social__field input:focus { border-color: var(--ds-primary); }

@media (max-width: 560px) {
  .social { grid-template-columns: 1fr; }
}
</style>
