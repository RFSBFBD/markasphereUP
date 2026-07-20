<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { categoryLabel } from '@/dashboard/modules/projects/utils/helpers'

const props = defineProps({
  project: { type: Object, required: true },
})

const title = computed(() => props.project.title_ar || props.project.title_en || '—')
const category = computed(() => categoryLabel(props.project.category))
const excerpt = computed(() => props.project.excerpt_ar || props.project.excerpt_en || '')
const number = computed(() => String(props.project.id ?? 0).padStart(2, '0'))
const bgStyle = computed(() => {
  if (!props.project.cover_image) {
    return { background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)' }
  }
  return {
    backgroundImage: `url(${props.project.cover_image}), linear-gradient(135deg, #4f46e5, #8b5cf6)`,
    backgroundSize: 'cover, auto',
    backgroundPosition: 'center, 0 0',
    backgroundRepeat: 'no-repeat, repeat',
  }
})
</script>

<template>
  <RouterLink
    :to="{ name: 'dashboard-projects-preview', params: { id: project.id } }"
    class="pc-card"
  >
    <div class="pc-card__image" :style="bgStyle">
      <span class="pc-card__number">{{ number }}</span>
      <div class="pc-card__overlay">
        <span class="pc-card__view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
    <div class="pc-card__info">
      <h3 class="pc-card__title">{{ title }}</h3>
      <p class="pc-card__category">{{ category }}</p>
      <p class="pc-card__desc">{{ excerpt }}</p>
      <span class="pc-card__accent" />
    </div>
  </RouterLink>
</template>

<style scoped>
.pc-card {
  display: block;
  border-radius: var(--ds-radius);
  overflow: hidden;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  box-shadow: var(--ds-shadow);
  text-decoration: none;
  color: inherit;
  transition: transform .2s ease, box-shadow .2s ease;
}
.pc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(16,24,40,.12);
}
.pc-card__image {
  position: relative;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: flex-start;
}
.pc-card__number {
  margin: 12px;
  background: rgba(0,0,0,.45);
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  padding: 3px 9px;
  border-radius: 999px;
}
.pc-card__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15,17,22,.35);
  opacity: 0;
  transition: opacity .2s ease;
}
.pc-card:hover .pc-card__overlay { opacity: 1; }
.pc-card__view {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  color: #111;
  display: grid;
  place-items: center;
}
.pc-card__view svg { width: 22px; height: 22px; }
.pc-card__info { padding: 14px 16px 18px; }
.pc-card__title { margin: 0; font-size: 16px; font-weight: 700; }
.pc-card__category { margin: 4px 0 0; font-size: 12.5px; color: var(--ds-primary); font-weight: 600; }
.pc-card__desc {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--ds-text-muted);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pc-card__accent {
  display: block;
  width: 36px;
  height: 3px;
  border-radius: 3px;
  background: var(--ds-primary);
  margin-top: 12px;
}
</style>
