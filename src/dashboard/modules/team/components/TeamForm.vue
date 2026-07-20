<script setup>
import { reactive, ref, onMounted } from 'vue'
import MediaPicker from '@/dashboard/components/MediaPicker.vue'
import SocialLinks from '@/dashboard/modules/team/components/SocialLinks.vue'
import { isValidEmail, isValidUrl } from '@/dashboard/modules/team/utils/helpers'

const props = defineProps({
  member: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name_ar: '',
  name_en: '',
  position_ar: '',
  position_en: '',
  bio_ar: '',
  bio_en: '',
  email: '',
  phone: '',
  display_order: 0,
  published: false,
})
const social = reactive({ linkedin: '', github: '', behance: '', x: '' })
const photo = ref(null)
const errors = reactive({})

function fill(member) {
  Object.assign(form, {
    name_ar: member.name_ar || '',
    name_en: member.name_en || '',
    position_ar: member.position_ar || '',
    position_en: member.position_en || '',
    bio_ar: member.bio_ar || '',
    bio_en: member.bio_en || '',
    email: member.email || '',
    phone: member.phone || '',
    display_order: member.display_order || 0,
    published: !!member.published,
  })
  social.linkedin = member.linkedin || ''
  social.github = member.github || ''
  social.behance = member.behance || ''
  social.x = member.x || ''
  photo.value = member.photo ? { url: member.photo, name: member.name_ar || 'photo' } : null
}

onMounted(() => {
  if (props.member) {
    fill(props.member)
  }
})

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name_ar.trim()) errors.name_ar = 'الاسم العربي مطلوب'
  if (!form.name_en.trim()) errors.name_en = 'الاسم الإنجليزي مطلوب'
  if (!form.position_ar.trim()) errors.position_ar = 'المسمى العربي مطلوب'
  if (!form.position_en.trim()) errors.position_en = 'المسمى الإنجليزي مطلوب'
  if (!isValidEmail(form.email)) errors.email = 'البريد الإلكتروني غير صالح'
  for (const key of ['linkedin', 'github', 'behance', 'x']) {
    if (!isValidUrl(social[key])) errors[`social_${key}`] = 'الرابط غير صالح'
  }
  return Object.keys(errors).length === 0
}

function onSubmit() {
  if (!validate()) return
  emit('submit', {
    ...form,
    social: { ...social },
    photo: photo.value,
  })
}
</script>

