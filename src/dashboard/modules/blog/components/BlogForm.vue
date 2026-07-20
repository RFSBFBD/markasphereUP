<script setup>
import { reactive, ref, computed } from 'vue'
import { slugify, validateBlog } from '../utils/helpers'
import MediaPicker from '@/dashboard/components/MediaPicker.vue'
import RichTextEditor from '@/dashboard/components/RichTextEditor.vue'
import CategorySelector from './CategorySelector.vue'

const props = defineProps({
  post: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const slugEdited = ref(false)
const errors = ref({})

function mapGallery(post) {
  if (!post || !post.gallery) return []
  return post.gallery.map((g) => ({ id: g.id, url: g.url, status: 'existing' }))
}

const form = reactive({
  title_ar: props.post?.title_ar || '',
  title_en: props.post?.title_en || '',
  slug: props.post?.slug || '',
  excerpt_ar: props.post?.excerpt_ar || '',
  excerpt_en: props.post?.excerpt_en || '',
  content_ar: props.post?.content_ar || '',
  content_en: props.post?.content_en || '',
  category: props.post?.category || '',
  coverImage: props.post?.cover_image ? { url: props.post.cover_image, name: 'cover' } : null,
  gallery: mapGallery(props.post),
  display_order: props.post?.display_order ?? 0,
  published: props.post?.published ?? false,
})

const isEdit = computed(() => !!props.post)

function onTitleEn() {
  if (!slugEdited.value && form.title_en) form.slug = slugify(form.title_en)
}
function onSlugInput(e) {
  slugEdited.value = true
  form.slug = slugify(e.target.value)
}

function onGalleryConfirm(images) {
  const existing = new Set(
    form.gallery.filter((g) => g.status !== 'removed').map((g) => g.url)
  )
  for (const img of images) {
    if (!existing.has(img.url)) {
      form.gallery.push({ id: null, url: img.url, status: 'new' })
      existing.add(img.url)
    }
  }
}
function removeGallery(item) {
  const i = form.gallery.indexOf(item)
  if (i > -1) {
    if (item.status === 'new') form.gallery.splice(i, 1)
    else form.gallery[i].status = 'removed'
  }
}
function restoreGallery(item) {
  const i = form.gallery.indexOf(item)
  if (i > -1 && item.status === 'removed') form.gallery[i].status = 'existing'
}
function onDrop(e, targetIndex) {
  e.preventDefault()
  const from = Number(e.dataTransfer.getData('text/plain'))
  if (Number.isNaN(from) || from === targetIndex) return
  const visible = form.gallery.filter((g) => g.status !== 'removed')
  const moved = visible[from]
  if (!moved) return
  visible.splice(from, 1)
  visible.splice(targetIndex, 0, moved)
  const result = []
  let vi = 0
  for (const g of form.gallery) {
    if (g.status === 'removed') result.push(g)
    else result.push(visible[vi++])
  }
  form.gallery = result
}

function submit() {
  errors.value = validateBlog(form)
  if (Object.keys(errors.value).length) return
  emit('submit', JSON.parse(JSON.stringify(form)))
}
</script>

<template>
  <form class="blog-form" @submit.prevent="submit">
    <div class="blog-form__grid">
      <section class="card">
        <h3 class="card__title">المحتوى العربي</h3>
        <div class="field">
          <label class="field__label">العنوان (عربي) *</label>
          <input class="field__input" :class="{ 'is-invalid': errors.title_ar }" v-model="form.title_ar" />
          <span v-if="errors.title_ar" class="field__err">{{ errors.title_ar }}</span>
        </div>
        <div class="field">
          <label class="field__label">المقتطف (عربي)</label>
          <textarea class="field__input field__textarea" v-model="form.excerpt_ar" rows="2"></textarea>
        </div>
        <div class="field">
          <label class="field__label">نص المقال (عربي) *</label>
          <RichTextEditor v-model="form.content_ar" dir="rtl" placeholder="اكتب المقال بالعربية..." />
          <span v-if="errors.content_ar" class="field__err">{{ errors.content_ar }}</span>
        </div>
      </section>

      <section class="card">
        <h3 class="card__title">English Content</h3>
        <div class="field">
          <label class="field__label">Title (English) *</label>
          <input class="field__input" :class="{ 'is-invalid': errors.title_en }" v-model="form.title_en" @input="onTitleEn" />
          <span v-if="errors.title_en" class="field__err">{{ errors.title_en }}</span>
        </div>
        <div class="field">
          <label class="field__label">Excerpt (English)</label>
          <textarea class="field__input field__textarea" v-model="form.excerpt_en" rows="2"></textarea>
        </div>
        <div class="field">
          <label class="field__label">Article Body (English) *</label>
          <RichTextEditor v-model="form.content_en" dir="ltr" placeholder="Write the article in English..." />
          <span v-if="errors.content_en" class="field__err">{{ errors.content_en }}</span>
        </div>
      </section>

      <aside class="card card--side">
        <h3 class="card__title">الإعدادات</h3>

        <div class="field">
          <label class="field__label">الرابط المختصر (slug) *</label>
          <input class="field__input" :class="{ 'is-invalid': errors.slug }" :value="form.slug" @input="onSlugInput" />
          <span v-if="errors.slug" class="field__err">{{ errors.slug }}</span>
        </div>

        <CategorySelector v-model="form.category" :invalid="!!errors.category" />
        <span v-if="errors.category" class="field__err">{{ errors.category }}</span>

        <div class="field">
          <label class="field__label">ترتيب العرض</label>
          <input type="number" class="field__input" v-model.number="form.display_order" />
        </div>

        <label class="switch">
          <input type="checkbox" v-model="form.published" />
          <span>نشر المقال</span>
        </label>

        <div class="field">
          <label class="field__label">صورة الغلاف</label>
          <MediaPicker v-model="form.coverImage" folder="blog" />
        </div>

        <div class="field">
          <label class="field__label">معرض الصور</label>
          <MediaPicker
            :model-value="form.gallery.filter((g) => g.status !== 'removed')"
            :multiple="true"
            folder="blog"
            @confirm="onGalleryConfirm"
          />
          <div class="gallery-preview" v-if="form.gallery.length">
            <div
              v-for="(item, i) in form.gallery.filter((g) => g.status !== 'removed')"
              :key="item.url"
              class="gallery-item"
              draggable="true"
              @dragstart="(e) => e.dataTransfer.setData('text/plain', String(i))"
              @dragover.prevent
              @drop="onDrop($event, i)"
            >
              <img :src="item.url" :alt="item.url" />
              <button type="button" class="gallery-item__rm" @click="removeGallery(item)">×</button>
            </div>
            <div
              v-for="item in form.gallery.filter((g) => g.status === 'removed')"
              :key="'r' + item.url"
              class="gallery-item gallery-item--removed"
            >
              <img :src="item.url" :alt="item.url" />
              <button type="button" class="gallery-item__restore" @click="restoreGallery(item)">↺</button>
            </div>
          </div>
          <p class="hint">اسحب لإعادة الترتيب. العناصر باللون الرمادي محذوفة (ستُحذف عند الحفظ).</p>
        </div>
      </aside>
    </div>

    <div class="blog-form__actions">
      <slot name="actions">
        <button type="submit" class="ds-btn is-primary" :disabled="submitting">
          {{ submitting ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء المقال' }}
        </button>
      </slot>
    </div>
  </form>
</template>

<style scoped>
.blog-form__grid { display: grid; grid-template-columns: 1fr 1fr 340px; gap: 18px; align-items: start; }
.card { background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.card__title { margin: 0; font-size: 15px; font-weight: 800; color: var(--ds-text); }
.field { display: flex; flex-direction: column; gap: 6px; }
.field__label { font-size: 13px; font-weight: 700; color: var(--ds-text); }
.field__input { height: 44px; border-radius: 10px; border: 1px solid var(--ds-border); background: var(--ds-surface); color: var(--ds-text); padding: 0 12px; font-size: 14px; font-family: inherit; }
.field__textarea { height: auto; padding: 10px 12px; resize: vertical; }
.field__input.is-invalid { border-color: var(--ds-danger); }
.field__err { color: var(--ds-danger); font-size: 12px; }
.switch { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--ds-text); cursor: pointer; }
.switch input { width: 18px; height: 18px; accent-color: var(--ds-primary); }
.gallery-preview { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.gallery-item { position: relative; width: 76px; height: 76px; border-radius: 10px; overflow: hidden; border: 1px solid var(--ds-border); cursor: grab; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item__rm { position: absolute; top: 4px; inset-inline-end: 4px; width: 22px; height: 22px; border-radius: 50%; border: none; background: var(--ds-danger); color: #fff; cursor: pointer; font-size: 14px; line-height: 1; }
.gallery-item--removed { opacity: .5; }
.gallery-item--removed img { filter: grayscale(1); }
.gallery-item__restore { position: absolute; top: 4px; inset-inline-end: 4px; width: 22px; height: 22px; border-radius: 50%; border: none; background: var(--ds-warn); color: #1f1300; cursor: pointer; font-size: 14px; }
.hint { font-size: 11.5px; color: var(--ds-text-muted); margin: 4px 0 0; }
.blog-form__actions { margin-top: 18px; display: flex; justify-content: flex-end; }

@media (max-width: 1100px) {
  .blog-form__grid { grid-template-columns: 1fr; }
}
</style>
