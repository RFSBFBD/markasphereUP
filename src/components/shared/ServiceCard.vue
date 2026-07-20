<template>
  <div class="services__card" ref="cardRef" role="button" tabindex="0" @click="openWhatsApp(service.title, locale)" @keydown.enter.prevent="openWhatsApp(service.title, locale)" @keydown.space.prevent="openWhatsApp(service.title, locale)">
    <div class="services__card-glow card-glow"></div>
    <div class="services__card-icon card-icon" v-html="service.icon"></div>
    <h3 class="services__card-title">{{ service.title }}</h3>
    <p class="services__card-desc">{{ service.desc }}</p>
    <span class="services__card-arrow card-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import { useWhatsApp } from '@/composables/services/useWhatsApp'

const props = defineProps({
  service: { type: Object, required: true }
})

const { locale } = useI18n()
const { cardHover } = useHoverSystem()
const { openWhatsApp } = useWhatsApp()
const cardRef = ref(null)

onMounted(() => {
  if (cardRef.value) cardHover(cardRef.value)
})
</script>
