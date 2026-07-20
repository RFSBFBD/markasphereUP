<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@/dashboard/modules/media/stores/mediaStore'

const store = useMediaStore()
const { search } = storeToRefs(store)

const value = ref(search.value)

let debounce
watch(value, (val) => {
  clearTimeout(debounce)
  debounce = setTimeout(() => store.setSearch(val), 350)
})
</script>

<template>
  <div class="msearch">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
    <input v-model="value" type="text" placeholder="بحث باسم الملف..." />
  </div>
</template>

<style scoped>
.msearch {
  position: relative;
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
}
.msearch svg {
  position: absolute;
  inset-inline-start: 12px;
  width: 18px; height: 18px;
  color: var(--ds-text-muted);
}
.msearch input {
  width: 100%;
  padding: 10px 38px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface);
  color: var(--ds-text);
  font-size: 14px;
  outline: none;
}
.msearch input:focus { border-color: var(--ds-primary); }
</style>
