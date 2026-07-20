import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'

import './styles/main.scss'
import { loadSiteSettings, SITE } from './components/constants/site'

async function bootstrap() {
  await loadSiteSettings()

  if (SITE.favicon) {
    const link = document.querySelector('link[rel="icon"]')
    if (link) link.href = SITE.favicon
  }

  const app = createApp(App)

  app.use(router)
  app.use(createPinia())
  app.use(i18n)

  app.mount('#app')
}

bootstrap()
