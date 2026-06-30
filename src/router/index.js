import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

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
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'MarkaSphere | تواصل معنا', description: 'تواصل معنا ودعنا نحول فكرتك إلى واقع. فريق MarkaSphere جاهز لمساعدتك.' }
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

router.beforeEach((to) => {
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
})

export default router
