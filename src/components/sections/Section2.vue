<template>
  <BaseSection>
    <div class="section2">
      <div class="section2__text" ref="textRef">
        <p class="section2__tag">{{ t('whyUs.tag') }}</p>
        <h2 class="section2__title">{{ t('whyUs.title') }}</h2>
        <p class="section2__subtitle">
          {{ t('whyUs.subtitle') }}
        </p>
      </div>

      <div class="section2__grid">
        <div
          class="section2__card"
          v-for="(item, i) in items"
          :key="i"
          ref="cardRefs"
        >
          <div class="section2__card-number">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="section2__card-title">{{ item.title }}</h3>
          <p class="section2__card-desc">{{ item.desc }}</p>
          <div class="section2__card-icon card-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
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
const { sectionReveal, staggerCards } = useScrollReveal()
const { cardHover } = useHoverSystem()

const textRef = ref(null)
const cardRefs = ref([])

const items = computed(() => [
  { title: t('whyUs.items[0].title'), desc: t('whyUs.items[0].desc') },
  { title: t('whyUs.items[1].title'), desc: t('whyUs.items[1].desc') },
  { title: t('whyUs.items[2].title'), desc: t('whyUs.items[2].desc') }
])

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    sectionReveal(textRef.value, { children: [textRef.value] })
    staggerCards(cardRefs.value)
    cardRefs.value.forEach(card => cardHover(card))
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.section2 {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-4xl);
  align-items: start;
}

.section2__text { position: sticky; top: 120px; }

.section2__tag {
  font-family: var(--font-en-body);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.section2__title {
  font-family: var(--font-ar-h2);
  font-weight: 600;
  font-size: var(--text-display-lg);
  line-height: var(--lh-heading);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.section2__subtitle {
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  line-height: var(--lh-body);
}

.section2__grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.section2__card {
  padding: var(--space-2xl);
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  cursor: default;
  will-change: transform;
  transition: border-color var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.section2__card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-lg);
}

.section2__card-number {
  font-family: var(--font-en-h1);
  font-size: var(--text-caption);
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.section2__card-title {
  font-family: var(--font-ar-h3);
  font-weight: 500;
  font-size: var(--text-h4);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  transition: color var(--duration-fast) var(--ease-primary);
}

.section2__card:hover .section2__card-title {
  color: var(--color-accent);
}

.section2__card-desc {
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-body);
  color: var(--color-text-muted);
  line-height: var(--lh-body);
}

.section2__card-icon {
  position: absolute;
  top: var(--space-2xl);
  inset-inline-start: var(--space-2xl);
  color: var(--color-accent);
  opacity: 0;
}

@media (max-width: 1024px) {
  .section2 { grid-template-columns: 1fr; gap: var(--space-2xl); }
  .section2__text { position: static; }
}

@media (max-width: 640px) {
  .section2__title { font-size: var(--text-h2); }
  .section2__card { padding: var(--space-xl); }
}
</style>
