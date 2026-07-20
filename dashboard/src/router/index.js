import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'لوحة التحكم' }
  }
]

const router = createRouter({
  history: createWebHistory('/dashboard/'),
  routes
})

export default router
