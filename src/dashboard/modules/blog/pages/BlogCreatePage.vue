<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blogStore'
import BlogForm from '../components/BlogForm.vue'

const router = useRouter()
const store = useBlogStore()
const submitting = ref(false)

async function onSubmit(form) {
  submitting.value = true
  try {
    const created = await store.createPost(form)
    await router.push({ name: 'dashboard-blog-preview', params: { id: created.id } })
  } catch (e) {
    submitting.value = false
  }
}
function back() {
  router.push({ name: 'dashboard-blog' })
}
</script>

<template>
  <div class="composed">
    <button class="back" @click="back">→ رجوع للقائمة</button>
    <div class="composed__head">
      <h1 class="composed__title">مقال جديد</h1>
      <p class="composed__sub">أضف مقالاً باللغتين العربية والإنجليزية مع صور الغلاف والمعرض.</p>
    </div>
    <BlogForm :submitting="submitting" @submit="onSubmit" />
  </div>
</template>

<style scoped>
.composed { padding: 24px; max-width: 1320px; margin: 0 auto; }
.back { background: none; border: none; color: var(--ds-primary); font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 12px; }
.composed__head { margin-bottom: 18px; }
.composed__title { margin: 0; font-size: 24px; font-weight: 900; }
.composed__sub { margin: 4px 0 0; color: var(--ds-text-muted); font-size: 13px; }
</style>
