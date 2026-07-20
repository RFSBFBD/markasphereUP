<script setup>
import { ref, onMounted } from 'vue'
import { useBlogStore } from '../stores/blogStore'
import BlogForm from '../components/BlogForm.vue'

const store = useBlogStore()
const submitting = ref(false)
const notFound = ref(false)
const id = window.location.hash.split('/').filter(Boolean)[3]

onMounted(async () => {
  if (!id) { notFound.value = true; return }
  await store.loadPost(id)
  if (!store.currentPost.value) notFound.value = true
})

async function onSubmit(form) {
  submitting.value = true
  try {
    await store.updatePost(id, form)
    window.location.hash = '/dashboard/blog/' + id + '/preview'
  } catch (e) {
    submitting.value = false
  }
}
function back() {
  window.location.hash = '/dashboard/blog'
}
</script>

<template>
  <div class="composed">
    <button class="back" @click="back">→ رجوع للقائمة</button>
    <div class="composed__head">
      <h1 class="composed__title">تعديل المقال</h1>
      <p class="composed__sub">{{ store.currentPost.value?.title_ar }}</p>
    </div>

    <div v-if="notFound" class="empty">
      <p>تعذر العثور على المقال.</p>
      <button class="ds-btn" @click="back">العودة</button>
    </div>
    <div v-else-if="store.loading.value" class="empty">جارٍ التحميل...</div>
    <BlogForm v-else :post="store.currentPost.value" :submitting="submitting" @submit="onSubmit" />
  </div>
</template>

<style scoped>
.composed { padding: 24px; max-width: 1320px; margin: 0 auto; }
.back { background: none; border: none; color: var(--ds-primary); font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 12px; }
.composed__head { margin-bottom: 18px; }
.composed__title { margin: 0; font-size: 24px; font-weight: 900; }
.composed__sub { margin: 4px 0 0; color: var(--ds-text-muted); font-size: 13px; }
.empty { padding: 60px; text-align: center; color: var(--ds-text-muted); display: flex; flex-direction: column; gap: 14px; align-items: center; }
</style>
