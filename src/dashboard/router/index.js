export const dashboardRoutes = [
  { path: '', name: 'dashboard-home', component: () => import('@/dashboard/pages/DashboardHome.vue'), meta: { title: 'لوحة التحكم' } },
  { path: 'projects/create', name: 'dashboard-projects-create', component: () => import('@/dashboard/modules/projects/pages/ProjectCreatePage.vue'), meta: { title: 'مشروع جديد' } },
  { path: 'projects/:id/edit', name: 'dashboard-projects-edit', component: () => import('@/dashboard/modules/projects/pages/ProjectEditPage.vue'), meta: { title: 'تعديل المشروع' } },
  { path: 'projects/:id/preview', name: 'dashboard-projects-preview', component: () => import('@/dashboard/modules/projects/pages/ProjectPreviewPage.vue'), meta: { title: 'معاينة المشروع' } },
  { path: 'projects', name: 'dashboard-projects', component: () => import('@/dashboard/modules/projects/pages/ProjectsListPage.vue'), meta: { title: 'المشاريع' } },
  { path: 'blog', name: 'dashboard-blog', component: () => import('@/dashboard/modules/blog/pages/BlogListPage.vue'), meta: { title: 'المدونة' } },
  { path: 'blog/create', name: 'dashboard-blog-create', component: () => import('@/dashboard/modules/blog/pages/BlogCreatePage.vue'), meta: { title: 'مقال جديد' } },
  { path: 'blog/:id/edit', name: 'dashboard-blog-edit', component: () => import('@/dashboard/modules/blog/pages/BlogEditPage.vue'), meta: { title: 'تعديل المقال' } },
  { path: 'blog/:id/preview', name: 'dashboard-blog-preview', component: () => import('@/dashboard/modules/blog/pages/BlogPreviewPage.vue'), meta: { title: 'معاينة المقال' } },
  { path: 'team/create', name: 'dashboard-team-create', component: () => import('@/dashboard/modules/team/pages/TeamCreatePage.vue'), meta: { title: 'عضو جديد' } },
  { path: 'team/:id/edit', name: 'dashboard-team-edit', component: () => import('@/dashboard/modules/team/pages/TeamEditPage.vue'), meta: { title: 'تعديل العضو' } },
  { path: 'team/:id/preview', name: 'dashboard-team-preview', component: () => import('@/dashboard/modules/team/pages/TeamPreviewPage.vue'), meta: { title: 'معاينة العضو' } },
  { path: 'team', name: 'dashboard-team', component: () => import('@/dashboard/modules/team/pages/TeamListPage.vue'), meta: { title: 'الفريق' } },
  { path: 'media', name: 'dashboard-media', component: () => import('@/dashboard/modules/media/pages/MediaLibraryPage.vue'), meta: { title: 'الوسائط' } },
  { path: 'settings', name: 'dashboard-settings', component: () => import('@/dashboard/modules/settings/pages/SettingsPage.vue'), meta: { title: 'الإعدادات' } },
  { path: 'inbox', name: 'dashboard-inbox', component: () => import('@/dashboard/modules/inbox/pages/InboxPage.vue'), meta: { title: 'صندوق الوارد' } },
]

export function registerDashboardRoutes(router) {
  if (!router) return
  for (const route of dashboardRoutes) {
    if (!router.hasRoute(route.name)) {
      router.addRoute('dashboard', route)
    }
  }
}
