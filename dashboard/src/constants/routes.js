export const ROUTES = {
  DASHBOARD: {
    HOME: '/',
    _LABEL: 'dashboard'
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    _LABEL: 'auth'
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects/create',
    EDIT: (id) => `/projects/${id}/edit`,
    VIEW: (id) => `/projects/${id}`,
    _LABEL: 'projects'
  },
  BLOG: {
    LIST: '/blog',
    CREATE: '/blog/create',
    EDIT: (id) => `/blog/${id}/edit`,
    VIEW: (id) => `/blog/${id}`,
    _LABEL: 'blog'
  },
  TEAM: {
    LIST: '/team',
    CREATE: '/team/create',
    EDIT: (id) => `/team/${id}/edit`,
    _LABEL: 'team'
  },
  PARTNERS: {
    LIST: '/partners',
    CREATE: '/partners/create',
    EDIT: (id) => `/partners/${id}/edit`,
    _LABEL: 'partners'
  },
  MEDIA: {
    LIST: '/media',
    _LABEL: 'media'
  },
  SETTINGS: {
    GENERAL: '/settings',
    SEO: '/settings/seo',
    SOCIAL: '/settings/social',
    _LABEL: 'settings'
  },
  ANALYTICS: {
    DASHBOARD: '/analytics',
    _LABEL: 'analytics'
  },
  USERS: {
    LIST: '/users',
    EDIT: (id) => `/users/${id}/edit`,
    _LABEL: 'users'
  }
}
