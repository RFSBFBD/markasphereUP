<script setup>
import { ref } from 'vue'
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_COVER_BYTES,
  COVER_RATIO,
  humanSize,
  validateImageFile,
  getImageSize,
} from '@/dashboard/modules/projects/utils/helpers'
import { useToast } from '@/dashboard/composables/useToast'

const props = defineProps({
  image: { type: String, default: null },
})
const emit = defineEmits(['change', 'remove'])

const toast = useToast()
const dragOver = ref(false)
const error = ref('')
const ratioHint = ref('')

function onSelect(e) {
  const file = e.target.files?.[0]
  if (file) handle(file)
  e.target.value = ''
}

function onDrop(e) {
  dragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) handle(file)
}

async function handle(file) {
  error.value = ''
  ratioHint.value = ''
  const err = validateImageFile(file, MAX_COVER_BYTES)
  if (err) {
    error.value = err
    toast.error(err)
    return
  }
  const size = await getImageSize(file)
  if (size && (size.width < 800 || size.height < 450)) {
    ratioHint.value = `الأبعاد الحالية ${size.width}×${size.height}px — المقاس الموصى به ${COVER_RATIO}px`
  }
  emit('change', { file, url: URL.createObjectURL(file) })
}

function onRemove() {
  error.value = ''
  ratioHint.value = ''
  emit('remove')
}
</script>

<template>
  <div class="cover-up">
    <div
      class="cover-up__drop"
      :class="{ 'is-over': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <div v-if="image" class="cover-up__preview">
        <img :src="image" alt="cover" />
        <button type="button" class="cover-up__remove" @click.prevent="onRemove">إزالة</button>
      </div>
      <label v-else class="cover-up__empty">
        <span class="cover-up__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 16V4m0 0L8 8m4-4 4 4" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        </span>
        <span class="cover-up__title">اسحب وأفلت صورة الغلاف</span>
        <span class="cover-up__sub">أو انقر للاختيار</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" class="cover-up__input" @change="onSelect" />
      </label>
    </div>
    <p class="cover-up__meta">
      المقاس الموصى به: {{ COVER_RATIO }}px · الصيغ: JPG / PNG / WEBP · الحد الأقصى: {{ humanSize(MAX_COVER_BYTES) }}
    </p>
    <p v-if="ratioHint" class="cover-up__hint">{{ ratioHint }}</p>
    <p v-if="error" class="cover-up__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.cover-up__drop {
  border: 1.5px dashed var(--ds-border);
  border-radius: var(--ds-radius);
  background: var(--ds-surface-2);
  overflow: hidden;
  transition: border-color .15s ease, background .15s ease;
}
.cover-up__drop.is-over {
  border-color: var(--ds-primary);
  background: var(--ds-primary-soft);
}
.cover-up__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 28px 16px;
  cursor: pointer;
  color: var(--ds-text-muted);
}
.cover-up__icon {
  width: 34px;
  height: 34px;
  color: var(--ds-primary);
}
.cover-up__icon svg { width: 100%; height: 100%; }
.cover-up__title { font-weight: 700; color: var(--ds-text); font-size: 14px; }
.cover-up__sub { font-size: 12.5px; }
.cover-up__input { display: none; }
.cover-up__preview {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
}
.cover-up__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.cover-up__remove {
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
  background: rgba(0,0,0,.6);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}
.cover-up__meta { margin: 10px 2px 0; font-size: 12px; color: var(--ds-text-muted); }
.cover-up__hint { margin: 4px 2px 0; font-size: 12px; color: #d97706; }
.cover-up__error { margin: 4px 2px 0; font-size: 12px; color: var(--ds-danger); font-weight: 600; }
</style>
