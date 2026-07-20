<script setup>
import { folderLabel, formatBytes, formatDate, dimensions } from '@/dashboard/modules/media/utils/helpers'

const props = defineProps({
  image: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
const emit = defineEmits(['select', 'preview', 'delete', 'copy'])
</script>

<template>
  <div class="mcard" :class="{ selected }" @click="emit('select', image)">
    <div class="mcard__thumb">
      <img :src="image.url" :alt="image.name" loading="lazy" />
      <label class="mcard__check" @click.stop>
        <input type="checkbox" :checked="selected" @change="emit('select', image)" />
      </label>
      <div class="mcard__actions" @click.stop>
        <button type="button" title="معاينة" @click="emit('preview', image)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button type="button" title="نسخ الرابط" @click="emit('copy', image)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        </button>
        <button type="button" class="is-danger" title="حذف" @click="emit('delete', image)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
        </button>
      </div>
    </div>
    <div class="mcard__meta">
      <p class="mcard__name" :title="image.name">{{ image.name }}</p>
      <div class="mcard__row">
        <span>{{ dimensions(image) }}</span>
        <span>{{ formatBytes(image.size) }}</span>
      </div>
      <div class="mcard__row mcard__muted">
        <span>{{ folderLabel(image.folder) }}</span>
        <span>{{ formatDate(image.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mcard {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  overflow: hidden;
  cursor: pointer;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.mcard:hover { box-shadow: var(--ds-shadow); }
.mcard.selected { border-color: var(--ds-primary); box-shadow: 0 0 0 2px var(--ds-primary-soft); }
.mcard__thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--ds-surface-2);
  display: grid;
  place-items: center;
  overflow: hidden;
}
.mcard__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mcard__check {
  position: absolute;
  inset-block-start: 8px;
  inset-inline-start: 8px;
  width: 20px; height: 20px;
}
.mcard__check input { width: 18px; height: 18px; cursor: pointer; accent-color: var(--ds-primary); }
.mcard__actions {
  position: absolute;
  inset-block-end: 8px;
  inset-inline-end: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity .15s ease, transform .15s ease;
}
.mcard:hover .mcard__actions { opacity: 1; transform: translateY(0); }
.mcard__actions button {
  width: 30px; height: 30px;
  display: grid; place-items: center;
  border: none;
  border-radius: 8px;
  background: rgba(15,17,22,.7);
  color: #fff;
  cursor: pointer;
}
.mcard__actions button svg { width: 16px; height: 16px; }
.mcard__actions button.is-danger:hover { background: var(--ds-danger); }
.mcard__meta { padding: 10px 12px 12px; }
.mcard__name {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mcard__row { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ds-text); }
.mcard__muted { color: var(--ds-text-muted); margin-top: 2px; }
</style>
