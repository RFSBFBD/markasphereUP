<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/dashboard/modules/projects/stores/projectsStore'
import { useToast } from '@/dashboard/composables/useToast'
import ProjectForm from '@/dashboard/modules/projects/components/ProjectForm.vue'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()
const toast = useToast()
const { currentProject, loading } = storeToRefs(store)
const saving = ref(false)
const id = route.params.id

onMounted(() => store.loadProject(id))

async function onSubmit(payload) {
  saving.value = true
  try {
    const taken = await store.isSlugTaken(payload.slug, id)
    if (taken) {
      toast.error('هذا الـ slug مستخدم بالفعل')
      saving.value = false
      return
    }
    await store.updateProject(id, payload)
    toast.success('تم حفظ التعديلات')
    router.push({ name: 'dashboard-projects-preview', params: { id } })
  } catch (e) {
    toast.error(e.message || 'فشل الحفظ')
    saving.value = false
  }
}
function cancel() {
  router.push({ name: 'dashboard-projects-preview', params: { id } })
}
</script>

<template>
  <section>
    <h2 class="page-title">تعديل المشروع</h2>
    <div v-if="loading" class="state">جارٍ التحميل...</div>
    <ProjectForm
      v-else-if="currentProject"
      :project="currentProject"
      :loading="saving"
      @submit="onSubmit"
      @cancel="cancel"
    />
    <div v-else class="state">تعذر تحميل المشروع.</div>
  </section>
</template>

<style scoped>
.page-title { margin: 0 0 18px; font-size: 22px; font-weight: 800; }
.state { padding: 60px; text-align: center; color: var(--ds-text-muted); }
</style>
