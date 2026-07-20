<template>
  <footer class="footer" id="contact">
    <div class="container">
      <div class="footer__top" ref="topRef">
        <div class="footer__brand">
          <div class="footer__logo">MarkaSphere</div>
          <p class="footer__tagline">{{ t('footer.tagline') }}</p>
          <div class="footer__socials-row" role="list" aria-label="Social media links">
            <a
              v-for="item in socialLinks"
              :key="item.key"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="footer__social-icon"
              :aria-label="item.label"
              role="listitem"
            >
              <svg v-if="item.key === 'facebook'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <svg v-else-if="item.key === 'instagram'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <svg v-else-if="item.key === 'linkedin'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              <span v-if="item.key === 'behance'" class="footer__social-text">Be</span>
              <svg v-else-if="item.key === 'x'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <svg v-else-if="item.key === 'tiktok'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.84 4.84 0 0 1-2-.32z"/></svg>
              <svg v-else-if="item.key === 'youtube'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.4 3.5z"/></svg>
            </a>
          </div>
        </div>

        <div class="footer__links">
          <div class="footer__col">
            <h4 class="footer__col-title">{{ t('footer.links') }}</h4>
            <nav class="footer__nav" aria-label="Footer navigation">
              <RouterLink
                v-for="item in navigation"
                :key="item.path"
                :to="item.path"
                class="footer__link"
              >
                {{ item.label }}
              </RouterLink>
            </nav>
          </div>

          <div class="footer__col">
            <h4 class="footer__col-title">{{ t('footer.contact') }}</h4>
            <div class="footer__contact">
              <a v-if="site.email" :href="`mailto:${site.email}`" class="footer__link footer__link--with-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                {{ site.email }}
              </a>
              <a v-if="site.phone" :href="`tel:${site.phone}`" class="footer__link footer__link--with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ site.phone }}
              </a>
              <a v-if="site.whatsapp" :href="site.whatsapp" target="_blank" rel="noopener" class="footer__link footer__link--with-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {{ t('footer.whatsapp') }}
              </a>
              <span v-if="site.address" class="footer__link footer__link--with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ locale === 'ar' ? site.address_ar : (site.address_en || site.address) }}
              </span>
              <a v-if="site.googleMapsUrl" :href="site.googleMapsUrl" target="_blank" rel="noopener" class="footer__link footer__link--with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20l-5.5-2V4l5.5 2 6-2 5.5 2v14l-5.5-2-6 2z"/><path d="M9 6v14M15 4v14"/></svg>
                {{ t('footer.map') }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">&copy; {{ currentYear }} MarkaSphere. {{ t('footer.rights') }}.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { navigation as navData } from '@/data/navigation'
import { SITE } from '@/components/constants/site'
import { useScrollReveal } from '@/composables/animations/useMotionSystem'
import { useHoverSystem } from '@/composables/animations/useHoverSystem'
import gsap from 'gsap'
import '@/styles/layout/footer.css'

const { t, locale } = useI18n()
const { headerReveal } = useScrollReveal()
const { iconButtonHover } = useHoverSystem()

const site = SITE
const currentYear = new Date().getFullYear()
const topRef = ref(null)
const socialRefs = ref([])

// Localized navigation labels sourced from vue-i18n.
function navKey(path) {
  return path === '/' ? 'home' : path.replace('/', '')
}

const navigation = computed(() => navData.map(item => ({
  path: item.path,
  label: t(`nav.${navKey(item.path)}`)
})))

const socialLinks = [
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/markasphere/' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/markasphere?fbclid=IwY2xjawTKybpleHRuA2FlbQIxMABicmlkETFoWU53ODN3T3VEQ0hNQmVNc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHlrC7GxNrLksKgO-_viiPk16NQNKh7QlFZDUQuB_viBEeqXJDAK8AZkHEX8G_aem_BCVNuhXtkLgDw6WTIP9_Sw' },
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/markasphere?fbclid=IwY2xjawTKygpleHRuA2FlbQIxMABicmlkETFoWU53ODN3T3VEQ0hNQmVNc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHpK6tuD-xIY2EMWAUO2GOYLPUxJDJLgYS1rwO0o96GuT8Gb6U02C4temINBh_aem_vCtpBrCUaVAXQ7SWxaFi0g' },
  { key: 'behance', label: 'Behance', url: 'https://www.behance.net/markasphere?fbclid=IwY2xjawTKyiFleHRuA2FlbQIxMABicmlkETFoWU53ODN3T3VEQ0hNQmVNc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHlrC7GxNrLksKgO-_viiPk16NQNKh7QlFZDUQuB_viBEeqXJDAK8AZkHEX8G_aem_BCVNuhXtkLgDw6WTIP9_Sw' },
  { key: 'x', label: 'X', url: 'https://x.com/markasphere?fbclid=IwY2xjawTKykhleHRuA2FlbQIxMABicmlkETFoWU53ODN3T3VEQ0hNQmVNc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHt_cGNuqI3ZfsrLbK6-ajnnAJQKq602Um4vHvnA8niG-yOmIGL2lWEYko_nz_aem_T9z5cI7W53HZF9cEpHTDKw' },
  { key: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@markasphere' },
  { key: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@markasphere' },
]

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    if (topRef.value) headerReveal(topRef.value)
    socialRefs.value.forEach(icon => {
      if (icon) iconButtonHover(icon)
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
