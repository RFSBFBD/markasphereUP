<script setup>
const props = defineProps({
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['view', 'mark-read', 'mark-unread', 'archive', 'delete'])

function preview(text) {
  if (!text) return '—'
  return text.length > 80 ? text.slice(0, 80) + '…' : text
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

const statusLabel = {
  Unread: 'غير مقروء',
  Read: 'مقروء',
  Archived: 'مؤرشف',
}
</script>

<template>
  <div class="ttable-wrap">
    <div v-if="loading" class="ttable-loading"><span class="spinner" /> جارٍ التحميل...</div>

    <table v-else class="ttable">
      <thead>
        <tr>
          <th>الاسم</th>
          <th>البريد</th>
          <th>الهاتف</th>
          <th>الموضوع</th>
          <th>نص الرسالة</th>
          <th>التاريخ</th>
          <th>الحالة</th>
          <th class="ttable__actions-col">إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="m in messages"
          :key="m.id"
          :class="{ 'is-unread': m.status === 'Unread' }"
          @click="emit('view', m)"
          style="cursor: pointer"
        >
          <td class="ttable__title">{{ m.full_name || m.name || '—' }}</td>
          <td class="ttable__title-en">{{ m.email || '—' }}</td>
          <td>{{ m.phone || '—' }}</td>
          <td>{{ m.subject || '—' }}</td>
          <td class="ttable__preview">{{ preview(m.message) }}</td>
          <td class="ttable__date">{{ formatDate(m.created_at) }}</td>
          <td>
            <span class="ttable__status" :class="`is-${m.status?.toLowerCase()}`">
              {{ statusLabel[m.status] || m.status || '—' }}
            </span>
          </td>
          <td>
            <div class="ttable__actions" @click.stop>
              <button type="button" class="icon-btn" title="عرض" @click="emit('view', m)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button
                v-if="m.status !== 'Read'"
                type="button"
                class="icon-btn" title="تحديد كمقروء"
                @click="emit('mark-read', m)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </button>
              <button
                v-else
                type="button"
                class="icon-btn" title="تحديد كغير مقروء"
                @click="emit('mark-unread', m)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button
                v-if="m.status !== 'Archived'"
                type="button"
                class="icon-btn" title="أرشفة"
                @click="emit('archive', m)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/></svg>
              </button>
              <button type="button" class="icon-btn is-danger" title="حذف" @click="emit('delete', m)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!messages.length">
          <td colspan="8" class="ttable__empty">
            <div>
              <p class="ttable__empty-title">لا توجد رسائل</p>
              <p class="ttable__empty-sub">ستظهر رسائل التواصل هنا بمجرد إرسالها من الموقع.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ttable-wrap { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); box-shadow: var(--ds-shadow); overflow: hidden; position: relative; }
.ttable-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 48px; color: var(--ds-text-muted); font-weight: 600; }
.spinner { width: 18px; height: 18px; border: 2.5px solid var(--ds-border); border-top-color: var(--ds-primary); border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ttable { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.ttable thead th { text-align: start; padding: 13px 16px; background: var(--ds-surface-2); color: var(--ds-text-muted); font-weight: 700; font-size: 12.5px; border-block-end: 1px solid var(--ds-border); white-space: nowrap; }
.ttable tbody td { padding: 12px 16px; border-block-end: 1px solid var(--ds-border); vertical-align: middle; }
.ttable tbody tr:last-child td { border-block-end: none; }
.ttable tbody tr:hover { background: var(--ds-surface-2); }
.ttable tbody tr.is-unread { background: var(--ds-primary-soft); }
.ttable tbody tr.is-unread:hover { background: #e6e9ff; }
.ttable__title { font-weight: 700; color: var(--ds-text); }
.ttable__title-en { color: var(--ds-text-muted); }
.ttable__preview { max-width: 320px; color: var(--ds-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ttable__date { white-space: nowrap; color: var(--ds-text-muted); }
.ttable__status { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.ttable__status.is-unread { background: #eef0fe; color: var(--ds-primary); }
.ttable__status.is-read { background: #e7f7ee; color: #16a34a; }
.ttable__status.is-archived { background: #eef0f3; color: #6b7280; }
.ttable__actions { display: flex; gap: 6px; }
.icon-btn { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 8px; border: 1px solid var(--ds-border); background: var(--ds-surface); color: var(--ds-text-muted); cursor: pointer; transition: all .15s ease; }
.icon-btn svg { width: 17px; height: 17px; }
.icon-btn:hover { color: var(--ds-primary); border-color: var(--ds-primary); }
.icon-btn.is-danger:hover { color: var(--ds-danger); border-color: var(--ds-danger); }
.ttable__empty { text-align: center; padding: 56px 16px !important; }
.ttable__empty-title { margin: 0; font-size: 16px; font-weight: 700; }
.ttable__empty-sub { margin: 6px 0 0; color: var(--ds-text-muted); font-size: 13.5px; }

@media (max-width: 860px) {
  .ttable-wrap { overflow-x: auto; }
  .ttable { min-width: 920px; }
}
</style>
