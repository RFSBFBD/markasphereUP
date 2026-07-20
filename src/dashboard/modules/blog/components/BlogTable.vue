<script setup>
import { categoryLabel, formatDate } from '../utils/helpers'
import StatusBadge from '@/dashboard/components/ui/StatusBadge.vue'

const props = defineProps({
  posts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['preview', 'edit', 'delete', 'toggle', 'go', 'sort'])
</script>

<template>
  <div class="blog-table">
    <div class="ds-table-head">
      <div>الغلاف</div>
      <div>العنوان (ع)</div>
      <div>العنوان (En)</div>
      <div>التصنيف</div>
      <div>الحالة</div>
      <div>تاريخ الإنشاء</div>
      <div class="col-actions">إجراءات</div>
    </div>

    <div v-if="loading" class="ds-table-empty">جارٍ التحميل...</div>
    <div v-else-if="!posts.length" class="ds-table-empty">لا توجد مقالات بعد</div>

    <div v-for="post in posts" :key="post.id" class="ds-table-row">
      <div>
        <div class="thumb" v-if="post.cover_image"><img :src="post.cover_image" :alt="post.title_ar" /></div>
        <div class="thumb thumb--empty" v-else>—</div>
      </div>
      <div class="cell-title">{{ post.title_ar }}</div>
      <div class="cell-title cell-muted">{{ post.title_en }}</div>
      <div>{{ categoryLabel(post.category) }}</div>
      <div><StatusBadge type="published" :value="!!post.published" /></div>
      <div class="cell-muted">{{ formatDate(post.created_at) }}</div>
      <div class="col-actions">
        <button class="row-btn is-preview" title="معاينة" @click="emit('preview', post)">👁</button>
        <button class="row-btn is-edit" title="تعديل" @click="emit('edit', post)">✎</button>
        <button class="row-btn" :title="post.published ? 'إلغاء النشر' : 'نشر'" @click="emit('toggle', post)">
          {{ post.published ? '⏸' : '▲' }}
        </button>
        <button class="row-btn is-danger" title="حذف" @click="emit('delete', post)">🗑</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-table { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); overflow: hidden; }
.ds-table-head, .ds-table-row {
  display: grid; grid-template-columns: 70px 1.4fr 1.4fr 1fr .9fr 1fr 150px;
  gap: 10px; padding: 12px 16px; align-items: center;
}
.ds-table-head { background: var(--ds-surface-2); font-size: 12px; font-weight: 800; color: var(--ds-text-muted); }
.ds-table-row { border-block-start: 1px solid var(--ds-border); font-size: 13.5px; }
.ds-table-row:hover { background: var(--ds-surface-2); }
.ds-table-empty { padding: 30px; text-align: center; color: var(--ds-text-muted); }
.thumb { width: 54px; height: 40px; border-radius: 8px; overflow: hidden; background: var(--ds-surface-2); }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb--empty { display: grid; place-items: center; color: var(--ds-text-muted); border: 1px dashed var(--ds-border); }
.cell-title { font-weight: 700; color: var(--ds-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cell-muted { color: var(--ds-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-actions { display: flex; gap: 6px; justify-content: flex-end; }
.row-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--ds-border); background: var(--ds-surface); cursor: pointer; color: var(--ds-text); font-size: 14px; }
.row-btn:hover { border-color: var(--ds-primary); }
.row-btn.is-edit:hover { border-color: #2563eb; color: #2563eb; }
.row-btn.is-danger:hover { border-color: var(--ds-danger); color: var(--ds-danger); }
.row-btn.is-preview:hover { border-color: #0891b2; color: #0891b2; }

@media (max-width: 900px) {
  .ds-table-head { display: none; }
  .ds-table-row { grid-template-columns: 54px 1fr 130px; }
  .ds-table-row > div:nth-child(3), .ds-table-row > div:nth-child(4), .ds-table-row > div:nth-child(5), .ds-table-row > div:nth-child(6) { display: none; }
}
</style>
