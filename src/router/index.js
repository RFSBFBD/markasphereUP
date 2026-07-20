import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import { registerDashboardRoutes } from '@/dashboard/router'

const DEFAULT_DESC = 'MarkaSphere - وكالة رقمية متخصصة في تصميم وتطوير التجارب الرقمية المتميزة للعلامات التجارية. نبني المواقع والهويات البصرية والأنيميشن الاحترافي.'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'MarkaSphere | وكالة رقمية premium', description: DEFAULT_DESC }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'MarkaSphere | عن الوكالة', description: 'تعرف على قصة MarkaSphere، رؤيتنا ورسالتنا في بناء التجارب الرقمية المتميزة للعلامات التجارية.' }
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/views/ServicesView.vue'),
    meta: { title: 'MarkaSphere | خدماتنا', description: 'خدماتنا الرقمية المتكاملة: تصميم المواقع، تطوير الويب، الهويات البصرية، والأنيميشن الاحترافي.' }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('@/views/PortfolioView.vue'),
    meta: { title: 'MarkaSphere | أعمالنا', description: 'تصفح معرض أعمالنا وتعرف على المشاريع التي أنشأناها لعملائنا في مختلف المجالات.' }
  },
  {
    path: '/portfolio/:slug',
    name: 'portfolio-case',
    component: () => import('@/views/PremiumCaseView.vue'),
    meta: { title: 'MarkaSphere | دراسة حالة', description: 'دراسة حالة متعمقة لمشروع من أعمال MarkaSphere.' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue'),
    meta: { title: 'MarkaSphere | المدونة', description: 'مقالات وأفكار حول تصميم وتطوير التجارب الرقمية والعلامات التجارية.' }
  },
  {
    path: '/blog/:slug',
    name: 'blog-article',
    component: () => import('@/views/BlogDetailView.vue'),
    meta: { title: 'MarkaSphere | مقال', description: 'مقال من مدونة MarkaSphere.' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'MarkaSphere | تواصل معنا', description: 'تواصل معنا ودعنا نحول فكرتك إلى واقع. فريق MarkaSphere جاهز لمساعدتك.' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/dashboard/pages/LoginPage.vue'),
    meta: { title: 'MarkaSphere | تسجيل الدخول', layout: 'bare' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/dashboard/layouts/DashboardLayout.vue'),
    meta: { title: 'لوحة التحكم', layout: 'bare' },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('@/dashboard/pages/DashboardHome.vue'),
        meta: { title: 'لوحة التحكم' }
      },
      {
        path: 'projects',
        name: 'dashboard-projects',
        component: () => import('@/dashboard/modules/projects/pages/ProjectsListPage.vue'),
        meta: { title: 'المشاريع' }
      },
      {
        path: 'projects/create',
        name: 'dashboard-projects-create',
        component: () => import('@/dashboard/modules/projects/pages/ProjectCreatePage.vue'),
        meta: { title: 'مشروع جديد' }
      },
      {
        path: 'projects/:id/edit',
        name: 'dashboard-projects-edit',
        component: () => import('@/dashboard/modules/projects/pages/ProjectEditPage.vue'),
        meta: { title: 'تعديل المشروع' }
      },
      {
        path: 'projects/:id/preview',
        name: 'dashboard-projects-preview',
        component: () => import('@/dashboard/modules/projects/pages/ProjectPreviewPage.vue'),
        meta: { title: 'معاينة المشروع' }
      },
      {
        path: 'blog',
        name: 'dashboard-blog',
        component: () => import('@/dashboard/modules/blog/pages/BlogListPage.vue'),
        meta: { title: 'المدونة' }
      },
      {
        path: 'blog/create',
        name: 'dashboard-blog-create',
        component: () => import('@/dashboard/modules/blog/pages/BlogCreatePage.vue'),
        meta: { title: 'مقال جديد' }
      },
      {
        path: 'blog/:id/edit',
        name: 'dashboard-blog-edit',
        component: () => import('@/dashboard/modules/blog/pages/BlogEditPage.vue'),
        meta: { title: 'تعديل المقال' }
      },
      {
        path: 'blog/:id/preview',
        name: 'dashboard-blog-preview',
        component: () => import('@/dashboard/modules/blog/pages/BlogPreviewPage.vue'),
        meta: { title: 'معاينة المقال' }
      },
      {
        path: 'team',
        name: 'dashboard-team',
        component: () => import('@/dashboard/modules/team/pages/TeamListPage.vue'),
        meta: { title: 'الفريق' }
      },
      {
        path: 'team/create',
        name: 'dashboard-team-create',
        component: () => import('@/dashboard/modules/team/pages/TeamCreatePage.vue'),
        meta: { title: 'عضو جديد' }
      },
      {
        path: 'team/:id/edit',
        name: 'dashboard-team-edit',
        component: () => import('@/dashboard/modules/team/pages/TeamEditPage.vue'),
        meta: { title: 'تعديل العضو' }
      },
      {
        path: 'team/:id/preview',
        name: 'dashboard-team-preview',
        component: () => import('@/dashboard/modules/team/pages/TeamPreviewPage.vue'),
        meta: { title: 'معاينة العضو' }
      },
      {
        path: 'media',
        name: 'dashboard-media',
        component: () => import('@/dashboard/modules/media/pages/MediaLibraryPage.vue'),
        meta: { title: 'الوسائط' }
      },
      {
        path: 'settings',
        name: 'dashboard-settings',
        component: () => import('@/dashboard/modules/settings/pages/SettingsPage.vue'),
        meta: { title: 'الإعدادات' }
      },
      {
        path: 'inbox',
        name: 'dashboard-inbox',
        component: () => import('@/dashboard/modules/inbox/pages/InboxPage.vue'),
        meta: { title: 'صندوق الوارد' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'MarkaSphere | الصفحة غير موجودة', description: 'الصفحة التي تبحث عنها غير موجودة. تصفح باقي أقسام موقع MarkaSphere.' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

registerDashboardRoutes(router)

router.beforeEach(async (to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
  let desc = to.meta?.description
  if (to.name === 'portfolio-case') {
    desc = 'دراسة حالة متعمقة لمشروع من أعمال MarkaSphere.'
  }
  const el = document.querySelector('meta[name="description"]')
  if (el && desc) {
    el.setAttribute('content', desc)
  }

  if (to.path.startsWith('/dashboard')) {
    document.title = to.meta?.title || 'لوحة التحكم'
  }
})

export default router
