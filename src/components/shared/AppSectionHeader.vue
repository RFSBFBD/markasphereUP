<template>
  <div class="section-header">
    <p v-if="tag" class="section-header__tag">{{ tag }}</p>
    <h2 v-if="title" class="section-header__title">{{ title }}</h2>
    <p v-if="subtitle" class="section-header__subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  tag: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})
</script>
