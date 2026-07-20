<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'
import { useToast } from '@/dashboard/composables/useToast'
import SettingsCard from '../components/SettingsCard.vue'
import TextField from '../components/TextField.vue'
import MediaField from '../components/MediaField.vue'

const store = useSettingsStore()
const toast = useToast()
const saving = ref(false)

onMounted(() => {
  store.loadSettings()
  window.addEventListener('beforeunload', onBeforeUnload)
})
onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))

function onBeforeUnload(e) {
  if (store.dirty) {
    e.preventDefault()
    e.returnValue = ''
  }
}

async function onSave() {
  saving.value = true
  try {
    const ok = await store.saveSettings()
    if (ok) toast.success('تم حفظ الإعدادات بنجاح')
    else toast.error('يرجى تصحيح الأخطاء الموضحة قبل الحفظ')
  } catch (e) {
    toast.error('فشل حفظ الإعدادات')
    console.error(e)
  } finally {
    saving.value = false
  }
}

function onReset() {
  store.resetSettings()
  toast.info('تم استعادة القيم المحفوظة')
}
</script>

<template>
  <div class="page">
    <header class="page__head">
      <div>
        <h1 class="page__title">الإعدادات</h1>
        <p class="page__sub">إدارة معلومات الموقع، العلامة التجارية، السيو، والوسائط الاجتماعية.</p>
      </div>
    </header>

    <div v-if="store.loading && !store.form" class="set-loading">جارٍ تحميل الإعدادات...</div>

    <div v-else-if="store.form" class="set-grid">
      <SettingsCard title="عام" subtitle="معلومات الموقع الأساسية">
        <TextField label="اسم الموقع (عربي) *" dir="rtl" :model-value="store.form.site_name_ar" :error="store.errors.site_name_ar" @update:model-value="store.setField('site_name_ar', $event)" />
        <TextField label="اسم الموقع (إنجليزي) *" dir="ltr" :model-value="store.form.site_name_en" :error="store.errors.site_name_en" @update:model-value="store.setField('site_name_en', $event)" />
        <TextField label="وصف الموقع (عربي)" type="textarea" dir="rtl" :model-value="store.form.site_description_ar" @update:model-value="store.setField('site_description_ar', $event)" />
        <TextField label="وصف الموقع (إنجليزي)" type="textarea" dir="ltr" :model-value="store.form.site_description_en" @update:model-value="store.setField('site_description_en', $event)" />
        <TextField label="البريد الإلكتروني للشركة *" type="email" dir="ltr" :model-value="store.form.company_email" :error="store.errors.company_email" @update:model-value="store.setField('company_email', $event)" />
        <TextField label="الهاتف" dir="ltr" :model-value="store.form.phone" :error="store.errors.phone" @update:model-value="store.setField('phone', $event)" />
        <TextField label="واتساب" dir="ltr" :model-value="store.form.whatsapp" :error="store.errors.whatsapp" @update:model-value="store.setField('whatsapp', $event)" />
        <TextField label="رابط خرائط جوجل" type="url" dir="ltr" :model-value="store.form.google_maps_url" :error="store.errors.google_maps_url" @update:model-value="store.setField('google_maps_url', $event)" />
        <TextField label="العنوان (عربي)" dir="rtl" :model-value="store.form.address_ar" @update:model-value="store.setField('address_ar', $event)" />
        <TextField label="العنوان (إنجليزي)" dir="ltr" :model-value="store.form.address_en" @update:model-value="store.setField('address_en', $event)" />
      </SettingsCard>

      <SettingsCard title="الهوية البصرية" subtitle="الشعارات والصور من مكتبة الوسائط">
        <MediaField label="الشعار (Logo)" :model-value="store.form.logo" @update:model-value="store.setField('logo', $event)" />
        <MediaField label="الشعار الأبيض (White Logo)" :model-value="store.form.white_logo" @update:model-value="store.setField('white_logo', $event)" />
        <MediaField label="الأيقونة (Favicon)" :model-value="store.form.favicon" @update:model-value="store.setField('favicon', $event)" />
        <MediaField label="صورة المشاركة (OG Image)" :model-value="store.form.og_image" @update:model-value="store.setField('og_image', $event)" />
      </SettingsCard>

      <SettingsCard title="الصفحة الرئيسية" subtitle="إعدادات قسم الهيرو">
        <TextField label="عنوان الهيرو (عربي)" dir="rtl" :model-value="store.form.hero_title_ar" @update:model-value="store.setField('hero_title_ar', $event)" />
        <TextField label="عنوان الهيرو (إنجليزي)" dir="ltr" :model-value="store.form.hero_title_en" @update:model-value="store.setField('hero_title_en', $event)" />
        <TextField label="وصف الهيرو (عربي)" type="textarea" dir="rtl" :model-value="store.form.hero_description_ar" @update:model-value="store.setField('hero_description_ar', $event)" />
        <TextField label="وصف الهيرو (إنجليزي)" type="textarea" dir="ltr" :model-value="store.form.hero_description_en" @update:model-value="store.setField('hero_description_en', $event)" />
        <TextField label="نص الزر" dir="rtl" :model-value="store.form.hero_button_text" @update:model-value="store.setField('hero_button_text', $event)" />
        <TextField label="رابط الزر" type="url" dir="ltr" :model-value="store.form.hero_button_url" :error="store.errors.hero_button_url" @update:model-value="store.setField('hero_button_url', $event)" />
      </SettingsCard>

      <SettingsCard title="تحسين محركات البحث (SEO)" subtitle="الوسوم والترقيمات">
        <TextField label="عنوان الميتا الافتراضي" dir="ltr" :model-value="store.form.meta_title" @update:model-value="store.setField('meta_title', $event)" />
        <TextField label="وصف الميتا" type="textarea" dir="ltr" :model-value="store.form.meta_description" @update:model-value="store.setField('meta_description', $event)" />
        <TextField label="الكلمات المفتاحية" dir="ltr" :model-value="store.form.keywords" @update:model-value="store.setField('keywords', $event)" />
        <TextField label="كود تحقق جوجل" dir="ltr" :model-value="store.form.google_verification" @update:model-value="store.setField('google_verification', $event)" />
        <TextField label="كود تحقق فيسبوك" dir="ltr" :model-value="store.form.facebook_verification" @update:model-value="store.setField('facebook_verification', $event)" />
        <TextField label="كود تحقق تويتر" dir="ltr" :model-value="store.form.twitter_verification" @update:model-value="store.setField('twitter_verification', $event)" />
      </SettingsCard>

      <SettingsCard title="وسائل التواصل الاجتماعي" subtitle="روابط الحسابات">
        <TextField label="Facebook" type="url" dir="ltr" :model-value="store.form.facebook" :error="store.errors.facebook" @update:model-value="store.setField('facebook', $event)" />
        <TextField label="Instagram" type="url" dir="ltr" :model-value="store.form.instagram" :error="store.errors.instagram" @update:model-value="store.setField('instagram', $event)" />
        <TextField label="LinkedIn" type="url" dir="ltr" :model-value="store.form.linkedin" :error="store.errors.linkedin" @update:model-value="store.setField('linkedin', $event)" />
        <TextField label="Behance" type="url" dir="ltr" :model-value="store.form.behance" :error="store.errors.behance" @update:model-value="store.setField('behance', $event)" />
        <TextField label="Dribbble" type="url" dir="ltr" :model-value="store.form.dribbble" :error="store.errors.dribbble" @update:model-value="store.setField('dribbble', $event)" />
        <TextField label="GitHub" type="url" dir="ltr" :model-value="store.form.github" :error="store.errors.github" @update:model-value="store.setField('github', $event)" />
        <TextField label="YouTube" type="url" dir="ltr" :model-value="store.form.youtube" :error="store.errors.youtube" @update:model-value="store.setField('youtube', $event)" />
        <TextField label="TikTok" type="url" dir="ltr" :model-value="store.form.tiktok" :error="store.errors.tiktok" @update:model-value="store.setField('tiktok', $event)" />
        <TextField label="X (Twitter)" type="url" dir="ltr" :model-value="store.form.x" :error="store.errors.x" @update:model-value="store.setField('x', $event)" />
      </SettingsCard>

      <SettingsCard title="التذييل (Footer)" subtitle="حقوق النشر والوصف">
        <TextField label="حقوق النشر" dir="rtl" :model-value="store.form.footer_copyright" @update:model-value="store.setField('footer_copyright', $event)" />
        <TextField label="وصف التذييل" type="textarea" dir="rtl" :model-value="store.form.footer_description" @update:model-value="store.setField('footer_description', $event)" />
      </SettingsCard>
    </div>

    <div v-if="store.form" class="set-actions" :class="{ 'is-dirty': store.dirty }">
      <div class="set-actions__info">
        <span v-if="store.dirty" class="set-warn">⚠ لديك تغييرات غير محفوظة</span>
        <span v-else-if="store.savedAt" class="set-ok">تم الحفظ في {{ store.savedAt.toLocaleTimeString('ar-EG') }}</span>
      </div>
      <div class="set-actions__btns">
        <button type="button" class="ds-btn" :disabled="!store.dirty || saving" @click="onReset">استعادة</button>
        <button type="button" class="ds-btn is-primary" :disabled="saving" @click="onSave">
          {{ saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 24px; }
.page__head { margin-bottom: 18px; }
.page__title { margin: 0; font-size: 24px; font-weight: 900; }
.page__sub { margin: 4px 0 0; color: var(--ds-text-muted); font-size: 13px; }
.set-loading { padding: 60px; text-align: center; color: var(--ds-text-muted); }
.set-grid { display: flex; flex-direction: column; gap: 18px; padding-bottom: 90px; }
.set-actions {
  position: fixed; bottom: 0; inset-inline: 0; margin-inline: auto; max-width: 1320px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 14px 24px; background: var(--ds-surface); border-top: 1px solid var(--ds-border);
  box-shadow: 0 -8px 24px rgba(0,0,0,.08); z-index: 60;
}
.set-actions.is-dirty { border-top-color: var(--ds-warn); }
.set-warn { color: #b45309; font-weight: 700; font-size: 13.5px; }
.set-ok { color: #16a34a; font-weight: 700; font-size: 13.5px; }
.set-actions__btns { display: flex; gap: 10px; }
@media (max-width: 760px) {
  .set-actions { flex-direction: column; align-items: stretch; }
}
</style>
