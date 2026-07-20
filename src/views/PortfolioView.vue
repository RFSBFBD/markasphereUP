<template>
  <div class="portfolio-page">
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__tag" ref="heroTag">{{ t('pageHero.portfolio.tag') }}</p>
        <h1 class="page-hero__title" ref="heroTitle">{{ t('pageHero.portfolio.title') }}</h1>
        <p class="page-hero__desc" ref="heroDesc">
          {{ t('pageHero.portfolio.desc') }}
        </p>
      </div>
    </section>

    <section class="portfolio-archive">
      <div class="container">
        <div class="portfolio-archive__controls">
          <div class="portfolio-archive__filters">
            <button
              v-for="cat in localizedCategories"
              :key="cat.id"
              class="archive-filter"
              :class="{ 'archive-filter--active': activeFilter === cat.id }"
              :aria-pressed="activeFilter === cat.id"
              @click="setFilter(cat.id)"
            >
              {{ cat.label }}
            </button>
          </div>

          <div class="portfolio-archive__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="search"
              type="search"
              :placeholder="t('portfolio.search')"
              aria-label="search"
            />
          </div>
        </div>

        <div v-if="loading" class="portfolio-archive__state">{{ t('common.loading') }}</div>
        <div v-else-if="error" class="portfolio-archive__state portfolio-archive__state--error">{{ t('common.error') }}</div>
        <div v-else-if="!filteredProjects.length" class="portfolio-archive__state">{{ t('portfolio.empty') }}</div>

        <div v-else class="portfolio-archive__grid" ref="gridRef">
          <PortfolioCard
            v-for="item in visibleProjects"
            :key="item.id"
            :project="item"
            :locale="locale"
            :suppress-click="false"
          />
        </div>

        <div v-if="hasMore" class="portfolio-archive__more">
          <button class="archive-more-btn" @click="loadMore">{{ t('portfolio.loadMore') }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageLoadAnimation } from '@/composables/animations/useMotionSystem'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import PortfolioCard from '@/components/portfolio/PortfolioCard.vue'
import { projectsPublicService } from '@/data/portfolio/projects/publicService'
import { PORTFOLIO_FILTERS, getCategoryLabel } from '@/constants/categories'
import { MOTION, isMobile } from '@/composables/animations/motion.config'
import '@/styles/sections/portfolio.css'

const { heroEntrance } = usePageLoadAnimation()
const { staggerCards } = useScrollReveal()

const { t, locale } = useI18n()

const heroTag = ref(null)
const heroTitle = ref(null)
const heroDesc = ref(null)
const gridRef = ref(null)

const allProjects = ref([])
const loading = ref(true)
const error = ref(false)
const activeFilter = ref('all')
const search = ref('')
const visibleCount = ref(8)

const PAGE_SIZE = 8

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

const filteredProjects = computed(() => {
  const q = search.value.trim().toLowerCase()
  return allProjects.value.filter((p) => {
    const matchCat = activeFilter.value === 'all' || p.category === activeFilter.value
    if (!matchCat) return false
    if (!q) return true
    const hay = `${p.titleAr} ${p.titleEn} ${p.descriptionAr} ${p.descriptionEn} ${p.client}`.toLowerCase()
    return hay.includes(q)
  })
})

const visibleProjects = computed(() => filteredProjects.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredProjects.value.length)

const localizedCategories = computed(() =>
  PORTFOLIO_FILTERS.map((id) => ({ id, label: getCategoryLabel(id, locale.value) }))
)

function revealGrid() {
  if (!gridRef.value) return
  const cards = Array.from(gridRef.value.children)
  if (cards.length) {
    staggerCards(cards, {
      duration: isMobile() ? 0.35 : MOTION.card,
      stagger: isMobile() ? 0.06 : MOTION.stagger
    })
  }
}

async function setFilter(id) {
  if (activeFilter.value === id) return
  activeFilter.value = id
  visibleCount.value = PAGE_SIZE
  await nextTick()
  revealGrid()
}

function loadMore() {
  visibleCount.value += PAGE_SIZE
  nextTick(revealGrid)
}

async function loadProjects() {
  loading.value = true
  error.value = false
  try {
    const result = await projectsPublicService.getAll({ perPage: 100, published: true })
    allProjects.value = sortProjects(result.data || [])
  } catch (e) {
    error.value = true
    if (import.meta.env.DEV) console.error('[PortfolioView] load failed', e)
  } finally {
    loading.value = false
    await nextTick()
    revealGrid()
  }
}

watch(search, () => { visibleCount.value = PAGE_SIZE })

onMounted(() => {
  heroEntrance({
    tag: heroTag.value,
    lines: [heroTitle.value],
    desc: heroDesc.value
  })
  loadProjects()
})
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

.portfolio-archive { padding: var(--space-3xl) 0 var(--space-4xl); }

.portfolio-archive__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-3xl);
}

.portfolio-archive__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.archive-filter {
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-body);
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-none);
  padding: 10px 22px;
  cursor: pointer;
  transition: color var(--duration-normal) var(--ease-primary),
              border-color var(--duration-normal) var(--ease-primary),
              background var(--duration-normal) var(--ease-primary);
}

.archive-filter:hover { color: var(--color-text); border-color: var(--color-text-muted); }

.archive-filter--active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  font-weight: 500;
}

.portfolio-archive__search {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  min-width: 240px;
}

.portfolio-archive__search input {
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-ar-body);
  font-size: var(--text-body);
  width: 100%;
}

.portfolio-archive__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

.portfolio-archive__state {
  text-align: center;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  padding: var(--space-3xl) 0;
}

.portfolio-archive__state--error { color: var(--color-accent); }

.portfolio-archive__more { display: flex; justify-content: center; margin-top: var(--space-3xl); }

.archive-more-btn {
  font-family: var(--font-ar-body);
  font-weight: 500;
  font-size: var(--text-body);
  color: var(--color-accent);
  background: transparent;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
  padding: var(--space-sm) var(--space-xl);
  cursor: pointer;
  transition: background var(--duration-normal) var(--ease-primary), color var(--duration-normal) var(--ease-primary);
}

.archive-more-btn:hover { background: var(--color-accent); color: #fff; }

@media (max-width: 1024px) {
  .portfolio-archive__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .page-hero {
    padding: 120px 0 56px;
  }
  .page-hero__title {
    font-size: var(--text-h1);
  }
}

@media (max-width: 640px) {
  .portfolio-archive__controls { flex-direction: column; align-items: stretch; }
  .portfolio-archive__search { min-width: 0; }
  .portfolio-archive__grid { grid-template-columns: 1fr; gap: var(--space-lg); }
}
</style>