<template>
  <form class="tform" @submit.prevent="onSubmit">
    <div class="tform__cols">
      <section class="tform__card">
        <h3 class="tform__sec">البيانات الأساسية</h3>
        <div class="tform__grid">
          <div class="tform__field">
            <label>الاسم (عربي) <span class="req">*</span></label>
            <input v-model="form.name_ar" type="text" :class="{ 'has-error': errors.name_ar }" />
            <p v-if="errors.name_ar" class="tform__err">{{ errors.name_ar }}</p>
          </div>
          <div class="tform__field">
            <label>الاسم (إنجليزي) <span class="req">*</span></label>
            <input v-model="form.name_en" type="text" :class="{ 'has-error': errors.name_en }" />
            <p v-if="errors.name_en" class="tform__err">{{ errors.name_en }}</p>
          </div>
          <div class="tform__field">
            <label>المسمى الوظيفي (عربي) <span class="req">*</span></label>
            <input v-model="form.position_ar" type="text" :class="{ 'has-error': errors.position_ar }" />
            <p v-if="errors.position_ar" class="tform__err">{{ errors.position_ar }}</p>
          </div>
          <div class="tform__field">
            <label>المسمى الوظيفي (إنجليزي) <span class="req">*</span></label>
            <input v-model="form.position_en" type="text" :class="{ 'has-error': errors.position_en }" />
            <p v-if="errors.position_en" class="tform__err">{{ errors.position_en }}</p>
          </div>
          <div class="tform__field tform__field--full">
            <label>النبذة (عربي)</label>
            <textarea v-model="form.bio_ar" rows="4" />
          </div>
          <div class="tform__field tform__field--full">
            <label>النبذة (إنجليزي)</label>
            <textarea v-model="form.bio_en" rows="4" />
          </div>
        </div>
      </section>

      <aside class="tform__card">
        <h3 class="tform__sec">الصورة والنشر</h3>
        <div class="tform__field">
          <label>الصورة</label>
          <MediaPicker v-model="photo" folder="team" />
        </div>
        <div class="tform__grid tform__grid--2">
          <div class="tform__field">
            <label>البريد الإلكتروني</label>
            <input v-model="form.email" type="email" dir="ltr" :class="{ 'has-error': errors.email }" />
            <p v-if="errors.email" class="tform__err">{{ errors.email }}</p>
          </div>
          <div class="tform__field">
            <label>الهاتف</label>
            <input v-model="form.phone" type="tel" dir="ltr" />
          </div>
        </div>
        <div class="tform__field">
          <label>ترتيب العرض</label>
          <input v-model.number="form.display_order" type="number" min="0" />
        </div>
        <div class="tform__field">
          <label class="switch">
            <input v-model="form.published" type="checkbox" />
            <span class="switch__track" /><span class="switch__label">منشور</span>
          </label>
        </div>

        <h3 class="tform__sec tform__sec--mt">روابط التواصل</h3>
        <SocialLinks v-model="social" />
        <p v-if="errors.social_linkedin || errors.social_github || errors.social_behance || errors.social_x" class="tform__err">
          تأكد من صحة روابط التواصل (تبدأ بـ http)
        </p>
      </aside>
    </div>

    <div class="tform__actions">
      <button type="button" class="ds-btn" :disabled="loading" @click="emit('cancel')">إلغاء</button>
      <button type="submit" class="ds-btn is-primary" :disabled="loading">
        {{ loading ? 'جارٍ الحفظ...' : (props.member ? 'حفظ التعديلات' : 'إضافة العضو') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.tform__cols { display: grid; grid-template-columns: 1fr 380px; gap: 18px; align-items: start; }
.tform__card { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); box-shadow: var(--ds-shadow); padding: 20px; }
.tform__sec { margin: 0 0 16px; font-size: 15px; font-weight: 800; padding-block-end: 10px; border-block-end: 1px solid var(--ds-border); }
.tform__sec--mt { margin-top: 22px; }
.tform__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.tform__grid--2 { grid-template-columns: 1fr 1fr; }
.tform__field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.tform__field--full { grid-column: 1 / -1; }
.tform__field label { font-size: 13px; font-weight: 700; color: var(--ds-text-muted); }
.req { color: var(--ds-danger); }
.tform__field input, .tform__field textarea {
  padding: 10px 12px; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-sm);
  background: var(--ds-surface-2); color: var(--ds-text); font-size: 14px; font-family: inherit; outline: none; width: 100%; resize: vertical;
}
.tform__field input:focus, .tform__field textarea:focus { border-color: var(--ds-primary); }
.tform__field .has-error { border-color: var(--ds-danger); }
.tform__err { margin: 0; color: var(--ds-danger); font-size: 12px; font-weight: 600; }

.switch { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.switch input { display: none; }
.switch__track { width: 40px; height: 22px; border-radius: 999px; background: var(--ds-border); position: relative; transition: background .15s ease; flex-shrink: 0; }
.switch__track::after { content: ''; position: absolute; inset-block-start: 3px; inset-inline-start: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .15s ease; }
.switch input:checked + .switch__track { background: var(--ds-primary); }
.switch input:checked + .switch__track::after { transform: translateX(-18px); }
.switch__label { font-size: 13.5px; font-weight: 700; }

.tform__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
.tform__actions .ds-btn { min-width: 130px; justify-content: center; }

@media (max-width: 980px) {
  .tform__cols { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .tform__grid { grid-template-columns: 1fr; }
}
</style>
