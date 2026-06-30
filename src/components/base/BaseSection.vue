<template>
  <section class="base-section">
    <div class="container">
      <slot />
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.base-section {
  padding: var(--space-5xl) 0;
}
</style>