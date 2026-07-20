<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/dashboard/modules/projects/stores/projectsStore'
import { useToast } from '@/dashboard/composables/useToast'
import ProjectCardPreview from '@/dashboard/modules/projects/components/ProjectCardPreview.vue'
import StatusBadge from '@/dashboard/components/ui/StatusBadge.vue'
import { categoryLabel, formatDate } from '@/dashboard/modules/projects/utils/helpers'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()
const toast = useToast()
const { currentProject, loading } = storeToRefs(store)
const locale = ref('ar')
const id = route.params.id

onMounted(() => store.loadProject(id))

const title = computed(() =>
  locale.value === 'en' ? currentProject.value?.title_en : currentProject.value?.title_ar
)
const excerpt = computed(() =>
  locale.value === 'en' ? currentProject.value?.excerpt_en : currentProject.value?.excerpt_ar
)
const content = computed(() =>
  locale.value === 'en' ? currentProject.value?.content_en : currentProject.value?.content_ar
)
const servicesList = computed(() =>
  (currentProject.value?.services || '').split(',').map((s) => s.trim()).filter(Boolean)
)
const techList = computed(() =>
  (currentProject.value?.technologies || '').split(',').map((s) => s.trim()).filter(Boolean)
)
const gallery = computed(() => currentProject.value?.gallery || [])

function paragraphs(t) {
  return (t || '').split(/\n+/).map((s) => s.trim()).filter(Boolean)
}
function goEdit() {
  router.push({ name: 'dashboard-projects-edit', params: { id } })
}
function goBack() {
  router.push({ name: 'dashboard-projects' })
}
function togglePublish() {
  const p = currentProject.value
  if (!p) return
  store[p.published ? 'unpublishProject' : 'publishProject'](id)
    .then(() => toast.success('تم التحديث'))
    .catch((e) => toast.error(e.message))
}
</script>

<template>
  <section v-if="loading" class="state">جارٍ التحميل...</section>

  <section v-else-if="currentProject" class="preview">
    <div class="preview__bar">
      <button class="ds-btn" type="button" @click="goBack">الرجوع</button>
      <div class="preview__bar-right">
        <div class="locale">
          <button :class="{ on: locale === 'ar' }" type="button" @click="locale = 'ar'">ع</button>
          <button :class="{ on: locale === 'en' }" type="button" @click="locale = 'en'">EN</button>
        </div>
        <button class="ds-btn" type="button" @click="goEdit">تعديل</button>
        <button class="ds-btn is-primary" type="button" @click="togglePublish">
          {{ currentProject.published ? 'إلغاء النشر' : 'نشر' }}
        </button>
      </div>
    </div>

    <div class="preview__cols">
      <div class="preview__main">
        <div class="hero" :style="currentProject.cover_image ? { backgroundImage: `url(${currentProject.cover_image})` } : {}">
          <div class="hero__overlay">
            <span class="hero__cat">{{ categoryLabel(currentProject.category) }}</span>
            <h1 class="hero__title">{{ title }}</h1>
            <p v-if="excerpt" class="hero__excerpt">{{ excerpt }}</p>
          </div>
        </div>

        <div class="meta">
          <div class="meta__item">
            <span class="meta__label">العميل</span>
            <span class="meta__value">{{ currentProject.client || '—' }}</span>
          </div>
          <div class="meta__item">
            <span class="meta__label">تاريخ الإنجاز</span>
            <span class="meta__value">{{ formatDate(currentProject.completion_date) }}</span>
          </div>
          <div class="meta__item">
            <span class="meta__label">الحالة</span>
            <StatusBadge type="published" :value="!!currentProject.published" />
          </div>
          <div class="meta__item">
            <span class="meta__label">مميز</span>
            <StatusBadge type="featured" :value="!!currentProject.featured" />
          </div>
        </div>

        <div v-if="servicesList.length" class="chips">
          <span class="chips__label">الخدمات</span>
          <span v-for="s in servicesList" :key="s" class="chip">{{ s }}</span>
        </div>
        <div v-if="techList.length" class="chips">
          <span class="chips__label">التقنيات</span>
          <span v-for="t in techList" :key="t" class="chip chip--tech">{{ t }}</span>
        </div>

        <article class="content">
          <p v-for="(p, i) in paragraphs(content)" :key="i">{{ p }}</p>
          <p v-if="!content" class="content__empty">لا يوجد محتوى لهذه اللغة.</p>
        </article>

        <div v-if="gallery.length" class="gallery">
          <h3 class="gallery__title">معرض الصور</h3>
          <div class="gallery__grid">
            <img v-for="g in gallery" :key="g.id" :src="g.image" :alt="title" />
          </div>
        </div>
      </div>

      <aside class="preview__side">
        <span class="side__label">كما يظهر في الموقع</span>
        <ProjectCardPreview :project="currentProject" />
      </aside>
    </div>
  </section>

  <section v-else class="state">تعذر تحميل المشروع.</section>
</template>

<style scoped>
.state { padding: 60px; text-align: center; color: var(--ds-text-muted); }
.preview__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}
.preview__bar-right { display: flex; align-items: center; gap: 10px; }
.locale { display: inline-flex; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-sm); overflow: hidden; }
.locale button {
  border: none;
  background: var(--ds-surface);
  color: var(--ds-text-muted);
  padding: 8px 12px;
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}
.locale button.on { background: var(--ds-primary); color: #fff; }

.preview__cols { display: grid; grid-template-columns: 1fr 320px; gap: 18px; align-items: start; }
.preview__main { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); box-shadow: var(--ds-shadow); overflow: hidden; }

.hero {
  position: relative;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #4f46e5, #8b5cf6);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}
.hero__overlay {
  width: 100%;
  padding: 28px;
  background: linear-gradient(to top, rgba(0,0,0,.65), transparent);
  color: #fff;
}
.hero__cat { font-size: 12.5px; font-weight: 700; opacity: .9; }
.hero__title { margin: 6px 0 0; font-size: 28px; font-weight: 800; }
.hero__excerpt { margin: 8px 0 0; font-size: 14.5px; opacity: .92; max-width: 620px; line-height: 1.7; }

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 18px 24px;
  border-block-end: 1px solid var(--ds-border);
}
.meta__item { display: flex; flex-direction: column; gap: 6px; }
.meta__label { font-size: 12px; color: var(--ds-text-muted); font-weight: 700; }

.chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 16px 24px 0; }
.chips__label { font-size: 12.5px; font-weight: 700; color: var(--ds-text-muted); margin-inline-end: 4px; }
.chip {
  background: var(--ds-primary-soft);
  color: var(--ds-primary);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
}
.chip--tech { background: var(--ds-surface-2); color: var(--ds-text); }

.content { padding: 20px 24px 28px; line-height: 1.9; font-size: 15px; color: var(--ds-text); }
.content__empty { color: var(--ds-text-muted); }

.gallery { padding: 0 24px 28px; }
.gallery__title { margin: 0 0 12px; font-size: 16px; font-weight: 800; }
.gallery__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.gallery__grid img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--ds-radius-sm); border: 1px solid var(--ds-border); }

.preview__side { position: sticky; top: 18px; }
.side__label { display: block; font-size: 12px; color: var(--ds-text-muted); font-weight: 700; margin-bottom: 10px; }

@media (max-width: 980px) {
  .preview__cols { grid-template-columns: 1fr; }
  .preview__side { position: static; }
}
</style>
