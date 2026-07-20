<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@/dashboard/modules/media/stores/mediaStore'
import { useToast } from '@/dashboard/composables/useToast'
import {
  MEDIA_FOLDERS,
  validateFile,
  formatBytes,
  getImageSize,
} from '@/dashboard/modules/media/utils/helpers'

const store = useMediaStore()
const { currentFolder } = storeToRefs(store)
const toast = useToast()

const queue = ref([])
const dragOver = ref(false)
const folder = ref(currentFolder.value && currentFolder.value !== 'all' ? currentFolder.value : 'projects')
const inputRef = ref(null)

let seq = 0

watch(currentFolder, (value) => {
  folder.value = value && value !== 'all' ? value : 'projects'
}, { immediate: true })

const activeCount = computed(() => queue.value.filter((q) => q.status === 'uploading' || q.status === 'pending').length)
const hasItems = computed(() => queue.value.length > 0)

function openPicker() {
  inputRef.value?.click()
}

function onSelect(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  dragOver.value = false
  addFiles(e.dataTransfer.files)
}

async function addFiles(fileList) {
  const files = Array.from(fileList || [])
  if (!files.length) return
  for (const f of files) {
    const err = validateFile(f)
    if (err) {
      toast.error(err)
      continue
    }
    queue.value.push({
      id: ++seq,
      file: f,
      folder: folder.value,
      preview: URL.createObjectURL(f),
      progress: 0,
      status: 'pending',
      error: null,
      controller: null,
    })
  }
  processQueue()
}

async function processQueue() {
  for (const item of queue.value) {
    if (item.status === 'pending') await uploadOne(item)
  }
}

async function uploadOne(item) {
  item.status = 'uploading'
  item.controller = new AbortController()
  const size = await getImageSize(item.file)
  try {
    await store.upload(item.file, item.folder, {
      meta: { width: size?.width || null, height: size?.height || null },
      signal: item.controller.signal,
      onProgress: (e) => {
        if (e && e.total) item.progress = Math.round((e.loaded / e.total) * 100)
      },
    })
    item.status = 'done'
    item.progress = 100
  } catch (err) {
    if (item.controller.signal.aborted) item.status = 'canceled'
    else {
      item.status = 'error'
      item.error = err?.message || 'فشل الرفع'
    }
  }
}

function retry(item) {
  item.status = 'pending'
  item.error = null
  item.progress = 0
  processQueue()
}

function cancel(item) {
  item.controller?.abort()
  item.status = 'canceled'
}

function removeItem(item) {
  if (item.preview) URL.revokeObjectURL(item.preview)
  queue.value = queue.value.filter((q) => q !== item)
}

function clearDone() {
  queue.value
    .filter((q) => q.status === 'done' || q.status === 'canceled')
    .forEach((q) => q.preview && URL.revokeObjectURL(q.preview))
  queue.value = queue.value.filter((q) => q.status !== 'done' && q.status !== 'canceled')
}
</script>

