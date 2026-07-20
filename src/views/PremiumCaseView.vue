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
import { projectsPublicService } from '@/data/portfolio/projects/publicService'
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

  const p = await projectsPublicService.getBySlug(slug)
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

  const { prev, next } = await projectsPublicService.getAdjacent(slug)
  prevProject.value = prev
  nextProject.value = next
}

watch(() => route.params.slug, loadProject, { immediate: true })

const handleNavigate = (slug) => {
  router.push({ name: 'portfolio-case', params: { slug } })
}
</script>
