<script setup>
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@/dashboard/modules/media/stores/mediaStore'
import { MEDIA_FOLDERS } from '@/dashboard/modules/media/utils/helpers'

const store = useMediaStore()
const { currentFolder } = storeToRefs(store)

const items = [{ value: 'all', label: 'الكل' }, ...MEDIA_FOLDERS]

function pick(v) {
  store.setFolder(v)
}
</script>

<template>
  <aside class="fside">
    <p class="fside__title">المجلدات</p>
    <button
      v-for="f in items"
      :key="f.value"
      type="button"
      class="fside__item"
      :class="{ on: currentFolder === f.value }"
      @click="pick(f.value)"
    >
      <span class="fside__dot" />
      {{ f.label }}
    </button>
  </aside>
</template>

<style scoped>
.fside {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  box-shadow: var(--ds-shadow);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fside__title { margin: 0 0 8px; font-size: 12.5px; font-weight: 800; color: var(--ds-text-muted); }
.fside__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border: none;
  background: none;
  border-radius: var(--ds-radius-sm);
  color: var(--ds-text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: start;
  transition: background .15s ease, color .15s ease;
}
.fside__item:hover { background: var(--ds-surface-2); color: var(--ds-text); }
.fside__item.on { background: var(--ds-primary-soft); color: var(--ds-primary); }
.fside__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: currentColor; opacity: .8; flex-shrink: 0;
}
</style>
