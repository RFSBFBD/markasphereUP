<template>
  <PremiumCaseStudy
    v-if="project"
    :key="project.slug"
    :project="project"
    :prev-project="prevProject"
    :next-project="nextProject"
    :locale="locale"
    @navigate="handleNavigate"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getProjectBySlug, getAllProjects } from '@/data/projects/loader'
import { optimizeUrl } from '@/composables/services/image'
import PremiumCaseStudy from '@/components/portfolio/PremiumCaseStudy.vue'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const project = ref(null)
const prevProject = ref(null)
const nextProject = ref(null)

function setMeta(p) {
  document.title = `MarkaSphere | ${p.titleAr}`
  const desc = p.descriptionAr || p.descriptionEn || 'دراسة حالة متعمقة لمشروع من أعمال MarkaSphere.'
  const el = document.querySelector('meta[name="description"]')
  if (el) el.setAttribute('content', desc)
}

let preloadLink = null

async function loadProject(slug) {
  if (preloadLink && preloadLink.parentNode) {
    preloadLink.parentNode.removeChild(preloadLink)
    preloadLink = null
  }

  const p = await getProjectBySlug(slug)
  if (!p) {
    router.replace({ name: 'not-found' })
    return
  }
  project.value = p
  setMeta(p)

  const url = optimizeUrl(p.cover, { width: 1920, crop: 'limit' })
  preloadLink = document.createElement('link')
  preloadLink.rel = 'preload'
  preloadLink.href = url
  preloadLink.as = 'image'
  document.head.appendChild(preloadLink)

  const all = await getAllProjects()
  const idx = all.findIndex(x => x.slug === p.slug)
  if (idx !== -1) {
    const prevIdx = (idx - 1 + all.length) % all.length
    const nextIdx = (idx + 1) % all.length
    prevProject.value = all[prevIdx]
    nextProject.value = all[nextIdx]
  }
}

watch(() => route.params.slug, loadProject, { immediate: true })

const handleNavigate = (slug) => {
  router.push({ name: 'portfolio-case', params: { slug } })
}
</script>
