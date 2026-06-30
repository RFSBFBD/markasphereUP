<template>
  <article class="pcs" ref="articleRef">
    <div class="pcs__progress" ref="progressRef">
      <div class="pcs__progress-bar" ref="progressBarRef"></div>
    </div>

    <section class="pcs__hero" ref="heroRef">
      <div class="pcs__hero-bg" :style="heroBgStyle" ref="heroBgRef"></div>
      <div class="pcs__hero-overlay"></div>
      <div class="container pcs__hero-content">
        <button class="pcs__back" @click="goBack" :aria-label="locale === 'ar' ? 'العودة إلى المعرض' : 'Back to portfolio'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {{ t('caseStudy.back') }}
        </button>
        <p class="pcs__hero-category" ref="heroCategoryRef">{{ categoryLabel }}</p>
        <h1 class="pcs__hero-title" ref="heroTitleRef">{{ localizedTitle }}</h1>
      </div>
      <div class="pcs__hero-scroll" ref="scrollIndicatorRef">
        <span>{{ locale === 'ar' ? 'مرر للأسفل' : 'Scroll' }}</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" stroke-width="2"/>
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
        </svg>
      </div>
    </section>

    <section class="pcs__info" ref="infoRef">
      <div class="container">
        <div class="pcs__info-grid">
          <div v-if="project.client" class="pcs__info-item">
            <span class="pcs__info-label">{{ t('caseStudy.client') }}</span>
            <span class="pcs__info-value">{{ project.client }}</span>
          </div>
          <div v-if="project.industry" class="pcs__info-item">
            <span class="pcs__info-label">{{ t('caseStudy.industry') }}</span>
            <span class="pcs__info-value">{{ project.industry }}</span>
          </div>
          <div class="pcs__info-item">
            <span class="pcs__info-label">{{ t('caseStudy.year') }}</span>
            <span class="pcs__info-value">{{ project.year }}</span>
          </div>
          <div v-if="project.duration" class="pcs__info-item">
            <span class="pcs__info-label">{{ t('caseStudy.duration') }}</span>
            <span class="pcs__info-value">{{ project.duration }}</span>
          </div>
          <div v-if="project.website" class="pcs__info-item">
            <span class="pcs__info-label">{{ t('caseStudy.website') }}</span>
            <a :href="project.website" target="_blank" rel="noopener noreferrer" class="pcs__info-link">{{ project.website }}</a>
          </div>
          <div v-if="project.behance" class="pcs__info-item">
            <span class="pcs__info-label">{{ t('caseStudy.behance') }}</span>
            <a :href="project.behance" target="_blank" rel="noopener noreferrer" class="pcs__info-link">{{ project.behance }}</a>
          </div>
        </div>
      </div>
    </section>

    <section v-if="project.links && project.links.length" class="pcs__links">
      <div class="container">
        <h2 class="pcs__section-title">{{ t('caseStudy.links') }}</h2>
        <div class="pcs__links-list">
          <a v-for="(link, i) in project.links" :key="i" :href="link.url" target="_blank" rel="noopener noreferrer" class="pcs__links-item">
            <span class="pcs__links-label">{{ link.label }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <section class="pcs__overview" ref="overviewRef">
      <div class="container">
        <div class="pcs__overview-content">
          <h2 class="pcs__section-title">{{ overviewLabel }}</h2>
          <p class="pcs__overview-text">{{ localizedDescription }}</p>
        </div>
        <div v-if="localizedChallenge" class="pcs__overview-block">
          <h3 class="pcs__overview-block-title">{{ t('caseStudy.challenge') }}</h3>
          <p class="pcs__overview-text">{{ localizedChallenge }}</p>
        </div>
        <div v-if="localizedSolution" class="pcs__overview-block">
          <h3 class="pcs__overview-block-title">{{ t('caseStudy.solution') }}</h3>
          <p class="pcs__overview-text">{{ localizedSolution }}</p>
        </div>
      </div>
    </section>

    <section v-if="project.gallery && project.gallery.length" class="pcs__gallery" ref="galleryRef">
      <div class="container">
        <h2 class="pcs__section-title">{{ t('caseStudy.gallery') }}</h2>
        <div class="pcs__gallery-grid">
          <div
            v-for="(img, i) in project.gallery"
            :key="i"
            class="pcs__gallery-item"
            ref="galleryItemsRef"
            @click="openLightbox(i)"
          >
            <div class="pcs__gallery-image-wrap" :style="{ backgroundImage: `url(${blurUrl(img)})` }">
              <img
                :src="optimizeUrl(img, { width: 800, crop: 'fill' })"
                :srcset="srcset(img)"
                sizes="(max-width: 1024px) 100vw, 50vw"
                :alt="`${localizedTitle} ${i + 1}`"
                loading="lazy"
                decoding="async"
                width="800"
                height="450"
                class="pcs__gallery-img"
                @load="onGalleryImageLoad"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="project.videos && project.videos.length" class="pcs__videos">
      <div class="container">
        <h2 class="pcs__section-title">{{ t('caseStudy.videos') }}</h2>
        <div class="pcs__videos-grid">
          <div v-for="(video, i) in project.videos" :key="i" class="pcs__videos-item">
            <iframe
              :src="video.url"
              :title="video.title || ''"
              class="pcs__videos-iframe"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <p v-if="video.title" class="pcs__videos-title">{{ video.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="project.process && project.process.length" class="pcs__process" ref="processRef">
      <div class="container">
        <h2 class="pcs__section-title">{{ processLabel }}</h2>
        <div class="pcs__process-steps">
          <div v-for="(step, i) in project.process" :key="i" class="pcs__process-step">
            <span class="pcs__process-number">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="pcs__process-content">
              <h3 class="pcs__process-title">{{ localizedStepTitle(step) }}</h3>
              <p class="pcs__process-desc">{{ localizedStepDesc(step) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="project.results && project.results.length" class="pcs__results" ref="resultsRef">
      <div class="container">
        <h2 class="pcs__section-title">{{ resultsLabel }}</h2>
        <div class="pcs__results-grid">
          <div v-for="(result, i) in project.results" :key="i" class="pcs__results-card" ref="resultsCardsRef">
            <span class="pcs__results-value">{{ localizedResultValue(result) }}</span>
            <span class="pcs__results-label">{{ localizedResultLabel(result) }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="pcs__nav" ref="navRef">
      <div class="container">
        <div class="pcs__nav-inner">
          <RouterLink :to="{ name: 'portfolio' }" class="pcs__nav-link pcs__nav-link--back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {{ t('caseStudy.back') }}
          </RouterLink>
          <div class="pcs__nav-arrows">
            <button v-if="prevProject" class="pcs__nav-btn" @click="$emit('navigate', prevProject.slug)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              {{ prevTitle }}
            </button>
            <button v-if="nextProject" class="pcs__nav-btn" @click="$emit('navigate', nextProject.slug)">
              {{ nextTitle }}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
    <button
      v-if="showScrollTop"
      class="pcs__scroll-top"
      @click="scrollToTop"
      aria-label="Scroll to top"
      ref="scrollTopRef"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>

    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="pcs__lightbox" @click.self="closeLightbox" ref="lightboxRef">
        <button class="pcs__lightbox-close" @click="closeLightbox" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <button class="pcs__lightbox-nav pcs__lightbox-nav--prev" @click="prevImage" aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button class="pcs__lightbox-nav pcs__lightbox-nav--next" @click="nextImage" aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
        <div class="pcs__lightbox-track" ref="lightboxTrackRef"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <img
            :src="optimizeUrl(project.gallery[lightboxIndex], { width: 1440 })"
            :srcset="srcset(project.gallery[lightboxIndex])"
            sizes="100vw"
            :alt="`${localizedTitle} ${lightboxIndex + 1}`"
            loading="lazy"
            decoding="async"
            width="1440"
            height="810"
            class="pcs__lightbox-img"
            @load="onLightboxImageLoad"
          />
        </div>
        <div class="pcs__lightbox-counter">
          {{ lightboxIndex + 1 }} / {{ project.gallery.length }}
        </div>
      </div>
    </Teleport>
  </article>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { MOTION, reducedMotion, isMobile, mobileScale } from '@/composables/animations/motion.config'
import { optimizeUrl, srcset, blurUrl } from '@/composables/services/image'
import { getCategoryById } from '@/data/portfolio'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  project: { type: Object, required: true },
  prevProject: { type: Object, default: null },
  nextProject: { type: Object, default: null },
  locale: { type: String, default: 'ar' }
})

defineEmits(['navigate'])

const router = useRouter()
const { t } = useI18n()

const articleRef = ref(null)
const progressRef = ref(null)
const progressBarRef = ref(null)
const heroRef = ref(null)
const heroBgRef = ref(null)
const heroCategoryRef = ref(null)
const heroTitleRef = ref(null)
const scrollIndicatorRef = ref(null)
const infoRef = ref(null)
const overviewRef = ref(null)
const galleryRef = ref(null)
const galleryItemsRef = ref([])
const processRef = ref(null)
const resultsRef = ref(null)
const resultsCardsRef = ref([])
const navRef = ref(null)
const scrollTopRef = ref(null)
const showScrollTop = ref(false)

const categoryLabel = computed(() => {
  const cat = getCategoryById(props.project.category)
  if (!cat) return props.project.category
  return props.locale === 'ar' ? cat.label : cat.labelEn
})

const localizedTitle = computed(() =>
  props.locale === 'ar' ? props.project.titleAr : props.project.titleEn
)

const localizedDescription = computed(() =>
  props.locale === 'ar' ? props.project.descriptionAr : props.project.descriptionEn
)

const localizedChallenge = computed(() =>
  props.locale === 'ar' ? props.project.challengeAr : props.project.challengeEn
)

const localizedSolution = computed(() =>
  props.locale === 'ar' ? props.project.solutionAr : props.project.solutionEn
)

const prevTitle = computed(() =>
  props.prevProject
    ? (props.locale === 'ar' ? props.prevProject.titleAr : props.prevProject.titleEn)
    : ''
)

const nextTitle = computed(() =>
  props.nextProject
    ? (props.locale === 'ar' ? props.nextProject.titleAr : props.nextProject.titleEn)
    : ''
)

const overviewLabel = computed(() =>
  props.locale === 'ar' ? 'نظرة عامة' : 'Overview'
)

const processLabel = computed(() =>
  props.locale === 'ar' ? 'عملية العمل' : 'Process'
)

const resultsLabel = computed(() =>
  props.locale === 'ar' ? 'النتائج' : 'Results'
)

const heroBgStyle = computed(() => {
  if (!props.project.cover) return { background: props.project.gradient }
  return {
    background: `url(${optimizeUrl(props.project.cover, { width: 1920, crop: 'limit' })}) center/cover no-repeat`
  }
})

const localizedStepTitle = (step) =>
  props.locale === 'ar' ? (step.titleAr || step.title || '') : (step.titleEn || step.title || '')

const localizedStepDesc = (step) =>
  props.locale === 'ar' ? (step.descriptionAr || step.description || '') : (step.descriptionEn || step.description || '')

const localizedResultValue = (result) =>
  props.locale === 'ar' ? (result.valueAr || result.value || '') : (result.valueEn || result.value || '')

const localizedResultLabel = (result) =>
  props.locale === 'ar' ? (result.labelAr || result.label || '') : (result.labelEn || result.label || '')

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'portfolio' })
  }
}

