<template>
  <div class="blog-page">
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__tag">{{ t('pageHero.blog.tag') }}</p>
        <h1 class="page-hero__title">{{ t('pageHero.blog.title') }}</h1>
        <p class="page-hero__desc">
          {{ t('pageHero.blog.desc') }}
        </p>
      </div>
    </section>

    <section class="blog-archive">
      <div class="container">
        <div class="blog-archive__controls">
          <div class="blog-archive__filters">
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

          <div class="blog-archive__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="search"
              type="search"
              :placeholder="t('blog.search')"
              aria-label="search"
            />
          </div>
        </div>

        <div v-if="loading" class="blog-archive__state">{{ t('common.loading') }}</div>
        <div v-else-if="error" class="blog-archive__state blog-archive__state--error">{{ t('common.error') }}</div>
        <div v-else-if="!filteredArticles.length" class="blog-archive__state">{{ t('blog.empty') }}</div>

        <div v-else class="blog-archive__grid" ref="gridRef">
          <RouterLink
            v-for="article in filteredArticles"
            :key="article.id"
            :to="{ name: 'blog-article', params: { slug: article.slug } }"
            class="blog-archive__link"
          >
            <BlogCard :article="article" :locale="locale" />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import BlogCard from '@/components/blog/BlogCard.vue'
import { blogService } from '@/services/BlogService'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { MOTION, isMobile } from '@/composables/animations/motion.config'
import '@/styles/sections/blog.css'

const { t, locale } = useI18n()
const { staggerCards } = useScrollReveal()

const gridRef = ref(null)
const articles = ref([])
const loading = ref(true)
const error = ref(false)
const activeFilter = ref('all')
const search = ref('')

const BLOG_CATEGORIES = [
  { id: 'all', label: 'الكل', labelEn: 'All' },
  { id: 'branding', label: 'الهوية التجارية', labelEn: 'Branding' },
  { id: 'marketing', label: 'التسويق', labelEn: 'Marketing' },
  { id: 'web', label: 'الويب', labelEn: 'Web' },
  { id: 'content', label: 'المحتوى', labelEn: 'Content' },
  { id: 'strategy', label: 'الاستراتيجية', labelEn: 'Strategy' }
]

const localizedCategories = computed(() =>
  BLOG_CATEGORIES.map((c) => ({ id: c.id, label: locale.value === 'ar' ? c.label : c.labelEn }))
)

const filteredArticles = computed(() => {
  const q = search.value.trim().toLowerCase()
  return articles.value.filter((a) => {
    const matchCat = activeFilter.value === 'all' || a.category === activeFilter.value
    if (!matchCat) return false
    if (!q) return true
    const hay = `${a.titleAr} ${a.titleEn} ${a.excerptAr} ${a.excerptEn}`.toLowerCase()
    return hay.includes(q)
  })
})

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
  await nextTick()
  revealGrid()
}

async function loadArticles() {
  loading.value = true
  error.value = false
  try {
    const data = await blogService.getAll({ limit: 100, published: true })
    articles.value = data || []
  } catch (e) {
    error.value = true
    if (import.meta.env.DEV) console.error('[BlogView] load failed', e)
  } finally {
    loading.value = false
    await nextTick()
    revealGrid()
  }
}

watch(search, () => {})

onMounted(loadArticles)
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

.blog-archive { padding: var(--space-3xl) 0 var(--space-4xl); }

.blog-archive__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-3xl);
}

.blog-archive__filters {
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

.blog-archive__search {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  min-width: 240px;
}

.blog-archive__search input {
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-ar-body);
  font-size: var(--text-body);
  width: 100%;
}

.blog-archive__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

.blog-archive__link {
  text-decoration: none;
  color: inherit;
}

.blog-archive__state {
  text-align: center;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  padding: var(--space-3xl) 0;
}

.blog-archive__state--error { color: var(--color-accent); }

@media (max-width: 1024px) {
  .blog-archive__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .page-hero { padding: 120px 0 56px; }
  .page-hero__title { font-size: var(--text-h1); }
}

@media (max-width: 640px) {
  .blog-archive__controls { flex-direction: column; align-items: stretch; }
  .blog-archive__search { min-width: 0; }
  .blog-archive__grid { grid-template-columns: 1fr; gap: var(--space-lg); }
}
</style>
