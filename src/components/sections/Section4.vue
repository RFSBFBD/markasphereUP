<template>
  <BaseSection>
    <div class="section4">
      <div class="section4__header" ref="headerRef">
        <p class="section4__tag">{{ t('process.tag') }}</p>
        <h2 class="section4__title">{{ t('process.title') }}</h2>
      </div>

      <div class="section4__timeline">
        <div class="section4__line"></div>

        <div
          class="section4__step"
          v-for="(step, i) in steps"
          :key="i"
          ref="stepRefs"
        >
          <div class="section4__step-dot">
            <span>{{ step.step }}</span>
          </div>
          <div class="section4__step-content">
            <h3 class="section4__step-title">{{ step.title }}</h3>
            <p class="section4__step-desc">{{ step.desc }}</p>
          </div>
          <div class="section4__step-icon card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
const { headerReveal, staggerCards } = useScrollReveal()
const { cardHover } = useHoverSystem()

const headerRef = ref(null)
const stepRefs = ref([])

const steps = computed(() => [
  { step: '01', title: t('process.steps[0].title'), desc: t('process.steps[0].desc') },
  { step: '02', title: t('process.steps[1].title'), desc: t('process.steps[1].desc') },
  { step: '03', title: t('process.steps[2].title'), desc: t('process.steps[2].desc') },
  { step: '04', title: t('process.steps[3].title'), desc: t('process.steps[3].desc') },
  { step: '05', title: t('process.steps[4].title'), desc: t('process.steps[4].desc') }
])

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    headerReveal(headerRef.value)
    staggerCards(stepRefs.value)
    stepRefs.value.forEach(step => cardHover(step))
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.section4__header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.section4__tag {
  font-family: var(--font-en-body);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.section4__title {
  font-family: var(--font-ar-h2);
  font-weight: 600;
  font-size: var(--text-display-lg);
  line-height: var(--lh-heading);
  color: var(--color-text);
}

.section4__timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-lg);
}

.section4__line {
  position: absolute;
  top: 32px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: var(--color-border);
}

.section4__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  cursor: default;
}

.section4__step-dot {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  position: relative;
  z-index: 1;
  transition: border-color var(--duration-normal) var(--ease-primary),
              background var(--duration-normal) var(--ease-primary);
}

.section4__step:hover .section4__step-dot {
  border-color: var(--color-accent);
  background: var(--color-accent);
}

.section4__step-dot span {
  font-family: var(--font-en-h1);
  font-size: var(--text-body);
  font-weight: 700;
  color: var(--color-accent);
  transition: color var(--duration-normal) var(--ease-primary);
}

.section4__step:hover .section4__step-dot span { color: #fff; }

.section4__step-title {
  font-family: var(--font-ar-h3);
  font-weight: 500;
  font-size: var(--text-h4);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.section4__step-desc {
  font-family: var(--font-ar-body);
  font-weight: 400;
  font-size: var(--text-small);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.section4__step-icon {
  margin-top: var(--space-sm);
  color: var(--color-accent);
  opacity: 0;
}

@media (max-width: 1024px) {
  .section4__timeline { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 640px) {
  .section4__timeline { grid-template-columns: 1fr; gap: var(--space-xl); }
  .section4__line { display: none; }
  .section4__title { font-size: var(--text-h2); }
}
</style>
