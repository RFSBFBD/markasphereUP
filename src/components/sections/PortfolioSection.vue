<template>
   
  <BaseSection id="portfolio">
    <div class="portfolio">
      <div class="portfolio__header" ref="headerRef">
        <p class="portfolio__tag">{{ t('portfolio.tag') }}</p>
        <h2 class="portfolio__title">{{ t('portfolio.title') }}</h2>
        <p class="portfolio__subtitle">
          {{ t('portfolio.subtitle') }}
        </p>
      </div>

      <div v-if="loading" class="portfolio__state portfolio__state--loading">
        {{ t('common.loading') }}
      </div>

      <div v-else-if="error" class="portfolio__state portfolio__state--error">
        {{ t('common.error') }}
      </div>

      <template v-else>
        <div class="portfolio__filters" ref="filtersRef">
          <button
            v-for="cat in localizedCategories"
            :key="cat.id"
            class="portfolio__filter-btn"
            :class="{ 'portfolio__filter-btn--active': activeFilter === cat.id }"
            :aria-pressed="activeFilter === cat.id"
            @click="setFilter(cat.id)"
            ref="filterBtnRefs"
          >
            {{ cat.label }}
          </button>
        </div>

        <div v-if="!filteredProjects.length" class="portfolio__state portfolio__state--empty">
          {{ t('portfolio.empty') }}
        </div>

        <div v-else class="portfolio__slider" ref="sliderRef">
          <button
            class="portfolio__nav portfolio__nav--prev"
            @click="slidePrev"
            aria-label="Previous projects"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="portfolio__track" ref="trackRef">
            <PortfolioCard
              v-for="item in filteredProjects"
              :key="item.id"
              :project="item"
              :locale="locale"
              :suppress-click="suppressClick"
            />
          </div>

          <button
            class="portfolio__nav portfolio__nav--next"
            @click="slideNext"
            aria-label="Next projects"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </template>

      <div class="portfolio__cta">
        <RouterLink :to="{ name: 'portfolio' }" class="portfolio__btn">
          <span>{{ t('blog.viewAll') }}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import PortfolioCard from '@/components/portfolio/PortfolioCard.vue'
import { projectsPublicService } from '@/data/portfolio/projects/publicService'
import { PORTFOLIO_FILTERS, getCategoryLabel } from '@/constants/categories'
import { useScrollReveal, useStagger } from '@/composables/animations/useMotionSystem'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import { MOTION } from '@/composables/animations/motion.config'
import { createSlider } from '@/composables/services/PortfolioSlider'
import { getSliderSpeed } from '@/composables/services/slider.config'
import '@/styles/sections/portfolio.css'

const props = defineProps({
  featuredOnly: { type: Boolean, default: false }
})

const slider = createSlider()
const { slideNext, slidePrev, suppressClick } = slider

const { t, locale } = useI18n()
const { headerReveal } = useScrollReveal()
const { stagger } = useStagger()
const { imageCardHover, removeHover } = useHoverSystem()

let filterTween = null

const headerRef = ref(null)
const filtersRef = ref(null)
const filterBtnRefs = ref([])
const trackRef = ref(null)
const sliderRef = ref(null)

const activeFilter = ref('all')
const projects = ref([])
const loading = ref(true)
const error = ref(false)

// Order: featured first (by display_order), then newest (created_at DESC),
// then remaining. Single fetch, sorted client-side to avoid extra queries.
function sortProjects(list) {
  return [...list].sort((a, b) => {
    const af = a.featured ? 1 : 0
    const bf = b.featured ? 1 : 0
    if (af !== bf) return bf - af
    const ao = a.displayOrder || 0
    const bo = b.displayOrder || 0
    if (ao !== bo) return ao - bo
    const at = new Date(a.createdAt || 0).getTime()
    const bt = new Date(b.createdAt || 0).getTime()
    return bt - at
  })
}

