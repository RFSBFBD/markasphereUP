<template>
  <BaseSection id="services">
    <div class="services">
      <div class="services__header" ref="headerGroup">
        <p class="services__tag">{{ t('services.tag') }}</p>
        <BaseHeading tag="h2" variant="display-lg" font="ar-h2" weight="semibold" class="services__title">
          {{ t('services.title') }}
        </BaseHeading>
        <BaseSubtitle tag="p" size="body-lg" font="ar-body" class="services__subtitle">
          {{ t('services.subtitle') }}
        </BaseSubtitle>
      </div>

      <div class="services__grid" ref="gridRef">
        <ServiceCard
          v-for="s in services"
          :key="s.title"
          :service="s"
        />
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import BaseHeading from '@/components/base/BaseHeading.vue'
import BaseSubtitle from '@/components/base/BaseSubtitle.vue'
import ServiceCard from '@/components/shared/ServiceCard.vue'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import gsap from 'gsap'
import '@/styles/sections/services.css'

const { t } = useI18n()
const { headerReveal, staggerCards } = useScrollReveal()

const headerGroup = ref(null)
const gridRef = ref(null)

const services = computed(() => [
  {
    title: t('services.items[0].title'),
    desc: t('services.items[0].desc'),
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
  },
  {
    title: t('services.items[1].title'),
    desc: t('services.items[1].desc'),
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'
  },
  {
    title: t('services.items[2].title'),
    desc: t('services.items[2].desc'),
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>'
  },
  {
    title: t('services.items[3].title'),
    desc: t('services.items[3].desc'),
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
  },
  {
    title: t('services.items[4].title'),
    desc: t('services.items[4].desc'),
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
  },
  {
    title: t('services.items[5].title'),
    desc: t('services.items[5].desc'),
    icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  }
])

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    headerReveal(headerGroup.value)
    if (gridRef.value) {
      const cards = gridRef.value.querySelectorAll('.services__card')
      staggerCards(cards)
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
