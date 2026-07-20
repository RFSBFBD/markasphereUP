<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import CoverUploader from '@/dashboard/modules/projects/components/CoverUploader.vue'
import GalleryUploader from '@/dashboard/modules/projects/components/GalleryUploader.vue'
import { slugify, PROJECT_CATEGORIES, pathFromUrl } from '@/dashboard/modules/projects/utils/helpers'

const props = defineProps({
  project: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title_ar: '', title_en: '', slug: '',
  excerpt_ar: '', excerpt_en: '',
  content_ar: '', content_en: '',
  category: '', services: '', technologies: '',
  client: '', completion_date: '', display_order: 0,
  featured: false, published: false,
})
const coverImage = ref(null)
const coverFile = ref(null)
const coverPath = ref(null)
const galleryItems = ref([])
const slugTouched = ref(false)
const errors = reactive({})

function fill(project) {
  Object.assign(form, {
    title_ar: project.title_ar || '',
    title_en: project.title_en || '',
    slug: project.slug || '',
    excerpt_ar: project.excerpt_ar || '',
    excerpt_en: project.excerpt_en || '',
    content_ar: project.content_ar || '',
    content_en: project.content_en || '',
    category: project.category || '',
    services: project.services || '',
    technologies: project.technologies || '',
    client: project.client || '',
    completion_date: project.completion_date ? String(project.completion_date).slice(0, 10) : '',
    display_order: project.display_order || 0,
    featured: !!project.featured,
    published: !!project.published,
  })
  coverImage.value = project.cover_image || null
  coverPath.value = pathFromUrl(project.cover_image) || null
  coverFile.value = null
  galleryItems.value = (project.gallery || []).map((g) => ({ id: g.id, url: g.image, status: 'existing' }))
}

onMounted(() => {
  if (props.project) {
    fill(props.project)
    slugTouched.value = true
  }
})

watch(() => [form.title_en, form.title_ar], () => {
  if (!slugTouched.value) form.slug = slugify(form.title_en || form.title_ar)
})

function onSlugInput(e) {
  slugTouched.value = true
  form.slug = slugify(e.target.value)
}
function onCoverChange({ file, url }) {
  coverFile.value = file
  coverImage.value = url
}
function onCoverRemove() {
  coverFile.value = null
  coverImage.value = null
  coverPath.value = null
}
function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.title_ar.trim()) errors.title_ar = 'العنوان العربي مطلوب'
  if (!form.title_en.trim()) errors.title_en = 'العنوان الإنجليزي مطلوب'
  if (!form.slug.trim()) errors.slug = 'الـ slug مطلوب'
  else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = 'يُسمح فقط بحروف إنجليزية صغيرة وأرقام وشرطات'
  return Object.keys(errors).length === 0
}
function onSubmit() {
  if (!validate()) return
  emit('submit', {
    ...form,
    coverFile: coverFile.value,
    coverImage: coverImage.value,
    coverPath: coverPath.value,
    galleryItems: galleryItems.value,
    galleryFiles: galleryItems.value.filter((i) => i.status === 'new').map((i) => i.file),
  })
}
</script>

