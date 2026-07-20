<script setup>
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@/dashboard/modules/media/stores/mediaStore'
import MediaSearch from '@/dashboard/modules/media/components/MediaSearch.vue'

const store = useMediaStore()
const { selectedImages } = storeToRefs(store)

defineEmits(['delete-selected'])
</script>

<template>
  <div class="mtool">
    <MediaSearch />
    <div class="mtool__right">
      <span v-if="selectedImages.length" class="mtool__count">{{ selectedImages.length }} محدد</span>
      <button
        v-if="selectedImages.length"
        type="button"
        class="ds-btn is-danger"
        :disabled="store.loading"
        @click="$emit('delete-selected')"
      >
        حذف المحدد
      </button>
    </div>
  </div>
</template>

<style scoped>
.mtool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.mtool__right { display: flex; align-items: center; gap: 10px; }
.mtool__count { font-size: 13px; font-weight: 700; color: var(--ds-text-muted); }
</style>
