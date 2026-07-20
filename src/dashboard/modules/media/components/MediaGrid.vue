<script setup>
import MediaCard from '@/dashboard/modules/media/components/MediaCard.vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  selectedImages: { type: Array, default: () => [] },
})
const emit = defineEmits(['select', 'preview', 'delete', 'copy'])
</script>

<template>
  <div class="mgrid-wrap">
    <div v-if="loading && !images.length" class="mgrid-loading">
      <span class="spinner" /> جارٍ التحميل...
    </div>

    <div v-else-if="!images.length" class="mgrid-empty">
      <p class="mgrid-empty__title">لا توجد صور</p>
      <p class="mgrid-empty__sub">اسحب وأفلت الصور في منطقة الرفع بالأعلى لإضافتها.</p>
    </div>

    <div v-else class="mgrid">
      <MediaCard
        v-for="img in images"
        :key="img.id"
        :image="img"
        :selected="selectedImages.includes(img.id)"
        @select="emit('select', $event)"
        @preview="emit('preview', $event)"
        @delete="emit('delete', $event)"
        @copy="emit('copy', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.mgrid-wrap { min-height: 200px; position: relative; }
.mgrid-loading {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 60px; color: var(--ds-text-muted); font-weight: 600;
}
.spinner {
  width: 18px; height: 18px;
  border: 2.5px solid var(--ds-border);
  border-top-color: var(--ds-primary);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.mgrid-empty { text-align: center; padding: 64px 16px; }
.mgrid-empty__title { margin: 0; font-size: 16px; font-weight: 700; }
.mgrid-empty__sub { margin: 6px 0 0; color: var(--ds-text-muted); font-size: 13.5px; }
.mgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 14px;
}
</style>
