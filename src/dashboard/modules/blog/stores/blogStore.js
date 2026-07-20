import { ref } from 'vue'
import * as blogService from '../services/blogService'
import { useToast } from '@/dashboard/composables/useToast'

export function useBlogStore() {
  const toast = useToast()
  const posts = ref([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)
  const currentPost = ref(null)
  const filters = ref({ page: 1, perPage: 12, category: '', search: '', published: null })

  async function loadPosts() {
    loading.value = true
    try {
      const { data, total: t, pages: p } = await blogService.getAll(filters.value)
      posts.value = data
      total.value = t
      pages.value = p
    } catch (e) {
      toast.error('تعذر تحميل المقالات')
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function loadPost(id) {
    loading.value = true
    try {
      currentPost.value = await blogService.getById(id)
    } catch (e) {
      toast.error('تعذر تحميل المقال')
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  function buildGalleryPayload(form) {
    return (form.gallery || [])
      .filter((g) => g.status !== 'removed')
      .map((g) => ({ id: g.id, url: g.url, status: g.status }))
  }

  async function createPost(form) {
    try {
      const created = await blogService.create(form)
      const items = buildGalleryPayload(form)
      if (items.length) {
        await blogService.addGallery(created.id, items.map((i) => i.url))
      }
      toast.success('تم إنشاء المقال بنجاح')
      return created
    } catch (e) {
      toast.error('فشل إنشاء المقال')
      console.error(e)
      throw e
    }
  }

  async function updatePost(id, form) {
    try {
      await blogService.update(id, form)
      const items = form.gallery || []
      const newIds = []
      for (const it of items) {
        if (it.status === 'new') {
          const ins = await blogService.addGallery(id, [it.url])
          ins.forEach((r) => newIds.push(r.id))
        } else if (it.status === 'removed' && it.id) {
          await blogService.deleteGalleryItem(it.id)
        }
      }
      const finalIds = items
        .filter((i) => i.status !== 'removed')
        .map((i) => (i.status === 'new' ? newIds.shift() : i.id))
        .filter(Boolean)
      if (finalIds.length) await blogService.reorderGallery(id, finalIds)
      toast.success('تم تحديث المقال بنجاح')
      return { id }
    } catch (e) {
      toast.error('فشل تحديث المقال')
      console.error(e)
      throw e
    }
  }

  async function deletePost(id) {
    try {
      await blogService.remove(id)
      toast.success('تم حذف المقال')
      await loadPosts()
    } catch (e) {
      toast.error('فشل حذف المقال')
      console.error(e)
    }
  }

  async function togglePublish(post) {
    try {
      await blogService.update(post.id, { ...post, published: !post.published })
      post.published = !post.published
      toast.success(post.published ? 'تم نشر المقال' : 'تم إلغاء النشر')
    } catch (e) {
      toast.error('فشل تغيير حالة النشر')
      console.error(e)
    }
  }

  return {
    posts,
    total,
    pages,
    loading,
    currentPost,
    filters,
    loadPosts,
    loadPost,
    createPost,
    updatePost,
    deletePost,
    togglePublish,
  }
}
