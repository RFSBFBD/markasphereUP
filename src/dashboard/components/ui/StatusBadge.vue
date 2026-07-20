<script setup>
const props = defineProps({
  type: { type: String, default: 'published' }, // 'published' | 'featured'
  value: { type: Boolean, default: false },
})

const label = props.type === 'featured'
  ? (props.value ? 'مميز' : 'عادي')
  : (props.value ? 'منشور' : 'مسودة')
</script>

<template>
  <span class="ds-badge-pill" :class="[`is-${type}`, value ? 'is-on' : 'is-off']">
    <span class="ds-badge-pill__dot" />
    {{ label }}
  </span>
</template>

<style scoped>
.ds-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.ds-badge-pill__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.ds-badge-pill.is-published.is-on {
  background: #e7f7ee;
  color: #16a34a;
}
.ds-badge-pill.is-published.is-off {
  background: #f1f2f4;
  color: #98a0ad;
}
.ds-badge-pill.is-featured.is-on {
  background: #fef3e2;
  color: #d97706;
}
.ds-badge-pill.is-featured.is-off {
  background: #f1f2f4;
  color: #98a0ad;
}
.ds-dark .ds-badge-pill.is-published.is-on {
  background: #0f2e1c;
  color: #4ade80;
}
.ds-dark .ds-badge-pill.is-featured.is-on {
  background: #2e2310;
  color: #fbbf24;
}
.ds-dark .ds-badge-pill.is-published.is-off,
.ds-dark .ds-badge-pill.is-featured.is-off {
  background: #1c232c;
  color: #9aa4b2;
}
</style>
