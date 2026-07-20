<script setup>
import { ref } from 'vue'
import { useMediaStore } from '@/dashboard/modules/media/stores/mediaStore'
import FolderSidebar from '@/dashboard/modules/media/components/FolderSidebar.vue'
import MediaSearch from '@/dashboard/modules/media/components/MediaSearch.vue'
import MediaUploader from '@/dashboard/modules/media/components/MediaUploader.vue'
import MediaGrid from '@/dashboard/modules/media/components/MediaGrid.vue'

const props = defineProps({
  modelValue: { type: [Object, Array], default: null },
  multiple: { type: Boolean, default: false },
  folder: { type: String, default: 'blog' },
})
const emit = defineEmits(['update:modelValue', 'select', 'confirm'])

const store = useMediaStore()
const open = ref(false)
const picked = ref([])

function openPicker() {
  store.setFolder(props.folder)
  store.loadImages()
  if (props.multiple) {
    picked.value = Array.isArray(props.modelValue)
      ? props.modelValue.map((x) => ({ ...x }))
      : []
  }
  open.value = true
}

function onSelect(img) {
  if (props.multiple) {
    const i = picked.value.findIndex((x) => x.url === img.url)
    if (i > -1) picked.value.splice(i, 1)
    else picked.value.push(img)
  } else {
    emit('update:modelValue', img)
    emit('select', img)
    open.value = false
  }
}

function confirmMany() {
  emit('update:modelValue', [...picked.value])
  emit('confirm', [...picked.value])
  open.value = false
}

function clear() {
  emit('update:modelValue', props.multiple ? [] : null)
  emit('select', props.multiple ? [] : null)
}
</script>

<template>
  <div class="mpicker">
    <div v-if="multiple" class="mpicker__current">
      <div v-if="Array.isArray(modelValue) && modelValue.length" class="mpicker__thumbs">
        <img v-for="img in modelValue" :key="img.url" :src="img.url" :alt="img.name" />
      </div>
      <div v-else class="mpicker__empty">لا توجد صور</div>
      <div class="mpicker__actions">
        <button type="button" class="ds-btn is-primary" @click="openPicker">اختيار من الوسائط</button>
        <button v-if="Array.isArray(modelValue) && modelValue.length" type="button" class="ds-btn" @click="clear">إزالة الكل</button>
      </div>
    </div>

    <div v-else class="mpicker__current">
      <div v-if="modelValue" class="mpicker__thumb"><img :src="modelValue.url" :alt="modelValue.name" /></div>
      <div v-else class="mpicker__empty">لا توجد صورة</div>
      <div class="mpicker__actions">
        <button type="button" class="ds-btn is-primary" @click="openPicker">
          {{ modelValue ? 'تغيير الصورة' : 'اختيار من الوسائط' }}
        </button>
        <button v-if="modelValue" type="button" class="ds-btn" @click="clear">إزالة</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="open" class="mpicker__overlay" @click.self="open = false">
        <div class="mpicker__modal">
          <div class="mpicker__head">
            <h3>مكتبة الوسائط — مجلد {{ folder === 'blog' ? 'المدونة' : folder }}</h3>
            <button type="button" class="mpicker__x" @click="open = false">×</button>
          </div>
          <div class="mpicker__body">
            <FolderSidebar />
            <div class="mpicker__main">
              <MediaUploader />
              <MediaSearch />
              <MediaGrid
                :images="store.images"
                :loading="store.loading"
                :selected-images="[]"
                @select="onSelect"
              />
              <p v-if="multiple" class="mpicker__hint">
                انقر على الصور لاختيار أكثر من صورة ({{ picked.length }} محددة).
              </p>
            </div>
          </div>
          <div class="mpicker__foot">
            <button v-if="multiple" type="button" class="ds-btn is-primary" @click="confirmMany">
              تأكيد الاختيار ({{ picked.length }})
            </button>
            <span v-else class="mpicker__hint">انقر على أي صورة لاختيارها.</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mpicker__current { display: flex; align-items: center; gap: 14px; }
.mpicker__thumb {
  width: 72px; height: 72px; border-radius: 12px; overflow: hidden;
  border: 1px solid var(--ds-border); background: var(--ds-surface-2); flex-shrink: 0;
}
.mpicker__thumb img { width: 100%; height: 100%; object-fit: cover; }
.mpicker__thumbs { display: flex; gap: 6px; flex-wrap: wrap; }
.mpicker__thumbs img { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; border: 1px solid var(--ds-border); }
.mpicker__empty {
  width: 72px; height: 72px; border-radius: 12px; display: grid; place-items: center;
  border: 1px dashed var(--ds-border); color: var(--ds-text-muted); font-size: 11px; text-align: center; padding: 4px;
}
.mpicker__actions { display: flex; gap: 8px; flex-wrap: wrap; }

.mpicker__overlay {
  position: fixed; inset: 0; background: rgba(15,17,22,.6);
  display: grid; place-items: center; padding: 20px; z-index: 1300;
}
.mpicker__modal {
  width: 100%; max-width: 1000px; max-height: 90vh; display: flex; flex-direction: column;
  background: var(--ds-surface); border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius); box-shadow: var(--ds-shadow); overflow: hidden;
}
.mpicker__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-block-end: 1px solid var(--ds-border);
}
.mpicker__head h3 { margin: 0; font-size: 16px; font-weight: 800; }
.mpicker__x { width: 32px; height: 32px; border: none; border-radius: 8px; background: var(--ds-surface-2); color: var(--ds-text); font-size: 20px; cursor: pointer; }
.mpicker__body { display: grid; grid-template-columns: 220px 1fr; gap: 16px; padding: 16px; overflow: auto; }
.mpicker__main { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.mpicker__hint { margin: 0; font-size: 12.5px; color: var(--ds-text-muted); }
.mpicker__foot { padding: 12px 18px; border-block-start: 1px solid var(--ds-border); display: flex; justify-content: flex-end; }

@media (max-width: 760px) {
  .mpicker__body { grid-template-columns: 1fr; }
}
</style>
