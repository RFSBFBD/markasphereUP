<script setup>
import { computed } from 'vue'
import { folderLabel, formatBytes, formatDate, dimensions } from '@/dashboard/modules/media/utils/helpers'
import { useToast } from '@/dashboard/composables/useToast'

const props = defineProps({
  image: { type: Object, default: null },
})
const emit = defineEmits(['close', 'delete', 'copy'])

const toast = useToast()

const rows = computed(() => {
  if (!props.image) return []
  return [
    { label: 'الاسم', value: props.image.name },
    { label: 'الأبعاد', value: dimensions(props.image) },
    { label: 'الحجم', value: formatBytes(props.image.size) },
    { label: 'النوع', value: props.image.mime || '—' },
    { label: 'المجلد', value: folderLabel(props.image.folder) },
    { label: 'تاريخ الرفع', value: formatDate(props.image.created_at) },
  ]
})

function download() {
  if (!props.image) return
  const a = document.createElement('a')
  a.href = props.image.url
  a.download = props.image.name || 'image'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
function copy() {
  emit('copy', props.image)
}
function del() {
  emit('delete', props.image)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="image" class="modal-overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <button class="modal__close" type="button" @click="emit('close')">×</button>
        <div class="modal__img">
          <img :src="image.url" :alt="image.name" />
        </div>
        <div class="modal__panel">
          <h3 class="modal__title">{{ image.name }}</h3>
          <dl class="modal__meta">
            <div v-for="r in rows" :key="r.label" class="modal__meta-row">
              <dt>{{ r.label }}</dt>
              <dd>{{ r.value }}</dd>
            </div>
          </dl>
          <div class="modal__actions">
            <button type="button" class="ds-btn" @click="copy">نسخ الرابط</button>
            <button type="button" class="ds-btn" @click="download">تنزيل</button>
            <button type="button" class="ds-btn is-danger" @click="del">حذف</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,17,22,.7);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 1200;
}
.modal {
  width: 100%;
  max-width: 880px;
  max-height: 90vh;
  overflow: auto;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  box-shadow: var(--ds-shadow);
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  position: relative;
}
.modal__close {
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
  width: 32px; height: 32px;
  border: none; border-radius: 50%;
  background: rgba(15,17,22,.5); color: #fff;
  font-size: 20px; line-height: 1; cursor: pointer;
  z-index: 2;
}
.modal__img { background: #0c0e12; display: grid; place-items: center; padding: 16px; }
.modal__img img { max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 8px; }
.modal__panel { padding: 22px; }
.modal__title { margin: 0 0 14px; font-size: 16px; font-weight: 800; word-break: break-all; }
.modal__meta { margin: 0; display: flex; flex-direction: column; gap: 10px; }
.modal__meta-row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; }
.modal__meta-row dt { color: var(--ds-text-muted); font-weight: 700; }
.modal__meta-row dd { margin: 0; text-align: end; word-break: break-all; }
.modal__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.modal__actions .ds-btn { flex: 1; min-width: 90px; justify-content: center; }

@media (max-width: 720px) {
  .modal { grid-template-columns: 1fr; }
}
</style>
