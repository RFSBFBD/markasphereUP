<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import { useWhatsApp } from '@/composables/services/useWhatsApp'
import { useHeader } from '@/composables/utils/useHeader'
import '@/styles/layout/header.css'

const { t, locale } = useI18n()
const { buttonHover } = useHoverSystem()
const { buildLink } = useWhatsApp()
const { entrance, isScrolled } = useHeader()

const whatsappLink = buildLink()

const isMobileOpen = ref(false)
const logoText = ref(null)
const ctaBtn = ref(null)

const navigation = computed(() => [
  { label: t('nav.home'), path: '/' },
  { label: t('nav.about'), path: '/about' },
  { label: t('nav.services'), path: '/services' },
  { label: t('nav.portfolio'), path: '/portfolio' },
  { label: t('nav.blog'), path: '/blog' },
  { label: t('nav.contact'), path: '/contact' }
])

const toggleLocale = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  localStorage.setItem('locale', newLocale)
  window.location.replace(window.location.href)
}

const toggleMobile = () => {
  isMobileOpen.value = !isMobileOpen.value
}

const closeMobile = () => {
  isMobileOpen.value = false
}

const router = useRouter()

watch(() => router.currentRoute.value.path, () => {
  isMobileOpen.value = false
})

onMounted(() => {
  if (ctaBtn.value) buttonHover(ctaBtn.value)
})
</script>

<template>
  <header
    class="header"
    :class="{ 'header--scrolled': isScrolled }"
    :ref="entrance"
  >
    <div class="header__inner">
      <RouterLink
        to="/"
        class="header__logo"
        ref="logoText"
      >
        MarkaSphere
      </RouterLink>

      <nav class="header__nav" aria-label="Main navigation">
        <RouterLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="header__link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <button class="header__lang" @click="toggleLocale" :aria-label="locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'">
          {{ locale === 'ar' ? 'EN' : 'عربي' }}
        </button>
        <a :href="whatsappLink" target="_blank" rel="noopener" class="header__cta" ref="ctaBtn">
          {{ t('header.startProject') }}
        </a>
      </div>

      <button class="header__burger" @click="toggleMobile" :aria-label="isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'" :aria-expanded="isMobileOpen">
        <span :class="{ open: isMobileOpen }"></span>
      </button>
    </div>
  </header>

  <MobileMenu
    :isOpen="isMobileOpen"
    :navigation="navigation"
    @close="closeMobile"
  />
</template>

