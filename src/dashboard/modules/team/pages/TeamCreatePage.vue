<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '@/dashboard/modules/team/stores/teamStore'
import { useToast } from '@/dashboard/composables/useToast'
import TeamForm from '@/dashboard/modules/team/components/TeamForm.vue'

const router = useRouter()
const store = useTeamStore()
const toast = useToast()
const saving = ref(false)

async function onSubmit(payload) {
  saving.value = true
  try {
    const created = await store.createMember(payload)
    toast.success('تمت إضافة العضو')
    router.push({ name: 'dashboard-team-preview', params: { id: created.id } })
  } catch (e) {
    toast.error(e.message || 'فشل الحفظ')
    saving.value = false
  }
}
function cancel() {
  router.push({ name: 'dashboard-team' })
}
</script>

<template>
  <section>
    <h2 class="page-title">عضو جديد</h2>
    <TeamForm :loading="saving" @submit="onSubmit" @cancel="cancel" />
  </section>
</template>

<style scoped>
.page-title { margin: 0 0 18px; font-size: 22px; font-weight: 800; }
</style>
