<script setup>
const props = defineProps({
  count: { type: Number, default: 1 },
  name: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])

const title = props.count > 1 ? `${props.count} عضو` : props.name || 'هذا العضو'
</script>

<template>
  <Teleport to="body">
    <div v-if="count" class="dialog-overlay" @click.self="emit('cancel')">
      <div class="dialog" role="alertdialog" aria-modal="true">
        <div class="dialog__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
        </div>
        <h3 class="dialog__title">حذف نهائي</h3>
        <p class="dialog__text">
          هل أنت متأكد من حذف <strong>{{ title }}</strong>؟ لا يمكن التراجع عن هذه العملية.
        </p>
        <div class="dialog__actions">
          <button type="button" class="ds-btn" :disabled="loading" @click="emit('cancel')">إلغاء</button>
          <button type="button" class="ds-btn is-danger" :disabled="loading" @click="emit('confirm')">
            {{ loading ? 'جارٍ الحذف...' : 'حذف نهائي' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed; inset: 0; background: rgba(15,17,22,.55);
  display: grid; place-items: center; padding: 20px; z-index: 1100;
}
.dialog {
  width: 100%; max-width: 420px; background: var(--ds-surface);
  border: 1px solid var(--ds-border); border-radius: var(--ds-radius);
  padding: 24px; box-shadow: var(--ds-shadow); text-align: center;
}
.dialog__icon {
  width: 48px; height: 48px; margin: 0 auto 14px; border-radius: 50%;
  background: var(--ds-danger-soft); color: var(--ds-danger); display: grid; place-items: center;
}
.dialog__icon svg { width: 26px; height: 26px; }
.dialog__title { margin: 0 0 8px; font-size: 18px; font-weight: 800; }
.dialog__text { margin: 0 0 18px; color: var(--ds-text-muted); font-size: 14px; line-height: 1.7; }
.dialog__actions { display: flex; gap: 10px; justify-content: center; }
.dialog__actions .ds-btn { min-width: 120px; justify-content: center; }
</style>
