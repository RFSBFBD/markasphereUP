<template>
  <div class="portfolio-page">
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__tag" ref="heroTag">Portfolio</p>
        <h1 class="page-hero__title" ref="heroTitle">الأعمال</h1>
        <p class="page-hero__desc" ref="heroDesc">
          مختارات من أحدث المشاريع التي نفتخر بها
        </p>
      </div>
    </section>

    <PortfolioSection />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePageLoadAnimation } from '@/composables/animations/useMotionSystem'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'

const { heroEntrance } = usePageLoadAnimation()

const heroTag = ref(null)
const heroTitle = ref(null)
const heroDesc = ref(null)

onMounted(() => {
  heroEntrance({
    tag: heroTag.value,
    lines: [heroTitle.value],
    desc: heroDesc.value
  })
})
</script>

<style scoped>
.portfolio-page :deep(.portfolio__filter-btn) {
  padding: 12px 28px;
  font-size: var(--text-body);
  line-height: 1.4;
  transition: color var(--duration-normal) var(--ease-primary),
              border-color var(--duration-normal) var(--ease-primary),
              background var(--duration-normal) var(--ease-primary);
}

.portfolio-page :deep(.portfolio__filter-btn:hover) {
  color: var(--color-text);
  border-color: var(--color-accent);
}

.portfolio-page :deep(.portfolio__filter-btn--active) {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  font-weight: 500;
}

.portfolio-page :deep(.portfolio__filter-btn--active:hover) {
  background: var(--color-accent-hover);
  color: #fff;
  border-color: var(--color-accent-hover);
}

.portfolio-page :deep(.portfolio__filter-btn::after) {
  display: none;
}

.portfolio-page :deep(.portfolio__filters) {
  gap: var(--space-sm);
}

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
