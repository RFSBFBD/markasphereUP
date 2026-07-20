<script setup>
import { categoryLabel, formatDate } from '../utils/helpers'

const props = defineProps({
  post: { type: Object, required: true },
})
</script>

<template>
  <article class="blog-card" :class="{ 'is-unpublished': !post.published }">
    <div class="blog-card__media" :style="post.cover_image ? { backgroundImage: `url(${post.cover_image})` } : {}">
      <span class="blog-card__cat">{{ categoryLabel(post.category) }}</span>
      <span class="blog-card__badge" v-if="!post.published">مسودة</span>
    </div>
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <span class="blog-card__date">{{ formatDate(post.created_at || post.updated_at) }}</span>
      </div>
      <h3 class="blog-card__title">{{ post.title_ar || post.title_en }}</h3>
      <p class="blog-card__excerpt">{{ post.excerpt_ar || post.excerpt_en || '—' }}</p>
      <span class="blog-card__more">اقرأ المزيد ←</span>
    </div>
  </article>
</template>

<style scoped>
.blog-card {
  background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: 18px;
  overflow: hidden; box-shadow: var(--ds-shadow); transition: transform .2s ease, box-shadow .2s ease;
}
.blog-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.18); }
.blog-card.is-unpublished { opacity: .82; }
.blog-card__media {
  position: relative; height: 170px; background: linear-gradient(135deg, #6d28d9, #db2777);
  background-size: cover; background-position: center;
}
.blog-card__cat {
  position: absolute; top: 12px; inset-inline-start: 12px; background: rgba(255,255,255,.92);
  color: #4c1d95; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 999px;
}
.blog-card__badge {
  position: absolute; top: 12px; inset-inline-end: 12px; background: var(--ds-warn);
  color: #1f1300; font-size: 11px; font-weight: 800; padding: 4px 9px; border-radius: 999px;
}
.blog-card__body { padding: 16px 18px 20px; }
.blog-card__meta { display: flex; gap: 10px; color: var(--ds-text-muted); font-size: 12px; margin-bottom: 8px; }
.blog-card__title { font-size: 18px; font-weight: 800; margin: 0 0 8px; color: var(--ds-text); }
.blog-card__excerpt { font-size: 13.5px; color: var(--ds-text-muted); margin: 0 0 12px; line-height: 1.7;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.blog-card__more { font-size: 13px; font-weight: 700; color: var(--ds-primary); }
</style>
