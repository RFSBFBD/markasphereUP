<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@/dashboard/modules/media/stores/mediaStore'
import { useToast } from '@/dashboard/composables/useToast'
import FolderSidebar from '@/dashboard/modules/media/components/FolderSidebar.vue'
import MediaToolbar from '@/dashboard/modules/media/components/MediaToolbar.vue'
import MediaUploader from '@/dashboard/modules/media/components/MediaUploader.vue'
import MediaGrid from '@/dashboard/modules/media/components/MediaGrid.vue'
import ImagePreviewModal from '@/dashboard/modules/media/components/ImagePreviewModal.vue'
import DeleteDialog from '@/dashboard/modules/media/components/DeleteDialog.vue'

const store = useMediaStore()
const toast = useToast()
const { images, loading, pagination, selectedImages, search, currentFolder } = storeToRefs(store)

const preview = ref(null)
const deleteTarget = ref(null)
const bulkDelete = ref(false)
const deleting = ref(false)

const deleteCount = computed(() => {
  if (bulkDelete.value) return selectedImages.value.length
  return deleteTarget.value ? 1 : 0
})
const deleteName = computed(() =>
  deleteTarget.value && !bulkDelete.value ? deleteTarget.value.name || '' : ''
)

onMounted(() => store.loadImages())

watch(
  () => ({ f: currentFolder.value, s: search.value }),
  () => store.loadImages()
)
watch(
  () => pagination.value.page,
  () => store.loadImages()
)

function toggleSelect(img) {
  if (selectedImages.value.includes(img.id)) store.unselect(img.id)
  else store.select(img.id)
}
function copy(img) {
  if (!img) return
  navigator.clipboard
    ?.writeText(img.url)
    .then(() => toast.success('تم نسخ الرابط'))
    .catch(() => toast.error('تعذر النسخ'))
}
function askDelete(img) {
  deleteTarget.value = img
  bulkDelete.value = false
}
function askDeleteSelected() {
  if (!selectedImages.value.length) return
  deleteTarget.value = { bulk: true }
  bulkDelete.value = true
}
async function confirmDelete() {
  deleting.value = true
  try {
    if (bulkDelete.value) await store.deleteSelected()
    else await store.deleteImage(deleteTarget.value.id)
    toast.success('تم الحذف')
  } catch (e) {
    toast.error(e.message || 'فشل الحذف')
  } finally {
    deleting.value = false
    deleteTarget.value = null
  }
}
function onPreviewDelete(img) {
  preview.value = null
  askDelete(img)
}
function goPage(p) {
  if (p >= 1 && p <= pagination.value.pages) {
    store.setPage(p)
    store.loadImages()
  }
}
</script>

<template>
  <section class="media">
    <div class="media__layout">
      <FolderSidebar />
      <div class="media__main">
        <MediaUploader />
        <MediaToolbar @delete-selected="askDeleteSelected" />
        <MediaGrid
          :images="images"
          :loading="loading"
          :selected-images="selectedImages"
          @select="toggleSelect"
          @preview="preview = $event"
          @delete="askDelete"
          @copy="copy"
        />

        <div v-if="!loading && pagination.pages > 1" class="pager">
          <button class="ds-btn" type="button" :disabled="pagination.page <= 1" @click="goPage(pagination.page - 1)">السابق</button>
          <span class="pager__info">صفحة {{ pagination.page }} من {{ pagination.pages }}</span>
          <button class="ds-btn" type="button" :disabled="pagination.page >= pagination.pages" @click="goPage(pagination.page + 1)">التالي</button>
        </div>
      </div>
    </div>

    <ImagePreviewModal :image="preview" @close="preview = null" @delete="onPreviewDelete" @copy="copy" />
    <DeleteDialog
      :count="deleteCount"
      :name="deleteName"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </section>
</template>

<style scoped>
.media__layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 18px;
  align-items: start;
}
.media__main { min-width: 0; }
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 16px;
}
.pager__info { font-size: 13.5px; color: var(--ds-text-muted); font-weight: 600; }

@media (max-width: 860px) {
  .media__layout { grid-template-columns: 1fr; }
}
</style>
