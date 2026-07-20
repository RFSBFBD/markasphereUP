<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/dashboard/modules/projects/stores/projectsStore'
import { PROJECT_CATEGORIES } from '@/dashboard/modules/projects/utils/helpers'

const store = useProjectsStore()
const { filters } = storeToRefs(store)

const search = ref(filters.value.search)

let debounce
watch(search, (val) => {
  clearTimeout(debounce)
  debounce = setTimeout(() => store.setFilters({ search: val }), 350)
})

function onCategory(e) {
  store.setFilters({ category: e.target.value || '' })
}
function onPublished(e) {
  const v = e.target.value
  store.setFilters({ published: v === '' ? null : v === 'true' })
}
function onFeatured(e) {
  const v = e.target.value
  store.setFilters({ featured: v === '' ? null : v === 'true' })
}
</script>

<template>
  <div class="filters">
    <div class="filters__search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input v-model="search" type="text" placeholder="بحث بالعنوان أو العميل..." />
    </div>
    <select class="filters__select" :value="filters.category" @change="onCategory">
      <option value="">كل التصنيفات</option>
      <option v-for="c in PROJECT_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
    </select>
    <select class="filters__select" :value="filters.published === null ? '' : String(filters.published)" @change="onPublished">
      <option value="">الحالة: الكل</option>
      <option value="true">منشور</option>
      <option value="false">مسودة</option>
    </select>
    <select class="filters__select" :value="filters.featured === null ? '' : String(filters.featured)" @change="onFeatured">
      <option value="">المميز: الكل</option>
      <option value="true">مميز</option>
      <option value="false">غير مميز</option>
    </select>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}
.filters__search {
  position: relative;
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
}
.filters__search svg {
  position: absolute;
  inset-inline-start: 12px;
  width: 18px;
  height: 18px;
  color: var(--ds-text-muted);
}
.filters__search input {
  width: 100%;
  padding: 10px 38px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface);
  color: var(--ds-text);
  font-size: 14px;
  outline: none;
}
.filters__search input:focus { border-color: var(--ds-primary); }
.filters__select {
  padding: 10px 12px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface);
  color: var(--ds-text);
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}
.filters__select:focus { border-color: var(--ds-primary); }
</style>
