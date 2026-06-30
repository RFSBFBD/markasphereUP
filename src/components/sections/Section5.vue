<template>
  <BaseSection>
    <div class="section5">
      <div class="section5__grid">
        <div
          class="section5__stat"
          v-for="(stat, i) in enrichedStats"
          :key="`stat-${i}`"
          ref="statRefs"
        >
          <div class="section5__stat-bg card-glow"></div>
          <div class="section5__stat-icon card-icon" v-html="stat.icon"></div>
          <span class="section5__value">{{ stat.value }}</span>
          <span class="section5__label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import gsap from 'gsap'

const { t } = useI18n()
const { staggerCards } = useScrollReveal()
const { cardHover } = useHoverSystem()

const statRefs = ref([])

const statValues = ['+150', '+80', '+12', '%98']

const enrichedStats = computed(() => {
  const labels = [
    t('stats.projects'),
    t('stats.clients'),
    t('stats.experience'),
    t('stats.satisfaction')
  ]
  const icons = [
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>'
  ]
  return statValues.map((value, i) => ({
    value,
    label: labels[i],
    icon: icons[i]
  }))
})

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    staggerCards(statRefs.value)
    statRefs.value.forEach(stat => cardHover(stat))
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.section5 { text-align: center; }

.section5__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
}

.section5__stat {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-2xl);
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  overflow: hidden;
  cursor: default;
  will-change: transform;
  transition: border-color var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.section5__stat:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-lg);
}

.section5__stat-bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-accent);
  opacity: 0;
  z-index: 0;
}

.section5__stat-icon {
  position: relative;
  z-index: 1;
  color: var(--color-accent);
  margin-bottom: var(--space-sm);
  transition: color var(--duration-normal) var(--ease-primary);
}

.section5__stat:hover .section5__stat-icon { color: #fff; }

.section5__value {
  position: relative;
  z-index: 1;
  font-family: var(--font-en-h1);
  font-size: var(--text-display-lg);
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
  transition: color var(--duration-normal) var(--ease-primary);
}

.section5__stat:hover .section5__value { color: #fff; }

.section5__label {
  position: relative;
  z-index: 1;
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-body);
  color: var(--color-text-muted);
  transition: color var(--duration-normal) var(--ease-primary);
}

.section5__stat:hover .section5__label { color: rgba(255, 255, 255, 0.8); }

@media (max-width: 1024px) {
  .section5__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .section5__grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
  .section5__value { font-size: var(--text-h1); }
  .section5__stat { padding: var(--space-xl) var(--space-md); }
  .section5__stat-icon svg { width: 24px; height: 24px; }
}
</style>