const lightboxIndex = ref(null)
const lightboxRef = ref(null)
const lightboxTrackRef = ref(null)
let touchStartX = 0
let touchEndX = 0

const openLightbox = (index) => {
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % project.gallery.length
}

const prevImage = () => {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + project.gallery.length) % project.gallery.length
}

const onTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const onTouchMove = (e) => {
  touchEndX = e.touches[0].clientX
}

const onTouchEnd = () => {
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextImage()
    else prevImage()
  }
}

const onGalleryImageLoad = (e) => {
  e.target.classList.add('pcs__gallery-img--loaded')
}

const onLightboxImageLoad = (e) => {
  e.target.classList.add('pcs__lightbox-img--loaded')
}

function prefetchImage(url) {
  if (!url) return
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.as = 'image'
  document.head.appendChild(link)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onScroll = () => {
  showScrollTop.value = window.scrollY > window.innerHeight * 0.7
}

const handleKeydown = (e) => {
  if (lightboxIndex.value === null) {
    if (e.key === 'Home') {
      e.preventDefault()
      scrollToTop()
    }
    return
  }
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

let ctx = null

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })

  if (props.nextProject) {
    prefetchImage(optimizeUrl(props.nextProject.cover, { width: 1920, crop: 'limit' }))
  }

  if (reducedMotion()) return

  ctx = gsap.context(() => {
    const heroTl = gsap.timeline({
      defaults: { ease: MOTION.ease.strong }
    })

    if (heroCategoryRef.value) {
      heroTl.from(heroCategoryRef.value, { y: 15, opacity: 0, duration: isMobile() ? 0.3 : MOTION.hero * 0.5 }, 0.1)
    }
    if (heroTitleRef.value) {
      heroTl.from(heroTitleRef.value, {
        y: mobileScale(MOTION.yDistance),
        opacity: 0,
        duration: isMobile() ? 0.35 : MOTION.hero
      }, 0.2)
    }
    if (scrollIndicatorRef.value && !isMobile()) {
      heroTl.from(scrollIndicatorRef.value, { opacity: 0, duration: MOTION.fast }, 1.1)
    }

    if (heroBgRef.value && !isMobile()) {
      gsap.to(heroBgRef.value, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      })
    }

    if (progressBarRef.value && articleRef.value) {
      gsap.to(progressBarRef.value, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: articleRef.value,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3
        }
      })
    }

    const sections = [infoRef, overviewRef, galleryRef, processRef, resultsRef, navRef]
    sections.forEach(sectionRef => {
      if (!sectionRef.value) return
      const children = Array.from(sectionRef.value.children)
      if (!children.length) return
      gsap.from(children, {
        y: mobileScale(MOTION.yDistance),
        opacity: 0,
        duration: isMobile() ? 0.35 : MOTION.section,
        stagger: isMobile() ? 0.05 : MOTION.staggerWide,
        ease: MOTION.ease.primary,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      })
    })

    if (galleryItemsRef.value.length) {
      gsap.from(galleryItemsRef.value, {
        y: mobileScale(35),
        opacity: 0,
        duration: isMobile() ? 0.35 : MOTION.card,
        stagger: isMobile() ? 0.04 : MOTION.stagger,
        ease: MOTION.ease.primary,
        scrollTrigger: {
          trigger: galleryRef.value,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      })
    }

    if (resultsCardsRef.value.length) {
      gsap.from(resultsCardsRef.value, {
        scale: 0.85,
        opacity: 0,
        duration: isMobile() ? 0.35 : MOTION.card,
        stagger: isMobile() ? 0.04 : MOTION.stagger,
        ease: MOTION.ease.primary,
        scrollTrigger: {
          trigger: resultsRef.value,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      })
    }

    if (heroRef.value) {
      gsap.from(heroRef.value, { opacity: 0, duration: 0.01 })
    }
  }, articleRef)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.pcs {
  position: relative;
  background: var(--color-bg);
}

