import { createI18n } from 'vue-i18n'
import ar from '@/locales/ar.json'
import en from '@/locales/en.json'

const savedLocale = typeof localStorage !== 'undefined' 
  ? localStorage.getItem('locale') || 'ar' 
  : 'ar'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'ar',
  messages: { ar, en }
})

export default i18n
