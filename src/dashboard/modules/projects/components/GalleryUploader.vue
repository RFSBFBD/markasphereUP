<script setup>
import { ref, computed } from 'vue'
import {
  MAX_GALLERY_BYTES,
  GALLERY_RATIO,
  humanSize,
  validateImageFile,
} from '@/dashboard/modules/projects/utils/helpers'
import { useToast } from '@/dashboard/composables/useToast'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const toast = useToast()
const dragOver = ref(false)
const dragIndex = ref(-1)

const visible = computed(() => props.modelValue.filter((i) => i.status !== 'removed'))

function onSelect(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  dragOver.value = false
  addFiles(e.dataTransfer.files)
}

function addFiles(fileList) {
  const files = Array.from(fileList || [])
  if (!files.length) return
  const next = [...props.modelValue]
  for (const f of files) {
    const err = validateImageFile(f, MAX_GALLERY_BYTES)
    if (err) {
      toast.error(err)
      continue
    }
    next.push({ file: f, url: URL.createObjectURL(f), status: 'new' })
  }
  emit('update:modelValue', next)
}

function removeItem(item) {
  if (item.status === 'new') {
    const next = props.modelValue.filter((i) => i !== item)
    emit('update:modelValue', next)
  } else {
    const next = props.modelValue.map((i) => (i === item ? { ...i, status: 'removed' } : i))
    emit('update:modelValue', next)
  }
}

function onDragStart(idx) {
  dragIndex.value = idx
}
function onDragOver(idx) {
  if (dragIndex.value === -1 || dragIndex.value === idx) return
  const v = [...visible.value]
  const [moved] = v.splice(dragIndex.value, 1)
  v.splice(idx, 0, moved)
  dragIndex.value = idx
  const removed = props.modelValue.filter((i) => i.status === 'removed')
  emit('update:modelValue', [...v, ...removed])
}
function onDragEnd() {
  dragIndex.value = -1
}
</script>

<template>
  <div class="gallery-up">
    <div
      class="gallery-up__drop"
      :class="{ 'is-over': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <span class="gallery-up__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 16V4m0 0L8 8m4-4 4 4" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      </span>
      <span class="gallery-up__title">اسحب وأفلت صورًا متعددة</span>
      <span class="gallery-up__sub">أو انقر للاختيار</span>
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple class="gallery-up__input" @change="onSelect" />
    </div>

    <div v-if="visible.length" class="gallery-up__grid">
      <div
        v-for="(item, idx) in visible"
        :key="item.id || item.url"
        class="gallery-up__item"
        :class="{ 'is-dragging': dragIndex === idx }"
        draggable="true"
        @dragstart="onDragStart(idx)"
        @dragover.prevent="onDragOver(idx)"
        @dragend="onDragEnd"
      >
        <img :src="item.url" :alt="`gallery-${idx}`" />
        <span class="gallery-up__grip" title="اسحب لإعادة الترتيب">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>
        </span>
        <button type="button" class="gallery-up__remove" @click="removeItem(item)">×</button>
        <span v-if="item.status === 'new'" class="gallery-up__tag">جديد</span>
      </div>
    </div>

    <p class="gallery-up__meta">
      المقاس الموصى به: {{ GALLERY_RATIO }}px · الصيغ: JPG / PNG / WEBP · الحد الأقصى: {{ humanSize(MAX_GALLERY_BYTES) }} لكل صورة
    </p>
  </div>
</template>

<style scoped>
.gallery-up__drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 22px 16px;
  border: 1.5px dashed var(--ds-border);
  border-radius: var(--ds-radius);
  background: var(--ds-surface-2);
  cursor: pointer;
  position: relative;
  color: var(--ds-text-muted);
  transition: border-color .15s ease, background .15s ease;
}
.gallery-up__drop.is-over {
  border-color: var(--ds-primary);
  background: var(--ds-primary-soft);
}
.gallery-up__icon { width: 30px; height: 30px; color: var(--ds-primary); }
.gallery-up__icon svg { width: 100%; height: 100%; }
.gallery-up__title { font-weight: 700; color: var(--ds-text); font-size: 14px; }
.gallery-up__sub { font-size: 12.5px; }
.gallery-up__input { display: none; }

.gallery-up__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 12px;
}
.gallery-up__item {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--ds-radius-sm);
  overflow: hidden;
  border: 1px solid var(--ds-border);
  background: var(--ds-surface-2);
  cursor: grab;
}
.gallery-up__item.is-dragging { opacity: .4; }
.gallery-up__item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gallery-up__grip {
  position: absolute;
  inset-block-start: 6px;
  inset-inline-start: 6px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,.5);
  border-radius: 6px;
  color: #fff;
}
.gallery-up__grip svg { width: 14px; height: 14px; }
.gallery-up__remove {
  position: absolute;
  inset-block-start: 6px;
  inset-inline-end: 6px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: rgba(225,29,72,.9);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}
.gallery-up__tag {
  position: absolute;
  inset-block-end: 6px;
  inset-inline-start: 6px;
  background: var(--ds-primary);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
}
.gallery-up__meta { margin: 12px 2px 0; font-size: 12px; color: var(--ds-text-muted); }
</style>
