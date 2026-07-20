<template>
  <BaseSection>
    <div class="team">
      <div class="team__header" ref="headerRef">
        <p class="team__tag">{{ t('team.tag') }}</p>
        <BaseHeading tag="h2" variant="display-lg" font="display-ar" weight="semibold" class="team__title">
          {{ t('team.title') }}
        </BaseHeading>
      </div>

      <div v-if="loading" class="team__state">{{ t('common.loading') }}</div>
      <div v-else-if="error" class="team__state team__state--error">{{ t('common.error') }}</div>
      <div v-else-if="!team.length" class="team__state">{{ t('team.empty') }}</div>

      <div v-else class="team__grid" ref="gridRef">
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import BaseHeading from '@/components/base/BaseHeading.vue'
import TeamCard from '@/components/team/TeamCard.vue'
import { teamService } from '@/services/TeamService'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { MOTION, isMobile } from '@/composables/animations/motion.config'

const { t, locale } = useI18n()

const headerRef = ref(null)
const gridRef = ref(null)

const team = ref([])
const loading = ref(true)
const error = ref(false)

const { headerReveal, staggerCards } = useScrollReveal()

function revealCards() {
  if (gridRef.value) {
    const cards = Array.from(gridRef.value.children)
    if (cards.length) {
      staggerCards(cards, {
        duration: isMobile() ? 0.35 : MOTION.card,
        stagger: isMobile() ? 0.06 : MOTION.stagger
      })
    }
  }
}

async function loadTeam() {
  loading.value = true
  error.value = false
  try {
    const data = await teamService.getAll({ published: true })
    team.value = data || []
  } catch (e) {
    error.value = true
    if (import.meta.env.DEV) console.error('[TeamSection] load failed', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  headerReveal(headerRef.value, { y: MOTION.yDistance })
  revealCards()
})

watch(team, async (list) => {
  if (!list.length) return
  await nextTick()
  revealCards()
})

loadTeam()
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

.team__state {
  text-align: center;
  font-family: var(--font-ar-body);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  padding: var(--space-3xl) 0;
}

.team__state--error { color: var(--color-accent); }
</style>
