<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTeamStore } from '@/dashboard/modules/team/stores/teamStore'
import { useToast } from '@/dashboard/composables/useToast'
import TeamForm from '@/dashboard/modules/team/components/TeamForm.vue'

const route = useRoute()
const router = useRouter()
const store = useTeamStore()
const toast = useToast()
const { currentMember, loading } = storeToRefs(store)
const saving = ref(false)
const id = route.params.id

onMounted(() => store.loadMember(id))

async function onSubmit(payload) {
  saving.value = true
  try {
    await store.updateMember(id, payload)
    toast.success('تم حفظ التعديلات')
    router.push({ name: 'dashboard-team-preview', params: { id } })
  } catch (e) {
    toast.error(e.message || 'فشل الحفظ')
    saving.value = false
  }
}
function cancel() {
  router.push({ name: 'dashboard-team-preview', params: { id } })
}
</script>

<template>
  <section>
    <h2 class="page-title">تعديل العضو</h2>
    <div v-if="loading" class="state">جارٍ التحميل...</div>
    <TeamForm
      v-else-if="currentMember"
      :member="currentMember"
      :loading="saving"
      @submit="onSubmit"
      @cancel="cancel"
    />
    <div v-else class="state">تعذر تحميل العضو.</div>
  </section>
</template>

<style scoped>
.page-title { margin: 0 0 18px; font-size: 22px; font-weight: 800; }
.state { padding: 60px; text-align: center; color: var(--ds-text-muted); }
</style>