<template>
  <div class="up">
    <div
      class="up__drop"
      :class="{ 'is-over': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <div class="up__head">
        <span class="up__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 16V4m0 0L8 8m4-4 4 4" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        </span>
        <div class="up__text">
          <p class="up__title">اسحب وأفلت الصور هنا</p>
          <p class="up__sub">JPG · PNG · WEBP · SVG — حتى 5MB لكل ملف</p>
        </div>
        <div class="up__controls">
          <select v-model="folder" class="up__folder">
            <option v-for="f in MEDIA_FOLDERS" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
          <button type="button" class="ds-btn is-primary" @click="openPicker">اختيار ملفات</button>
          <input ref="inputRef" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple class="up__input" @change="onSelect" />
        </div>
      </div>
    </div>

    <div v-if="hasItems" class="up__queue">
      <div class="up__queue-head">
        <span>{{ activeCount ? `جارٍ الرفع (${activeCount})` : 'قائمة الرفع' }}</span>
        <button v-if="queue.some((q) => q.status === 'done' || q.status === 'canceled')" type="button" class="up__clear" @click="clearDone">مسح المكتمل</button>
      </div>

      <div v-for="item in queue" :key="item.id" class="qitem" :class="`is-${item.status}`">
        <img class="qitem__thumb" :src="item.preview" :alt="item.file.name" />
        <div class="qitem__body">
          <div class="qitem__row">
            <span class="qitem__name" :title="item.file.name">{{ item.file.name }}</span>
            <span class="qitem__size">{{ formatBytes(item.file.size) }}</span>
          </div>
          <div class="qitem__bar">
            <span class="qitem__fill" :style="{ width: item.progress + '%' }" />
          </div>
          <div class="qitem__status">
            <template v-if="item.status === 'uploading'">رفع... {{ item.progress }}%</template>
            <template v-else-if="item.status === 'done'">تم الرفع ✓</template>
            <template v-else-if="item.status === 'error'">{{ item.error }}</template>
            <template v-else-if="item.status === 'canceled'">أُلغي</template>
            <template v-else>بانتظار الرفع</template>
          </div>
        </div>
        <div class="qitem__actions">
          <button v-if="item.status === 'error'" type="button" class="qitem__btn" title="إعادة المحاولة" @click="retry(item)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
          <button v-if="item.status === 'uploading' || item.status === 'pending'" type="button" class="qitem__btn is-danger" title="إلغاء" @click="cancel(item)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <button v-if="item.status !== 'uploading'" type="button" class="qitem__btn" title="إزالة" @click="removeItem(item)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.up__drop {
  border: 1.5px dashed var(--ds-border);
  border-radius: var(--ds-radius);
  background: var(--ds-surface-2);
  transition: border-color .15s ease, background .15s ease;
}
.up__drop.is-over { border-color: var(--ds-primary); background: var(--ds-primary-soft); }
.up__head { display: flex; align-items: center; gap: 14px; padding: 18px 20px; flex-wrap: wrap; }
.up__icon { width: 34px; height: 34px; color: var(--ds-primary); flex-shrink: 0; }
.up__icon svg { width: 100%; height: 100%; }
.up__text { flex: 1; min-width: 160px; }
.up__title { margin: 0; font-weight: 700; font-size: 14.5px; }
.up__sub { margin: 2px 0 0; font-size: 12.5px; color: var(--ds-text-muted); }
.up__controls { display: flex; align-items: center; gap: 8px; }
.up__folder {
  padding: 9px 10px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface);
  color: var(--ds-text);
  font-size: 13px; font-weight: 600;
  outline: none; cursor: pointer;
}
.up__input { display: none; }

.up__queue { margin-top: 14px; background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); overflow: hidden; }
.up__queue-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border-block-end: 1px solid var(--ds-border);
  font-size: 13px; font-weight: 700; color: var(--ds-text-muted);
}
.up__clear { background: none; border: none; color: var(--ds-primary); font-weight: 700; cursor: pointer; font-size: 12.5px; }
.qitem { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-block-end: 1px solid var(--ds-border); }
.qitem:last-child { border-block-end: none; }
.qitem__thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; background: var(--ds-surface-2); flex-shrink: 0; }
.qitem__body { flex: 1; min-width: 0; }
.qitem__row { display: flex; justify-content: space-between; gap: 10px; }
.qitem__name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qitem__size { font-size: 12px; color: var(--ds-text-muted); flex-shrink: 0; }
.qitem__bar { height: 5px; border-radius: 999px; background: var(--ds-surface-2); margin: 6px 0 4px; overflow: hidden; }
.qitem__fill { display: block; height: 100%; background: var(--ds-primary); border-radius: 999px; transition: width .15s ease; }
.qitem__status { font-size: 12px; color: var(--ds-text-muted); }
.qitem.is-done .qitem__status { color: #16a34a; }
.qitem.is-error .qitem__status { color: var(--ds-danger); }
.qitem.is-canceled .qitem__status { color: var(--ds-text-muted); }
.qitem__actions { display: flex; gap: 4px; flex-shrink: 0; }
.qitem__btn {
  width: 30px; height: 30px; display: grid; place-items: center;
  border: 1px solid var(--ds-border); background: var(--ds-surface);
  border-radius: 8px; color: var(--ds-text-muted); cursor: pointer;
}
.qitem__btn svg { width: 15px; height: 15px; }
.qitem__btn:hover { color: var(--ds-primary); border-color: var(--ds-primary); }
.qitem__btn.is-danger:hover { color: var(--ds-danger); border-color: var(--ds-danger); }
</style>
