<script setup>
import MediaPicker from '@/dashboard/components/MediaPicker.vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
  label: { type: String, default: '' },
  folder: { type: String, default: 'settings' },
})
const emit = defineEmits(['update:modelValue'])

function onPick(img) {
  emit('update:modelValue', img || null)
}
</script>

<template>
  <div class="mf">
    <label v-if="label" class="mf__label">{{ label }}</label>
    <MediaPicker :model-value="modelValue" :folder="folder" @update:model-value="onPick" @select="onPick" />
    <p v-if="modelValue" class="mf__hint">تم الاختيار: {{ modelValue.url }}</p>
  </div>
</template>

<style scoped>
.mf { display: flex; flex-direction: column; gap: 6px; }
.mf__label { font-size: 13px; font-weight: 700; color: var(--ds-text); }
.mf__hint { font-size: 11.5px; color: var(--ds-text-muted); margin: 0; word-break: break-all; }
</style>
