<script setup>
import { BLOG_CATEGORIES } from '../utils/helpers'

const props = defineProps({
  modelValue: { type: [String, null], default: '' },
  id: { type: String, default: 'blog-category' },
  invalid: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="field">
    <label :for="id" class="field__label">التصنيف</label>
    <select
      :id="id"
      class="field__input"
      :class="{ 'is-invalid': invalid }"
      :value="modelValue"
      @change="onInput"
    >
      <option value="" disabled>اختر التصنيف</option>
      <option v-for="c in BLOG_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
    </select>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 6px; }
.field__label { font-size: 13px; font-weight: 700; color: var(--ds-text); }
.field__input {
  height: 44px; border-radius: 10px; border: 1px solid var(--ds-border);
  background: var(--ds-surface); color: var(--ds-text); padding: 0 12px; font-size: 14px;
}
.field__input.is-invalid { border-color: var(--ds-danger); }
</style>
