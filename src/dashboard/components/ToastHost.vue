<script setup>
import { useToast } from '@/dashboard/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="ds-toasts" aria-live="polite">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="ds-toast"
      :class="`is-${t.type}`"
      @click="dismiss(t.id)"
    >
      <span class="ds-toast__dot" />
      <span class="ds-toast__msg">{{ t.message }}</span>
    </div>
  </div>
</template>

<style scoped>
.ds-toasts {
  position: fixed;
  inset-block-end: 24px;
  inset-inline-start: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
  max-width: min(360px, calc(100vw - 32px));
}

.ds-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-inline-start: 4px solid var(--ds-primary);
  border-radius: var(--ds-radius-sm);
  padding: 12px 14px;
  box-shadow: var(--ds-shadow);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--ds-text);
  animation: ds-toast-in .18s ease;
}

.ds-toast__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ds-primary);
  flex-shrink: 0;
}

.ds-toast.is-success {
  border-inline-start-color: #16a34a;
}
.ds-toast.is-success .ds-toast__dot {
  background: #16a34a;
}
.ds-toast.is-error {
  border-inline-start-color: var(--ds-danger);
}
.ds-toast.is-error .ds-toast__dot {
  background: var(--ds-danger);
}
.ds-toast.is-info {
  border-inline-start-color: #0ea5e9;
}
.ds-toast.is-info .ds-toast__dot {
  background: #0ea5e9;
}

@keyframes ds-toast-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
