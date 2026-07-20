<template>
  <RouterLink :to="{ name: 'portfolio-case', params: { slug: project.slug } }" class="portfolio-card" ref="cardRef" @click.capture="onCardClick">
    <div class="portfolio-card__image card-image" :style="cardImageStyle">
      <span class="portfolio-card__number">{{ String(project.id).padStart(2, '0') }}</span>
      <div class="portfolio-card__overlay card-overlay">
        <span class="portfolio-card__view card-view">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </div>

    <div class="portfolio-card__info">
      <h3 class="portfolio-card__title">{{ locale === 'ar' ? project.titleAr : project.titleEn }}</h3>
      <p class="portfolio-card__category">{{ categoryLabel }}</p>
      <p class="portfolio-card__desc">{{ locale === 'ar' ? project.descriptionAr : project.descriptionEn }}</p>
      <span class="portfolio-card__accent-line"></span>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import { getCategoryLabel } from '@/constants/categories'
import { optimizeUrl } from '@/composables/services/image'

const props = defineProps({
  project: { type: Object, required: true },
  locale: { type: String, default: 'ar' },
  suppressClick: { type: Boolean, default: false }
})

function onCardClick(e) {
  if (props.suppressClick) {
    e.preventDefault()
    e.stopPropagation()
  }
}

const { imageCardHover } = useHoverSystem()
const cardRef = ref(null)

const categoryLabel = computed(() =>
  getCategoryLabel(props.project.category, props.locale)
)

const cardImageStyle = computed(() => {
  if (!props.project.thumbnail) return { background: props.project.gradient }
  const url = optimizeUrl(props.project.thumbnail, { width: 400, height: 300, crop: 'fill' })
  return {
    backgroundImage: `url(${url}), ${props.project.gradient}`,
    backgroundSize: 'cover, auto',
    backgroundPosition: 'center, 0 0',
    backgroundRepeat: 'no-repeat, repeat'
  }
})

onMounted(() => {
  if (cardRef.value) imageCardHover(cardRef.value)
})
</script>
