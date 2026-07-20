<script setup>
import { useRouter } from 'vue-router'
import DashboardSidebar from '@/dashboard/components/Sidebar.vue'
import DashboardTopbar from '@/dashboard/components/Topbar.vue'
import ToastHost from '@/dashboard/components/ToastHost.vue'
import { registerDashboardRoutes } from '@/dashboard/router'

const router = useRouter()
registerDashboardRoutes(router)
</script>

<template>
  <div class="ds-app">
    <DashboardSidebar />
    <div class="ds-main">
      <DashboardTopbar />
      <main class="ds-content">
        <router-view />
      </main>
    </div>
    <ToastHost />
  </div>
</template>

<style src="@/dashboard/styles/dashboard.css"></style>