.pcs__progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 200;
  background: rgba(0, 0, 0, 0.06);
}

.pcs__progress-bar {
  height: 100%;
  background: var(--color-accent);
  transform-origin: left;
  scale: 0 1;
}

.pcs__hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
}

.pcs__hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.pcs__hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
}

.pcs__hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
}

.pcs__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body-en);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--space-3xl);
  background: none;
  border: none;
  cursor: pointer;
  min-width: auto;
  min-height: auto;
  padding: var(--space-xs) 0;
  transition: color var(--duration-normal) var(--ease-primary),
              gap var(--duration-fast) var(--ease-primary);
}

.pcs__back:hover {
  color: #fff;
  gap: var(--space-sm);
}

.pcs__hero-category {
  font-family: var(--font-body-en);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: var(--space-md);
}

.pcs__hero-title {
  font-family: var(--font-display-ar);
  font-size: var(--text-display-xl);
  color: #fff;
  line-height: var(--lh-display);
}

.pcs__hero-scroll {
  position: absolute;
  bottom: var(--space-3xl);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body-en);
  font-size: var(--text-caption);
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.pcs__info {
  padding: var(--space-5xl) 0;
  background: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border);
}

.pcs__info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

.pcs__info-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.pcs__info-label {
  font-family: var(--font-body-en);
  font-size: var(--text-caption);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.pcs__info-value {
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  color: var(--color-text);
}

.pcs__info-link {
  font-family: var(--font-body-en);
  color: var(--color-accent);
  transition: opacity var(--duration-normal) var(--ease-primary),
              text-decoration var(--duration-fast) var(--ease-primary);
  word-break: break-all;
}

.pcs__info-link:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.pcs__overview {
  padding: var(--space-5xl) 0;
}

.pcs__overview-content {
  max-width: 720px;
}

.pcs__overview-block {
  max-width: 720px;
  margin-top: var(--space-4xl);
  padding-top: var(--space-4xl);
  border-top: 1px solid var(--color-border);
}

.pcs__overview-block-title {
  font-family: var(--font-display-ar);
  font-size: var(--text-h3);
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.pcs__section-title {
  font-family: var(--font-display-ar);
  font-size: var(--text-h2);
  color: var(--color-text);
  margin-bottom: var(--space-2xl);
}

.pcs__overview-text {
  font-family: var(--font-body-ar);
  font-size: var(--text-body-lg);
  line-height: var(--lh-body);
  color: var(--color-text-muted);
}

.pcs__gallery {
  padding: var(--space-5xl) 0;
  border-top: 1px solid var(--color-border);
}

.pcs__gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2xl);
}