<template>
  <form class="pform" @submit.prevent="onSubmit">
    <div class="pform__cols">
      <section class="pform__card">
        <h3 class="pform__sec">المحتوى</h3>

        <div class="pform__grid">
          <div class="pform__field">
            <label>العنوان (عربي) <span class="req">*</span></label>
            <input v-model="form.title_ar" type="text" :class="{ 'has-error': errors.title_ar }" />
            <p v-if="errors.title_ar" class="pform__err">{{ errors.title_ar }}</p>
          </div>
          <div class="pform__field">
            <label>العنوان (إنجليزي) <span class="req">*</span></label>
            <input v-model="form.title_en" type="text" :class="{ 'has-error': errors.title_en }" />
            <p v-if="errors.title_en" class="pform__err">{{ errors.title_en }}</p>
          </div>

          <div class="pform__field">
            <label>الـ slug <span class="req">*</span></label>
            <input :value="form.slug" type="text" dir="ltr" @input="onSlugInput" :class="{ 'has-error': errors.slug }" />
            <p v-if="errors.slug" class="pform__err">{{ errors.slug }}</p>
          </div>
          <div class="pform__field">
            <label>التصنيف</label>
            <select v-model="form.category">
              <option value="">اختر التصنيف</option>
              <option v-for="c in PROJECT_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>

          <div class="pform__field pform__field--full">
            <label>المقتطف (عربي)</label>
            <textarea v-model="form.excerpt_ar" rows="2" />
          </div>
          <div class="pform__field pform__field--full">
            <label>المقتطف (إنجليزي)</label>
            <textarea v-model="form.excerpt_en" rows="2" />
          </div>

          <div class="pform__field pform__field--full">
            <label>المحتوى (عربي)</label>
            <textarea v-model="form.content_ar" rows="6" />
          </div>
          <div class="pform__field pform__field--full">
            <label>المحتوى (إنجليزي)</label>
            <textarea v-model="form.content_en" rows="6" />
          </div>
        </div>
      </section>

      <aside class="pform__card">
        <h3 class="pform__sec">النشر والوسائط</h3>

        <div class="pform__field">
          <label>العميل</label>
          <input v-model="form.client" type="text" />
        </div>
        <div class="pform__grid pform__grid--2">
          <div class="pform__field">
            <label>تاريخ الإنجاز</label>
            <input v-model="form.completion_date" type="date" />
          </div>
          <div class="pform__field">
            <label>ترتيب العرض</label>
            <input v-model.number="form.display_order" type="number" min="0" />
          </div>
        </div>
        <div class="pform__field">
          <label>الخدمات المستخدمة <span class="hint">مفصولة بفاصلة</span></label>
          <input v-model="form.services" type="text" placeholder="هوية بصرية، تصميم مطبوع" />
        </div>
        <div class="pform__field">
          <label>التقنيات المستخدمة <span class="hint">مفصولة بفاصلة</span></label>
          <input v-model="form.technologies" type="text" placeholder="Illustrator، Photoshop" />
        </div>

        <div class="pform__toggles">
          <label class="switch">
            <input v-model="form.published" type="checkbox" />
            <span class="switch__track" /><span class="switch__label">منشور</span>
          </label>
          <label class="switch">
            <input v-model="form.featured" type="checkbox" />
            <span class="switch__track" /><span class="switch__label">مميز</span>
          </label>
        </div>

        <div class="pform__field">
          <label>صورة الغلاف</label>
          <CoverUploader :image="coverImage" @change="onCoverChange" @remove="onCoverRemove" />
        </div>
        <div class="pform__field">
          <label>معرض الصور</label>
          <GalleryUploader v-model="galleryItems" />
        </div>
      </aside>
    </div>

    <div class="pform__actions">
      <button type="button" class="ds-btn" :disabled="loading" @click="emit('cancel')">إلغاء</button>
      <button type="submit" class="ds-btn is-primary" :disabled="loading">
        {{ loading ? 'جارٍ الحفظ...' : (props.project ? 'حفظ التعديلات' : 'إنشاء المشروع') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.pform__cols {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 18px;
  align-items: start;
}
.pform__card {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  box-shadow: var(--ds-shadow);
  padding: 20px;
}
.pform__sec {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 800;
  padding-block-end: 10px;
  border-block-end: 1px solid var(--ds-border);
}
.pform__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pform__grid--2 { grid-template-columns: 1fr 1fr; }
.pform__field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.pform__field--full { grid-column: 1 / -1; }
.pform__field label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ds-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.req { color: var(--ds-danger); }
.hint { font-weight: 500; font-size: 11.5px; color: #98a0ad; }
.pform__field input,
.pform__field textarea,
.pform__field select {
  padding: 10px 12px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface-2);
  color: var(--ds-text);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  width: 100%;
  resize: vertical;
}
.pform__field input:focus,
.pform__field textarea:focus,
.pform__field select:focus { border-color: var(--ds-primary); }
.pform__field .has-error { border-color: var(--ds-danger); }
.pform__err { margin: 0; color: var(--ds-danger); font-size: 12px; font-weight: 600; }

.pform__toggles { display: flex; gap: 18px; margin: 4px 0 16px; }
.switch { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.switch input { display: none; }
.switch__track {
  width: 40px; height: 22px;
  border-radius: 999px;
  background: var(--ds-border);
  position: relative;
  transition: background .15s ease;
  flex-shrink: 0;
}
.switch__track::after {
  content: '';
  position: absolute;
  inset-block-start: 3px;
  inset-inline-start: 3px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform .15s ease;
}
.switch input:checked + .switch__track { background: var(--ds-primary); }
.switch input:checked + .switch__track::after { transform: translateX(-18px); }
.switch__label { font-size: 13.5px; font-weight: 700; }

.pform__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}
.pform__actions .ds-btn { min-width: 130px; justify-content: center; }

@media (max-width: 980px) {
  .pform__cols { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .pform__grid { grid-template-columns: 1fr; }
}
</style>
