<script setup>
import { ref, onMounted } from 'vue'
import { useBlogStore } from '../stores/blogStore'
import { categoryLabel, formatDate } from '../utils/helpers'
import StatusBadge from '@/dashboard/components/ui/StatusBadge.vue'

const store = useBlogStore()
const notFound = ref(false)
const lang = ref('ar')
const id = window.location.hash.split('/').filter(Boolean)[3]

onMounted(async () => {
  if (!id) { notFound.value = true; return }
  await store.loadPost(id)
  if (!store.currentPost.value) notFound.value = true
})

function back() {
  window.location.hash = '/dashboard/blog'
}
function edit() {
  window.location.hash = '/dashboard/blog/' + id + '/edit'
}
</script>

<template>
  <div class="composed">
    <button class="back" @click="back">→ رجوع للقائمة</button>

    <div v-if="notFound" class="empty">
      <p>تعذر العثور على المقال.</p>
      <button class="ds-btn" @click="back">العودة</button>
    </div>

    <div v-else-if="store.loading.value" class="empty">جارٍ التحميل...</div>

    <article v-else-if="store.currentPost.value" class="article">
      <header class="article__hero" :style="store.currentPost.value.cover_image ? { backgroundImage: `url(${store.currentPost.value.cover_image})` } : {}">
        <div class="article__hero-overlay">
          <span class="article__cat">{{ categoryLabel(store.currentPost.value.category) }}</span>
          <span class="article__status"><StatusBadge type="published" :value="!!store.currentPost.value.published" /></span>
          <h1 class="article__title">{{ lang === 'ar' ? store.currentPost.value.title_ar : store.currentPost.value.title_en }}</h1>
          <div class="article__meta">
            <span>📅 {{ formatDate(store.currentPost.value.created_at) }}</span>
            <span>✎ آخر تعديل: {{ formatDate(store.currentPost.value.updated_at) }}</span>
          </div>
          <div class="article__lang">
            <button :class="{ active: lang === 'ar' }" @click="lang = 'ar'">العربية</button>
            <button :class="{ active: lang === 'en' }" @click="lang = 'en'">English</button>
          </div>
        </div>
      </header>

      <div v-if="store.currentPost.value.gallery && store.currentPost.value.gallery.length" class="article__gallery">
        <img v-for="g in store.currentPost.value.gallery" :key="g.id || g.url" :src="g.url" :alt="g.url" />
      </div>

      <div class="article__body" :dir="lang === 'ar' ? 'rtl' : 'ltr'">
        <p v-if="lang === 'ar' ? store.currentPost.value.excerpt_ar : store.currentPost.value.excerpt_en" class="article__excerpt">
          {{ lang === 'ar' ? store.currentPost.value.excerpt_ar : store.currentPost.value.excerpt_en }}
        </p>
        <div class="article__content" v-html="lang === 'ar' ? store.currentPost.value.content_ar : store.currentPost.value.content_en"></div>
      </div>

      <aside class="article__info">
        <h4>معلومات المقال</h4>
        <ul>
          <li><span>التصنيف</span><b>{{ categoryLabel(store.currentPost.value.category) }}</b></li>
          <li><span>الحالة</span><StatusBadge type="published" :value="!!store.currentPost.value.published" /></li>
          <li><span>الرابط</span><code>/blog/{{ store.currentPost.value.slug }}</code></li>
          <li><span>ترتيب العرض</span><b>{{ store.currentPost.value.display_order }}</b></li>
          <li><span>تاريخ الإنشاء</span><b>{{ formatDate(store.currentPost.value.created_at) }}</b></li>
        </ul>
        <button class="ds-btn is-primary" @click="edit">تعديل المقال</button>
      </aside>
    </article>
  </div>
</template>

<style scoped>
.composed { padding: 24px; max-width: 1100px; margin: 0 auto; }
.back { background: none; border: none; color: var(--ds-primary); font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 12px; }
.article__hero { position: relative; min-height: 320px; border-radius: 18px; overflow: hidden; background: linear-gradient(135deg, #6d28d9, #db2777); background-size: cover; background-position: center; display: flex; align-items: flex-end; }
.article__hero-overlay { width: 100%; padding: 28px; background: linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,0)); color: #fff; }
.article__cat { display: inline-block; background: rgba(255,255,255,.92); color: #4c1d95; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 999px; margin-bottom: 10px; }
.article__status { margin-inline-start: 10px; }
.article__title { font-size: 34px; font-weight: 900; margin: 0 0 12px; line-height: 1.3; }
.article__meta { display: flex; gap: 18px; font-size: 13px; opacity: .9; flex-wrap: wrap; }
.article__lang { margin-top: 16px; display: flex; gap: 8px; }
.article__lang button { border: 1px solid rgba(255,255,255,.5); background: rgba(255,255,255,.12); color: #fff; padding: 6px 14px; border-radius: 999px; cursor: pointer; font-size: 13px; }
.article__lang button.active { background: #fff; color: #4c1d95; font-weight: 800; }
.article__gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 22px 0; }
.article__gallery img { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; border: 1px solid var(--ds-border); }
.article__body { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); padding: 26px; }
.article__excerpt { font-size: 17px; font-weight: 600; color: var(--ds-text); margin: 0 0 18px; line-height: 1.8; }
.article__content { font-size: 15.5px; line-height: 2; color: var(--ds-text); }
.article__content :deep(h1), .article__content :deep(h2), .article__content :deep(h3) { font-weight: 800; margin: .6em 0; }
.article__content :deep(ul), .article__content :deep(ol) { padding-inline-start: 1.4em; }
.article__content :deep(blockquote) { border-inline-start: 4px solid var(--ds-primary); padding: 6px 14px; margin: 1em 0; color: var(--ds-text-muted); background: var(--ds-surface-2); border-radius: 0 8px 8px 0; }
.article__content :deep(a) { color: var(--ds-primary); }
.article__info { margin-top: 18px; background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); padding: 20px; }
.article__info h4 { margin: 0 0 14px; font-size: 15px; font-weight: 800; }
.article__info ul { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.article__info li { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13.5px; }
.article__info li span { color: var(--ds-text-muted); }
.article__info code { font-size: 12px; background: var(--ds-surface-2); padding: 3px 8px; border-radius: 6px; }
.empty { padding: 60px; text-align: center; color: var(--ds-text-muted); display: flex; flex-direction: column; gap: 14px; align-items: center; }
@media (max-width: 760px) { .article__gallery { grid-template-columns: 1fr; } .article__title { font-size: 26px; } }
</style>
