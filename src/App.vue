<template>
  <div :dir="direction" :lang="locale">
    <MainLayout v-if="useMainLayout" />
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useCursor } from '@/composables/utils/useCursor'
import ScrollTrigger from 'gsap/ScrollTrigger'

useCursor()

const route = useRoute()
const { locale } = useI18n()

const useMainLayout = computed(() => {
  return route.meta?.layout !== 'bare'
})

const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

watch(direction, async () => {
  document.documentElement.dir = direction.value
  document.documentElement.lang = locale.value
  localStorage.setItem('locale', locale.value)
  await nextTick()
  ScrollTrigger.refresh()
}, { flush: 'post' })
</script>
