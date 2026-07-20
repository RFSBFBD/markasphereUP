<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/dashboard/modules/projects/stores/projectsStore'
import { useToast } from '@/dashboard/composables/useToast'
import ProjectForm from '@/dashboard/modules/projects/components/ProjectForm.vue'

const router = useRouter()
const store = useProjectsStore()
const toast = useToast()
const saving = ref(false)

async function onSubmit(payload) {
  saving.value = true
  try {
    const taken = await store.isSlugTaken(payload.slug)
    if (taken) {
      toast.error('هذا الـ slug مستخدم بالفعل')
      saving.value = false
      return
    }
    const created = await store.createProject(payload)
    toast.success('تم إنشاء المشروع')
    router.push({ name: 'dashboard-projects-preview', params: { id: created.id } })
  } catch (e) {
    toast.error(e.message || 'فشل الحفظ')
    saving.value = false
  }
}
function cancel() {
  router.push({ name: 'dashboard-projects' })
}
</script>

<template>
  <section>
    <h2 class="page-title">مشروع جديد</h2>
    <ProjectForm :loading="saving" @submit="onSubmit" @cancel="cancel" />
  </section>
</template>

<style scoped>
.page-title { margin: 0 0 18px; font-size: 22px; font-weight: 800; }
</style>