.pcs__gallery-item {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: zoom-in;
  position: relative;
  transition: border-color var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.pcs__gallery-item:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-lg);
}

.pcs__gallery-item:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.pcs__gallery-item:first-child:nth-last-child(1) {
  grid-column: 1 / -1;
}

.pcs__gallery-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-bg);
}

.pcs__gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-primary),
              transform var(--duration-slow) var(--ease-primary);
}

.pcs__gallery-img--loaded {
  opacity: 1;
}

.pcs__gallery-item:hover .pcs__gallery-img--loaded {
  transform: scale(1.08);
}

.pcs__process {
  padding: var(--space-5xl) 0;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.pcs__process-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
  max-width: 720px;
}

.pcs__process-step {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--color-border);
}

.pcs__process-step:last-child {
  border-bottom: none;
}

.pcs__process-number {
  font-family: var(--font-display-en);
  font-size: var(--text-h1);
  font-weight: var(--weight-bold);
  color: var(--color-accent);
  line-height: 1;
  min-width: 60px;
}

.pcs__process-content {
  flex: 1;
}

.pcs__process-title {
  font-family: var(--font-display-ar);
  font-size: var(--text-h3);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.pcs__process-desc {
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  line-height: var(--lh-body);
  color: var(--color-text-muted);
}

.pcs__results {
  padding: var(--space-5xl) 0;
  border-top: 1px solid var(--color-border);
}

.pcs__results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
}

