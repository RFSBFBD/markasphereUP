<script setup>
const props = defineProps({
  message: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'mark-read', 'mark-unread', 'archive', 'delete'])

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat('ar', { dateStyle: 'long', timeStyle: 'short' }).format(d)
}

const statusLabel = {
  Unread: 'غير مقروء',
  Read: 'مقروء',
  Archived: 'مؤرشف',
}
</script>

<template>
  <Teleport to="body">
    <div v-if="message" class="mm-overlay" @click.self="emit('close')">
      <div class="mm" role="dialog" aria-modal="true">
        <header class="mm__head">
          <div>
            <h3 class="mm__title">{{ message.full_name || message.name || 'بدون اسم' }}</h3>
            <span class="mm__status" :class="`is-${message.status?.toLowerCase()}`">
              {{ statusLabel[message.status] || message.status }}
            </span>
          </div>
          <button type="button" class="mm__close" @click="emit('close')" aria-label="إغلاق">×</button>
        </header>

        <div class="mm__grid">
          <div class="mm__field">
            <span class="mm__label">البريد الإلكتروني</span>
            <a :href="`mailto:${message.email}`" class="mm__value">{{ message.email || '—' }}</a>
          </div>
          <div class="mm__field">
            <span class="mm__label">الهاتف</span>
            <span class="mm__value">{{ message.phone || '—' }}</span>
          </div>
          <div class="mm__field">
            <span class="mm__label">الشركة</span>
            <span class="mm__value">{{ message.company || '—' }}</span>
          </div>
          <div class="mm__field">
            <span class="mm__label">الموضوع</span>
            <span class="mm__value">{{ message.subject || '—' }}</span>
          </div>
        </div>

        <div class="mm__field mm__field--block">
          <span class="mm__label">الرسالة</span>
          <p class="mm__message">{{ message.message }}</p>
        </div>

        <div class="mm__field mm__field--block">
          <span class="mm__label">التاريخ</span>
          <span class="mm__value">{{ formatDate(message.created_at) }}</span>
        </div>

        <footer class="mm__actions">
          <button
            v-if="message.status !== 'Read'"
            type="button" class="ds-btn is-primary" :disabled="loading"
            @click="emit('mark-read', message)"
          >تحديد كمقروء</button>
          <button
            v-else
            type="button" class="ds-btn" :disabled="loading"
            @click="emit('mark-unread', message)"
          >تحديد كغير مقروء</button>
          <button
            v-if="message.status !== 'Archived'"
            type="button" class="ds-btn" :disabled="loading"
            @click="emit('archive', message)"
          >أرشفة</button>
          <button type="button" class="ds-btn is-danger" :disabled="loading" @click="emit('delete', message)">حذف</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mm-overlay {
  position: fixed; inset: 0; background: rgba(15,17,22,.55);
  display: grid; place-items: center; padding: 20px; z-index: 1100;
}
.mm {
  width: 100%; max-width: 560px; background: var(--ds-surface);
  border: 1px solid var(--ds-border); border-radius: var(--ds-radius);
  padding: 24px; box-shadow: var(--ds-shadow); direction: rtl; text-align: start;
  max-height: 88vh; overflow: auto;
}
.mm__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.mm__title { margin: 0 0 8px; font-size: 18px; font-weight: 800; }
.mm__status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.mm__status.is-unread { background: var(--ds-primary-soft); color: var(--ds-primary); }
.mm__status.is-read { background: #e7f7ee; color: #16a34a; }
.mm__status.is-archived { background: #eef0f3; color: #6b7280; }
.mm__close { border: none; background: var(--ds-surface-2); width: 32px; height: 32px; border-radius: 8px; font-size: 20px; line-height: 1; cursor: pointer; color: var(--ds-text-muted); }
.mm__close:hover { color: var(--ds-text); }
.mm__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.mm__field { display: flex; flex-direction: column; gap: 4px; }
.mm__field--block { margin-bottom: 16px; }
.mm__label { font-size: 12px; color: var(--ds-text-muted); font-weight: 700; }
.mm__value { font-size: 14px; color: var(--ds-text); text-decoration: none; }
.mm__message { margin: 0; font-size: 14px; line-height: 1.8; color: var(--ds-text); white-space: pre-wrap; background: var(--ds-surface-2); padding: 14px; border-radius: var(--ds-radius-sm); }
.mm__actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-start; margin-top: 8px; }
.mm__actions .ds-btn { min-width: 120px; justify-content: center; }

@media (max-width: 540px) {
  .mm__grid { grid-template-columns: 1fr; }
}
</style>
