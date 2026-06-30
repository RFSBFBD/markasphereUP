<template>
  <BaseSection>
    <div class="blog">
      <div class="blog__header" ref="headerRef">
        <div>
          <p class="blog__tag">{{ t('blog.tag') }}</p>
          <h2 class="blog__title">{{ t('blog.title') }}</h2>
        </div>
        <router-link :to="{ name: 'blog' }" class="blog__view-all">
          {{ t('blog.viewAll') }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>

      <div class="blog__slider" ref="sliderRef">
        <button
          class="blog__nav blog__nav--prev"
          @click="slidePrev"
          aria-label="Previous articles"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div class="blog__track" ref="trackRef">
          <div
            class="portfolio-card"
            v-for="post in articles"
            :key="post.id"
          >
            <BlogCard
              :article="post"
              :locale="locale"
            />
          </div>
        </div>

        <button
          class="blog__nav blog__nav--next"
          @click="slideNext"
          aria-label="Next articles"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div class="blog__footer">
        <router-link :to="{ name: 'blog' }" class="blog__view-all-link">
          {{ t('blog.viewAll') }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import { articles } from '@/data/articles'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { createSlider } from '@/composables/services/PortfolioSlider'
import { getSliderSpeed } from '@/composables/services/slider.config'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import '@/styles/sections/blog.css'

const { t, locale } = useI18n()
const { headerReveal } = useScrollReveal()
const { cardHover } = useHoverSystem()

const slider = createSlider()
const { slideNext, slidePrev } = slider

const headerRef = ref(null)
const sliderRef = ref(null)
const trackRef = ref(null)

onMounted(() => {
  headerReveal(headerRef.value)
  slider.init(trackRef.value, sliderRef.value, getSliderSpeed('blog'), (clone) => {
    cardHover(clone)
  })
})

onUnmounted(() => {
  slider.destroy()
})
</script>

<style scoped>
.blog__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--space-3xl);
}

.blog__tag {
  font-family: var(--font-en-body);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.blog__title {
  font-family: var(--font-ar-h2);
  font-weight: 600;
  font-size: var(--text-display-lg);
  line-height: var(--lh-heading);
  color: var(--color-text);
}

.blog__view-all {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-ar-body);
  font-weight: 500;
  font-size: var(--text-body);
  color: var(--color-accent);
  text-decoration: none;
  transition: gap var(--duration-fast) var(--ease-primary);
}

.blog__view-all:hover { gap: var(--space-sm); color: var(--color-text); }

.blog__footer {
  display: flex;
  justify-content: center;
  margin-top: var(--space-3xl);
}

.blog__view-all-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-ar-body);
  font-weight: 500;
  font-size: var(--text-body);
  color: var(--color-accent);
  text-decoration: none;
  padding: var(--space-sm) var(--space-xl);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
  transition: background var(--duration-normal) var(--ease-primary),
              color var(--duration-normal) var(--ease-primary),
              gap var(--duration-fast) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.blog__view-all-link:hover {
  background: var(--color-accent);
  color: #fff;
  gap: var(--space-md);
  box-shadow: var(--shadow-btn-accent);
}

@media (max-width: 640px) {
  .blog__header { flex-direction: column; align-items: flex-start; gap: var(--space-md); }
  .blog__title { font-size: var(--text-h2); }
}
</style>
