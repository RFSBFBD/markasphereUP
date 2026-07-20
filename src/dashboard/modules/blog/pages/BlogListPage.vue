<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blogStore'
import BlogTable from '../components/BlogTable.vue'
import BlogCardPreview from '../components/BlogCardPreview.vue'
import DeleteDialog from '../components/DeleteDialog.vue'
import { BLOG_CATEGORIES } from '../utils/helpers'

const router = useRouter()
const store = useBlogStore()
const showDelete = ref(null)

onMounted(() => store.loadPosts())

function goTo(path) {
  router.push(path)
}
function applyFilter() {
  store.filters.value.page = 1
  store.loadPosts()
}
function prev() {
  if (store.filters.value.page > 1) { store.filters.value.page--; store.loadPosts() }
}
function next() {
  if (store.filters.value.page < store.pages.value) { store.filters.value.page++; store.loadPosts() }
}
function confirmDelete() {
  if (showDelete.value) store.deletePost(showDelete.value.id)
  showDelete.value = null
}
</script>

<template>
  <div class="page">
    <header class="page__head">
      <div>
        <h1 class="page__title">المدونة</h1>
        <p class="page__sub">إدارة مقالات الموقع ({{ store.total.value }} مقال)</p>
      </div>
      <button class="ds-btn is-primary" @click="goTo('/dashboard/blog/create')">+ مقال جديد</button>
    </header>

    <div class="toolbar">
      <select v-model="store.filters.value.category" class="toolbar__input" @change="applyFilter">
        <option value="">كل التصنيفات</option>
        <option v-for="c in BLOG_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
      <select v-model="store.filters.value.published" class="toolbar__input" @change="applyFilter">
        <option :value="null">كل الحالات</option>
        <option :value="true">منشور</option>
        <option :value="false">مسودة</option>
      </select>
      <input v-model="store.filters.value.search" class="toolbar__input" placeholder="بحث بالعنوان أو الرابط..." @input="applyFilter" />
    </div>

    <div
      v-if="!store.loading.value && store.posts.value.length && store.filters.value.category === '' && !store.filters.value.search && store.filters.value.page === 1"
      class="preview-strip"
    >
      <h2 class="preview-strip__title">معاينة البطاقات</h2>
      <div class="preview-strip__grid">
        <BlogCardPreview v-for="p in store.posts.value.slice(0, 4)" :key="p.id" :post="p" />
      </div>
    </div>

    <BlogTable
      :posts="store.posts.value"
      :loading="store.loading.value"
      @preview="(p) => goTo('/dashboard/blog/' + p.id + '/preview')"
      @edit="(p) => goTo('/dashboard/blog/' + p.id + '/edit')"
      @delete="(p) => (showDelete = p)"
      @toggle="store.togglePublish"
    />

    <div class="pager">
      <button class="ds-btn" :disabled="store.filters.value.page <= 1" @click="prev">السابق</button>
      <span>صفحة {{ store.filters.value.page }} من {{ store.pages.value }}</span>
      <button class="ds-btn" :disabled="store.filters.value.page >= store.pages.value" @click="next">التالي</button>
    </div>

    <DeleteDialog
      v-if="showDelete"
      :item-name="showDelete.title_ar"
      @confirm="confirmDelete"
      @cancel="showDelete = null"
    />
  </div>
</template>

<style scoped>
.page { padding: 24px; }
.page__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.page__title { margin: 0; font-size: 24px; font-weight: 900; }
.page__sub { margin: 4px 0 0; color: var(--ds-text-muted); font-size: 13px; }
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.toolbar__input { height: 42px; border-radius: 10px; border: 1px solid var(--ds-border); background: var(--ds-surface); color: var(--ds-text); padding: 0 12px; font-size: 14px; min-width: 180px; }
.preview-strip { margin-bottom: 22px; }
.preview-strip__title { font-size: 15px; font-weight: 800; margin: 0 0 12px; color: var(--ds-text); }
.preview-strip__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.pager { display: flex; align-items: center; gap: 14px; justify-content: center; margin-top: 18px; color: var(--ds-text-muted); font-size: 13px; }
@media (max-width: 1100px) { .preview-strip__grid { grid-template-columns: repeat(2, 1fr); } }
</style>
