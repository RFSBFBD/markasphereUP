<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTeamStore } from '@/dashboard/modules/team/stores/teamStore'
import { useToast } from '@/dashboard/composables/useToast'
import TeamCardPreview from '@/dashboard/modules/team/components/TeamCardPreview.vue'

const route = useRoute()
const router = useRouter()
const store = useTeamStore()
const toast = useToast()
const { currentMember, loading } = storeToRefs(store)
const locale = ref('ar')
const id = route.params.id

onMounted(() => store.loadMember(id))

const name = computed(() => (locale.value === 'en' ? currentMember.value?.name_en : currentMember.value?.name_ar) || '—')
const position = computed(() => (locale.value === 'en' ? currentMember.value?.position_en : currentMember.value?.position_ar) || '')
const bio = computed(() => (locale.value === 'en' ? currentMember.value?.bio_en : currentMember.value?.bio_ar) || '')

const socialList = computed(() => {
  const m = currentMember.value
  if (!m) return []
  const labels = { linkedin: 'LinkedIn', github: 'GitHub', behance: 'Behance', x: 'X' }
  return [
    { key: 'linkedin', url: m.linkedin, label: labels.linkedin },
    { key: 'github', url: m.github, label: labels.github },
    { key: 'behance', url: m.behance, label: labels.behance },
    { key: 'x', url: m.x, label: labels.x },
  ].filter((s) => s.url)
})

function paragraphs(t) {
  return (t || '').split(/\n+/).map((s) => s.trim()).filter(Boolean)
}
function goEdit() {
  router.push({ name: 'dashboard-team-edit', params: { id } })
}
function goBack() {
  router.push({ name: 'dashboard-team' })
}
function togglePublish() {
  const m = currentMember.value
  if (!m) return
  store[m.published ? 'unpublishMember' : 'publishMember'](id)
    .then(() => toast.success('تم التحديث'))
    .catch((e) => toast.error(e.message))
}
</script>

<template>
  <section v-if="loading" class="state">جارٍ التحميل...</section>

  <section v-else-if="currentMember" class="preview">
    <div class="preview__bar">
      <button class="ds-btn" type="button" @click="goBack">الرجوع</button>
      <div class="preview__bar-right">
        <div class="locale">
          <button :class="{ on: locale === 'ar' }" type="button" @click="locale = 'ar'">ع</button>
          <button :class="{ on: locale === 'en' }" type="button" @click="locale = 'en'">EN</button>
        </div>
        <button class="ds-btn" type="button" @click="goEdit">تعديل</button>
        <button class="ds-btn is-primary" type="button" @click="togglePublish">
          {{ currentMember.published ? 'إلغاء النشر' : 'نشر' }}
        </button>
      </div>
    </div>

    <div class="preview__cols">
      <div class="preview__main">
        <div class="pcard-wrap">
          <TeamCardPreview :member="currentMember" :locale="locale" />
        </div>

        <div class="block">
          <h3 class="block__title">النبذة</h3>
          <article class="content">
            <p v-for="(p, i) in paragraphs(bio)" :key="i">{{ p }}</p>
            <p v-if="!bio" class="content__empty">لا توجد نبذة لهذه اللغة.</p>
          </article>
        </div>

        <div v-if="socialList.length" class="block">
          <h3 class="block__title">روابط التواصل</h3>
          <ul class="social-list">
            <li v-for="s in socialList" :key="s.key">
              <a :href="s.url" target="_blank" rel="noopener noreferrer">{{ s.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <aside class="preview__side">
        <span class="side__label">بيانات سريعة</span>
        <div class="meta">
          <div class="meta__item"><span class="meta__label">البريد</span><span class="meta__value">{{ currentMember.email || '—' }}</span></div>
          <div class="meta__item"><span class="meta__label">الهاتف</span><span class="meta__value">{{ currentMember.phone || '—' }}</span></div>
          <div class="meta__item"><span class="meta__label">الترتيب</span><span class="meta__value">{{ currentMember.display_order }}</span></div>
          <div class="meta__item"><span class="meta__label">الحالة</span><span class="meta__value">{{ currentMember.published ? 'منشور' : 'مسودة' }}</span></div>
        </div>
      </aside>
    </div>
  </section>

  <section v-else class="state">تعذر تحميل العضو.</section>
</template>

<style scoped>
.state { padding: 60px; text-align: center; color: var(--ds-text-muted); }
.preview__bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.preview__bar-right { display: flex; align-items: center; gap: 10px; }
.locale { display: inline-flex; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-sm); overflow: hidden; }
.locale button { border: none; background: var(--ds-surface); color: var(--ds-text-muted); padding: 8px 12px; font-weight: 700; cursor: pointer; font-size: 13px; }
.locale button.on { background: var(--ds-primary); color: #fff; }
.preview__cols { display: grid; grid-template-columns: 1fr 320px; gap: 18px; align-items: start; }
.pcard-wrap { max-width: 340px; }
.block { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); box-shadow: var(--ds-shadow); padding: 20px; margin-top: 18px; }
.block__title { margin: 0 0 12px; font-size: 15px; font-weight: 800; }
.content { line-height: 1.9; font-size: 15px; color: var(--ds-text); }
.content__empty { color: var(--ds-text-muted); }
.social-list { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
.social-list a { display: inline-block; padding: 6px 14px; border-radius: 999px; background: var(--ds-primary-soft); color: var(--ds-primary); font-size: 13px; font-weight: 600; text-decoration: none; }
.social-list a:hover { background: var(--ds-primary); color: #fff; }
.preview__side { position: sticky; top: 18px; }
.side__label { display: block; font-size: 12px; color: var(--ds-text-muted); font-weight: 700; margin-bottom: 10px; }
.meta { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); box-shadow: var(--ds-shadow); padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.meta__item { display: flex; flex-direction: column; gap: 4px; }
.meta__label { font-size: 12px; color: var(--ds-text-muted); font-weight: 700; }
.meta__value { font-size: 14px; font-weight: 600; word-break: break-all; }

@media (max-width: 980px) {
  .preview__cols { grid-template-columns: 1fr; }
  .preview__side { position: static; }
}
</style>
