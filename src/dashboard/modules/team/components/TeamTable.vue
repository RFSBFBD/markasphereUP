<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  members: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle-publish', 'toggle-featured', 'move', 'delete'])

function onMove(member, dir) {
  emit('move', { member, dir })
}
</script>

<template>
  <div class="ttable-wrap">
    <div v-if="loading" class="ttable-loading"><span class="spinner" /> جارٍ التحميل...</div>

    <table v-else class="ttable">
      <thead>
        <tr>
          <th>الصورة</th>
          <th>الاسم (عربي)</th>
          <th>الاسم (إنجليزي)</th>
          <th>المسمى الوظيفي</th>
          <th>الحالة</th>
          <th>الترتيب</th>
          <th class="ttable__actions-col">إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(m, idx) in members" :key="m.id">
          <td>
            <div class="ttable__photo">
              <img v-if="m.photo" :src="m.photo" :alt="m.name_ar" />
              <span v-else class="ttable__photo-ph" />
            </div>
          </td>
          <td class="ttable__title">{{ m.name_ar || '—' }}</td>
          <td class="ttable__title-en">{{ m.name_en || '—' }}</td>
          <td>{{ m.position_ar || '—' }}</td>
          <td>
            <button type="button" class="ttable__pub" :class="{ on: !!m.published }" @click="emit('toggle-publish', m)">
              <span class="dot" /> {{ m.published ? 'منشور' : 'مسودة' }}
            </button>
          </td>
          <td>
            <div class="ttable__order">
              <span>{{ m.display_order }}</span>
              <span class="ttable__arrows">
                <button type="button" :disabled="idx === 0" title="أعلى" @click="onMove(m, -1)">▲</button>
                <button type="button" :disabled="idx === members.length - 1" title="أسفل" @click="onMove(m, 1)">▼</button>
              </span>
            </div>
          </td>
          <td>
            <div class="ttable__actions">
              <RouterLink class="icon-btn" :to="{ name: 'dashboard-team-preview', params: { id: m.id } }" title="معاينة">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </RouterLink>
              <RouterLink class="icon-btn" :to="{ name: 'dashboard-team-edit', params: { id: m.id } }" title="تعديل">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              </RouterLink>
              <button type="button" class="icon-btn is-danger" title="حذف" @click="emit('delete', m)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!members.length">
          <td colspan="7" class="ttable__empty">
            <div>
              <p class="ttable__empty-title">لا يوجد أعضاء</p>
              <p class="ttable__empty-sub">ابدأ بإضافة عضو جديد من الزر بالأعلى.</p>
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
.ttable__title { font-weight: 700; color: var(--ds-text); }
.ttable__title-en { color: var(--ds-text-muted); }
.ttable__photo { width: 48px; height: 48px; border-radius: 10px; overflow: hidden; background: var(--ds-surface-2); }
.ttable__photo img { width: 100%; height: 100%; object-fit: cover; }
.ttable__photo-ph { display: block; width: 100%; height: 100%; background: linear-gradient(135deg,#4f46e5,#8b5cf6); opacity: .5; }
.ttable__pub { display: inline-flex; align-items: center; gap: 7px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 700; color: var(--ds-text-muted); }
.ttable__pub .dot { width: 8px; height: 8px; border-radius: 50%; background: #98a0ad; }
.ttable__pub.on { color: #16a34a; }
.ttable__pub.on .dot { background: #16a34a; }
.ttable__order { display: flex; align-items: center; gap: 10px; font-weight: 700; }
.ttable__arrows { display: flex; flex-direction: column; gap: 1px; }
.ttable__arrows button { border: none; background: var(--ds-surface-2); color: var(--ds-text-muted); width: 20px; height: 15px; border-radius: 4px; cursor: pointer; font-size: 9px; line-height: 1; }
.ttable__arrows button:disabled { opacity: .35; cursor: default; }
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
  .ttable { min-width: 820px; }
}
</style>
