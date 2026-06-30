<template>
  <div class="blog-page">
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__tag">Blog</p>
        <h1 class="page-hero__title">المقالات</h1>
        <p class="page-hero__desc">
          رؤى ومقالات حول التصميم والتطوير والتسويق الرقمي
        </p>
      </div>
    </section>

    <BlogPreview />
  </div>
</template>

<script setup>
import BlogPreview from '@/components/sections/BlogPreview.vue'
</script>

<style scoped>
.page-hero {
  padding: 160px 0 80px;
  text-align: center;
}

.page-hero__tag {
  font-family: var(--font-body-en);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.page-hero__title {
  font-family: var(--font-display-ar);
  font-size: var(--text-display-xl);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.page-hero__desc {
  font-family: var(--font-body-ar);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  max-width: 560px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .page-hero__title {
    font-size: var(--text-h1);
  }
}
</style>
