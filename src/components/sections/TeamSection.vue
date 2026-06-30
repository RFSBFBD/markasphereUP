<template>
  <BaseSection>
    <div class="team">
      <div class="team__header" ref="headerRef">
        <p class="team__tag">{{ tagLabel }}</p>
        <BaseHeading tag="h2" variant="display-lg" font="display-ar" weight="semibold" class="team__title">
          {{ titleLabel }}
        </BaseHeading>
      </div>
      <div class="team__grid" ref="gridRef">
        <TeamCard
          v-for="member in team"
          :key="member.id"
          :member="member"
          :locale="locale"
        />
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import BaseHeading from '@/components/base/BaseHeading.vue'
import TeamCard from '@/components/team/TeamCard.vue'
import { team } from '@/data/site/team'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { MOTION, isMobile } from '@/composables/animations/motion.config'

const { t, locale } = useI18n()

const tagLabel = computed(() => locale.value === 'ar' ? 'فريقنا' : 'Our Team')
const titleLabel = computed(() => locale.value === 'ar' ? 'ناس محترفين ورا الشغل' : 'Meet the Experts')

const headerRef = ref(null)
const gridRef = ref(null)

const { headerReveal, staggerCards } = useScrollReveal()

onMounted(() => {
  headerReveal(headerRef.value, { y: MOTION.yDistance })
  if (gridRef.value) {
    const cards = Array.from(gridRef.value.children)
    if (cards.length) {
      staggerCards(cards, {
        duration: isMobile() ? 0.35 : MOTION.card,
        stagger: isMobile() ? 0.06 : MOTION.stagger
      })
    }
  }
})
</script>

<style scoped>
.team__header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.team__tag {
  font-family: var(--font-body-en);
  font-weight: 500;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.team__title {
  line-height: var(--lh-heading);
  color: var(--color-text);
}

.team__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
}

@media (max-width: 1024px) {
  .team__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .team__title {
    font-size: var(--text-h2);
  }

  .team__grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}
</style>
