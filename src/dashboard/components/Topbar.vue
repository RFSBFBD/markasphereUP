<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/dashboard/stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const title = computed(() => route.meta?.title || 'لوحة التحكم')
const initials = computed(() => {
  const name = auth.user?.name || ''
  return name.trim().charAt(0).toUpperCase() || 'U'
})

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="ds-topbar">
    <h1>{{ title }}</h1>
    <div class="ds-topbar-actions">
      <span class="ds-avatar">{{ initials }}</span>
      <button class="ds-btn is-danger" type="button" @click="logout">خروج</button>
    </div>
  </header>
</template>
