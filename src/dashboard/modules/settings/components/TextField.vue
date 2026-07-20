<script setup>
const props = defineProps({
  modelValue: { type: [String, null], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  dir: { type: String, default: 'auto' },
  rows: { type: Number, default: 3 },
})
const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="tf" :class="{ 'tf--invalid': error }">
    <label v-if="label" class="tf__label">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      class="tf__input tf__textarea"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :dir="dir"
      @input="onInput"
    ></textarea>
    <input
      v-else
      class="tf__input"
      :type="type === 'textarea' ? 'text' : type"
      :value="modelValue"
      :placeholder="placeholder"
      :dir="dir"
      @input="onInput"
    />
    <span v-if="error" class="tf__err">{{ error }}</span>
    <span v-else-if="hint" class="tf__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.tf { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.tf__label { font-size: 13px; font-weight: 700; color: var(--ds-text); }
.tf__input {
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--ds-border);
  background: var(--ds-surface);
  color: var(--ds-text);
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  width: 100%;
}
.tf__textarea { height: auto; padding: 10px 12px; resize: vertical; line-height: 1.7; }
.tf__input:focus { outline: none; border-color: var(--ds-primary); box-shadow: 0 0 0 3px var(--ds-primary-soft, rgba(109, 40, 217, 0.15)); }
.tf--invalid .tf__input { border-color: var(--ds-danger); }
.tf__err { font-size: 12px; color: var(--ds-danger); }
.tf__hint { font-size: 12px; color: var(--ds-text-muted); }
</style>
