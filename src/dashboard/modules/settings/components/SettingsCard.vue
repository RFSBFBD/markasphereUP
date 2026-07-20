<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <section class="set-card">
    <header v-if="title" class="set-card__head">
      <h3 class="set-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="set-card__sub">{{ subtitle }}</p>
    </header>
    <div class="set-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.set-card {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  overflow: hidden;
}
.set-card__head {
  padding: 16px 20px;
  border-block-end: 1px solid var(--ds-border);
  background: var(--ds-surface-2);
}
.set-card__title { margin: 0; font-size: 16px; font-weight: 800; color: var(--ds-text); }
.set-card__sub { margin: 4px 0 0; font-size: 12.5px; color: var(--ds-text-muted); }
.set-card__body { padding: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 900px) { .set-card__body { grid-template-columns: 1fr; } }
</style>