.pcs__results-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-2xl);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: border-color var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.pcs__results-card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-lg);
}

.pcs__results-value {
  font-family: var(--font-display-en);
  font-size: var(--text-display-md);
  font-weight: var(--weight-bold);
  color: var(--color-accent);
  line-height: var(--lh-display);
  margin-bottom: var(--space-xs);
}

.pcs__results-label {
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  color: var(--color-text-muted);
}

.pcs__links {
  padding: var(--space-5xl) 0;
  border-top: 1px solid var(--color-border);
}

.pcs__links-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.pcs__links-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  color: var(--color-text);
  text-decoration: none;
  transition: border-color var(--duration-normal) var(--ease-primary),
              color var(--duration-normal) var(--ease-primary);
}

.pcs__links-item:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.pcs__videos {
  padding: var(--space-5xl) 0;
  border-top: 1px solid var(--color-border);
}

.pcs__videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: var(--space-xl);
}

.pcs__videos-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.pcs__videos-iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm);
  border: none;
}

.pcs__videos-title {
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  color: var(--color-text-muted);
}

.pcs__nav {
  padding: var(--space-5xl) 0;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-alt);
}

.pcs__nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
}

.pcs__nav-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body-en);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  text-decoration: none;
  min-width: auto;
  min-height: auto;
  padding: var(--space-xs) 0;
  transition: color var(--duration-normal) var(--ease-primary);
}

