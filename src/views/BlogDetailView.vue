<template>
  <article class="article-page" v-if="article">
    <div class="container">
      <RouterLink :to="{ name: 'blog' }" class="article-page__back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {{ t('blog.back') }}
      </RouterLink>

      <p class="article-page__category">{{ categoryLabel }}</p>
      <h1 class="article-page__title">{{ locale === 'ar' ? article.titleAr : article.titleEn }}</h1>

      <div class="article-page__meta">
        <span>{{ formattedDate }}</span>
        <span class="article-page__dot">•</span>
        <span>{{ article.readTime }}</span>
      </div>

      <div class="article-page__cover" :style="{ background: article.gradient }"></div>

      <div class="article-page__body" v-html="bodyHtml"></div>
    </div>
  </article>

  <div class="article-page article-page--empty" v-else-if="!loading && !error">
    <div class="container">
      <p>{{ t('blog.empty') }}</p>
      <RouterLink :to="{ name: 'blog' }" class="article-page__back">{{ t('blog.back') }}</RouterLink>
    </div>
  </div>

  <div class="article-page article-page--state" v-else-if="loading">
    <div class="container">{{ t('common.loading') }}</div>
  </div>
  <div class="article-page article-page--state" v-else-if="error">
    <div class="container">{{ t('common.error') }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { blogService } from '@/services/BlogService'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const article = ref(null)
const loading = ref(true)
const error = ref(false)

const BLOG_CATEGORY_LABELS = {
  branding: { ar: 'الهوية التجارية', en: 'Branding' },
  marketing: { ar: 'التسويق', en: 'Marketing' },
  web: { ar: 'الويب', en: 'Web' },
  content: { ar: 'المحتوى', en: 'Content' },
  strategy: { ar: 'الاستراتيجية', en: 'Strategy' }
}

const categoryLabel = computed(() => {
  const c = article.value?.category
  if (!c) return ''
  const m = BLOG_CATEGORY_LABELS[c]
  if (!m) return c
  return locale.value === 'ar' ? m.ar : m.en
})

const formattedDate = computed(() => {
  const raw = article.value?.date
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  try {
    return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar' : 'en', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(d)
  } catch {
    return raw
  }
})

const bodyHtml = computed(() => {
  const raw = locale.value === 'ar' ? article.value?.contentAr : article.value?.contentEn
  if (!raw) return ''
  return raw
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
})

function setMeta(a) {
  document.title = `MarkaSphere | ${locale.value === 'ar' ? a.titleAr : a.titleEn}`
  const el = document.querySelector('meta[name="description"]')
  if (el) el.setAttribute('content', locale.value === 'ar' ? (a.excerptAr || '') : (a.excerptEn || ''))
}

async function load(slug) {
  loading.value = true
  error.value = false
  article.value = null
  try {
    const data = await blogService.getBySlug(slug)
    if (!data) {
      router.replace({ name: 'blog' })
      return
    }
    article.value = data
    setMeta(data)
  } catch (e) {
    error.value = true
    if (import.meta.env.DEV) console.error('[BlogDetailView] load failed', e)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, (slug) => { if (slug) load(slug) }, { immediate: true })
onMounted(() => { if (route.params.slug) load(route.params.slug) })
</script>

<style scoped>
.article-page { padding: 160px 0 100px; }

.article-page__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-ar-body);
  color: var(--color-accent);
  text-decoration: none;
  margin-bottom: var(--space-2xl);
}

.article-page__category {
  font-family: var(--font-en-body);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  font-size: var(--text-small);
  margin-bottom: var(--space-md);
}

.article-page__title {
  font-family: var(--font-ar-h2);
  font-weight: 600;
  font-size: var(--text-display-lg);
  line-height: var(--lh-heading);
  color: var(--color-text);
  margin-bottom: var(--space-lg);
  max-width: 820px;
}

.article-page__meta {
  display: flex;
  gap: var(--space-sm);
  font-family: var(--font-ar-body);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2xl);
}

.article-page__dot { opacity: 0.5; }

.article-page__cover {
  width: 100%;
  height: 420px;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3xl);
}

.article-page__body {
  max-width: 760px;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  line-height: 2;
  color: var(--color-text);
}

.article-page__body :deep(p) { margin-bottom: var(--space-lg); }

.article-page--state, .article-page--empty {
  text-align: center;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .article-page { padding: 120px 0 72px; }
  .article-page__title { font-size: var(--text-h2); }
  .article-page__cover { height: 260px; }
}
</style>