const allProjects = computed(() =>
  props.featuredOnly
    ? projects.value.filter(p => p.featured)
    : projects.value
)

const filteredProjects = computed(() => {
  const base = allProjects.value
  if (activeFilter.value === 'all') return base
  return base.filter(p => p.category === activeFilter.value)
})

const localizedCategories = computed(() =>
  PORTFOLIO_FILTERS.map(id => ({
    id,
    label: getCategoryLabel(id, locale.value)
  }))
)

function startSlider() {
  if (!trackRef.value || !trackRef.value.children.length) return
  slider.destroy()
  slider.init(trackRef.value, sliderRef.value, getSliderSpeed('portfolio'), (clone) => {
    imageCardHover(clone)
  })
}

const setFilter = async (categoryId) => {
  if (activeFilter.value === categoryId) return

  slider.destroy()
  if (trackRef.value) {
    const cloneStart = Math.floor(trackRef.value.children.length / 2)
    for (let i = trackRef.value.children.length - 1; i >= cloneStart; i--) {
      removeHover(trackRef.value.children[i])
    }
  }
  slider.cleanup(trackRef.value)
  activeFilter.value = categoryId
  await nextTick()
  startSlider()
}

async function loadProjects() {
  loading.value = true
  error.value = false
  try {
    const result = await projectsPublicService.getAll({ perPage: 100, published: true })
    projects.value = sortProjects(result.data || [])
  } catch (e) {
    error.value = true
    if (import.meta.env.DEV) console.error('[PortfolioSection] load failed', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  startSlider()

  headerReveal(headerRef.value)

  if (filtersRef.value) {
    filterTween = stagger(filterBtnRefs.value, {
      opacity: 0,
      y: 15,
      duration: MOTION.card,
      stagger: MOTION.staggerTight,
      ease: MOTION.ease.primary,
      scrollTrigger: {
        trigger: filtersRef.value,
        start: 'top 85%'
      }
    })
  }
})

watch(filteredProjects, async (list) => {
  if (!list.length) return
  await nextTick()
  startSlider()
})

onUnmounted(() => {
  if (filterTween) {
    if (filterTween.scrollTrigger) filterTween.scrollTrigger.kill()
    filterTween.kill()
    filterTween = null
  }
  slider.destroy()
})

loadProjects()
</script>

<style scoped>
.portfolio { text-align: center; }

.portfolio__header { margin-bottom: var(--space-3xl); }

.portfolio__tag {
  font-family: var(--font-en-body);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.portfolio__title {
  font-family: var(--font-ar-h2);
  font-weight: 600;
  font-size: var(--text-display-lg);
  line-height: var(--lh-heading);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.portfolio__subtitle {
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  max-width: 480px;
  margin: 0 auto;
}

.portfolio__filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-3xl);
}

.portfolio__filter-btn {
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-body);
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-none);
  padding: 10px 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: color var(--duration-normal) var(--ease-primary),
              border-color var(--duration-normal) var(--ease-primary),
              background var(--duration-normal) var(--ease-primary);
}

.portfolio__filter-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width var(--duration-normal) var(--ease-primary);
}

.portfolio__filter-btn:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.portfolio__filter-btn--active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  font-weight: 500;
}

.portfolio__filter-btn--active::after {
  width: 100%;
}

@media (max-width: 640px) {
  .portfolio__title { font-size: var(--text-h2); }
  .portfolio__filters { gap: var(--space-xs); overflow-x: auto; flex-wrap: nowrap; justify-content: flex-start; padding-bottom: var(--space-xs); -webkit-overflow-scrolling: touch; }
  .portfolio__filter-btn { padding: 8px 16px; font-size: var(--text-small); white-space: nowrap; flex-shrink: 0; }
}

.portfolio__state {
  text-align: center;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  padding: var(--space-3xl) 0;
}

.portfolio__state--error { color: var(--color-accent); }
</style>
