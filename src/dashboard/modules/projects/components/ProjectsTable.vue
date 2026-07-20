<script setup>
import { RouterLink } from 'vue-router'
import StatusBadge from '@/dashboard/components/ui/StatusBadge.vue'
import { formatDate, categoryLabel } from '@/dashboard/modules/projects/utils/helpers'

const props = defineProps({
  projects: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['preview', 'edit', 'delete', 'toggle-publish', 'toggle-featured'])
</script>

<template>
  <div class="ptable-wrap">
    <div v-if="loading" class="ptable-loading">
      <span class="spinner" /> جارٍ التحميل...
    </div>

    <table v-else class="ptable">
      <thead>
        <tr>
          <th>الغلاف</th>
          <th>العنوان (عربي)</th>
          <th>العنوان (إنجليزي)</th>
          <th>التصنيف</th>
          <th>الحالة</th>
          <th>مميز</th>
          <th>آخر تحديث</th>
          <th class="ptable__actions-col">إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in projects" :key="p.id">
          <td>
            <div class="ptable__cover">
              <img v-if="p.cover_image" :src="p.cover_image" :alt="p.title_ar" />
              <span v-else class="ptable__cover-ph" />
            </div>
          </td>
          <td class="ptable__title">{{ p.title_ar || '—' }}</td>
          <td class="ptable__title-en">{{ p.title_en || '—' }}</td>
          <td>{{ categoryLabel(p.category) }}</td>
          <td>
            <button type="button" class="ptable__toggle" @click="emit('toggle-publish', p)">
              <StatusBadge type="published" :value="!!p.published" />
            </button>
          </td>
          <td>
            <button type="button" class="ptable__toggle" @click="emit('toggle-featured', p)">
              <StatusBadge type="featured" :value="!!p.featured" />
            </button>
          </td>
          <td class="ptable__muted">{{ formatDate(p.updated_at) }}</td>
          <td>
            <div class="ptable__actions">
              <RouterLink class="icon-btn" :to="{ name: 'dashboard-projects-preview', params: { id: p.id } }" title="معاينة">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
              </RouterLink>
              <RouterLink class="icon-btn" :to="{ name: 'dashboard-projects-edit', params: { id: p.id } }" title="تعديل">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              </RouterLink>
              <button type="button" class="icon-btn is-danger" title="حذف" @click="emit('delete', p)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!projects.length">
          <td colspan="8" class="ptable__empty">
            <div>
              <p class="ptable__empty-title">لا توجد مشاريع</p>
              <p class="ptable__empty-sub">ابدأ بإضافة مشروع جديد من الزر بالأعلى.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ptable-wrap {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  box-shadow: var(--ds-shadow);
  overflow: hidden;
  position: relative;
}
.ptable-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px;
  color: var(--ds-text-muted);
  font-weight: 600;
}
.spinner {
  width: 18px; height: 18px;
  border: 2.5px solid var(--ds-border);
  border-top-color: var(--ds-primary);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.ptable {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
.ptable thead th {
  text-align: start;
  padding: 13px 16px;
  background: var(--ds-surface-2);
  color: var(--ds-text-muted);
  font-weight: 700;
  font-size: 12.5px;
  border-block-end: 1px solid var(--ds-border);
  white-space: nowrap;
}
.ptable tbody td {
  padding: 12px 16px;
  border-block-end: 1px solid var(--ds-border);
  vertical-align: middle;
}
.ptable tbody tr:last-child td { border-block-end: none; }
.ptable tbody tr:hover { background: var(--ds-surface-2); }
.ptable__title { font-weight: 700; color: var(--ds-text); }
.ptable__title-en { color: var(--ds-text-muted); }
.ptable__muted { color: var(--ds-text-muted); white-space: nowrap; }
.ptable__cover {
  width: 96px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--ds-surface-2);
}
.ptable__cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ptable__cover-ph { display: block; width: 100%; height: 100%; background: linear-gradient(135deg,#4f46e5,#8b5cf6); opacity:.5; }
.ptable__toggle { background: none; border: none; padding: 0; cursor: pointer; }
.ptable__actions { display: flex; gap: 6px; }
.icon-btn {
  width: 34px; height: 34px;
  display: grid; place-items: center;
  border-radius: 8px;
  border: 1px solid var(--ds-border);
  background: var(--ds-surface);
  color: var(--ds-text-muted);
  cursor: pointer;
  transition: all .15s ease;
}
.icon-btn svg { width: 17px; height: 17px; }
.icon-btn:hover { color: var(--ds-primary); border-color: var(--ds-primary); }
.icon-btn.is-danger:hover { color: var(--ds-danger); border-color: var(--ds-danger); }
.ptable__empty { text-align: center; padding: 56px 16px !important; }
.ptable__empty-title { margin: 0; font-size: 16px; font-weight: 700; color: var(--ds-text); }
.ptable__empty-sub { margin: 6px 0 0; color: var(--ds-text-muted); font-size: 13.5px; }

@media (max-width: 860px) {
  .ptable-wrap { overflow-x: auto; }
  .ptable { min-width: 880px; }
}
</style>
