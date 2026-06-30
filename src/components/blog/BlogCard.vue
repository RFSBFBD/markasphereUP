<template>
  <article class="blog-card" ref="cardRef">
    <div class="blog-card__image" :style="{ background: article.gradient }">
      <span class="blog-card__category">{{ article.category }}</span>
      <div class="blog-card__read">
        <svg class="card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        {{ article.readTime }}
      </div>
    </div>

    <div class="blog-card__body">
      <div class="blog-card__meta">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>{{ article.date }}</span>
      </div>
      <h3 class="blog-card__title">{{ locale === 'ar' ? article.titleAr : article.titleEn }}</h3>
      <p class="blog-card__excerpt">{{ locale === 'ar' ? article.excerptAr : article.excerptEn }}</p>
      <span class="blog-card__link card-arrow">
        {{ t('blog.readMore') }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </div>
    <div class="blog-card__accent card-glow"></div>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'

const props = defineProps({
  article: { type: Object, required: true },
  locale: { type: String, default: 'ar' }
})

const { t } = useI18n()
const { cardHover } = useHoverSystem()
const cardRef = ref(null)

onMounted(() => {
  if (cardRef.value) cardHover(cardRef.value)
})
</script>