.pcs__nav-link:hover {
  color: var(--color-accent);
}

.pcs__nav-arrows {
  display: flex;
  gap: var(--space-md);
}

.pcs__nav-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  color: var(--color-text);
  background: none;
  border: none;
  cursor: pointer;
  min-width: auto;
  min-height: auto;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: border-color var(--duration-normal) var(--ease-primary),
              color var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.pcs__nav-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 1024px) {
  .pcs__info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pcs__gallery-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .pcs__hero {
    min-height: 500px;
  }

  .pcs__hero-title {
    font-size: var(--text-h1);
  }

  .pcs__info-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .pcs__gallery-image-wrap {
    aspect-ratio: 4 / 3;
  }

  .pcs__videos-grid {
    grid-template-columns: 1fr;
  }

  .pcs__lightbox-track {
    padding: var(--space-2xl);
  }

  .pcs__lightbox-nav {
    width: 40px;
    height: 40px;
  }

  .pcs__lightbox-nav--prev {
    inset-inline-start: var(--space-xs);
  }

  .pcs__lightbox-nav--next {
    inset-inline-end: var(--space-xs);
  }

  .pcs__process-step {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .pcs__process-number {
    font-size: var(--text-h3);
  }

  .pcs__results-grid {
    grid-template-columns: 1fr 1fr;
  }

  .pcs__results-card {
    padding: var(--space-lg);
  }

  .pcs__results-value {
    font-size: var(--text-h1);
  }

  .pcs__nav-inner {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-lg);
  }

  .pcs__nav-arrows {
    justify-content: space-between;
  }
}

.pcs__scroll-top {
  position: fixed;
  bottom: var(--space-2xl);
  inset-inline-end: var(--space-2xl);
  z-index: 150;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: opacity var(--duration-normal) var(--ease-primary),
              transform var(--duration-normal) var(--ease-primary),
              background var(--duration-fast) var(--ease-primary);
  animation: pcsFadeIn 0.25s ease;
}

.pcs__scroll-top:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.pcs__scroll-top:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent);
}

@media (max-width: 640px) {
  .pcs__scroll-top {
    bottom: var(--space-lg);
    inset-inline-end: var(--space-lg);
    width: 44px;
    height: 44px;
  }
}

.pcs__lightbox {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  animation: pcsFadeIn 0.25s ease;
}

.pcs__lightbox-close {
  position: absolute;
  top: var(--space-lg);
  inset-inline-end: var(--space-lg);
  z-index: 10;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) var(--ease-primary),
              opacity var(--duration-fast) var(--ease-primary);
}

.pcs__lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.pcs__lightbox-nav {
  position: absolute;
  top: 50%;
  z-index: 10;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  cursor: pointer;
  transform: translateY(-50%);
  transition: background var(--duration-fast) var(--ease-primary),
              transform var(--duration-fast) var(--ease-primary);
  min-width: auto;
  min-height: auto;
}

.pcs__lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.05);
}

.pcs__lightbox-nav--prev {
  inset-inline-start: var(--space-lg);
}

.pcs__lightbox-nav--next {
  inset-inline-end: var(--space-lg);
}

.pcs__lightbox-track {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--space-5xl);
}

.pcs__lightbox-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-primary);
}

.pcs__lightbox-img--loaded {
  opacity: 1;
}

.pcs__lightbox-counter {
  position: absolute;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-body-en);
  font-size: var(--text-small);
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
}

@keyframes pcsFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
