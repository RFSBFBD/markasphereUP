import { defineStore } from 'pinia'
import { projectsService } from '@/dashboard/modules/projects/services/projectsService'

function emptyFilters() {
  return { search: '', category: '', published: null, featured: null }
}

function buildRow(form, coverUrl) {
  return {
    title_ar: form.title_ar?.trim() || null,
    title_en: form.title_en?.trim() || null,
    slug: form.slug?.trim() || null,
    excerpt_ar: form.excerpt_ar?.trim() || null,
    excerpt_en: form.excerpt_en?.trim() || null,
    content_ar: form.content_ar || null,
    content_en: form.content_en || null,
    category: form.category || null,
    services: form.services || null,
    technologies: form.technologies || null,
    client: form.client?.trim() || null,
    completion_date: form.completion_date || null,
    display_order: Number(form.display_order) || 0,
    featured: !!form.featured,
    published: !!form.published,
    cover_image: coverUrl || null,
  }
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    loading: false,
    projects: [],
    currentProject: null,
    pagination: { page: 1, perPage: 10, total: 0, pages: 1 },
    filters: emptyFilters(),
    selectedProjects: [],
  }),
  actions: {
    setFilters(patch) {
      this.filters = { ...this.filters, ...patch }
      this.pagination.page = 1
    },
    setPage(page) {
      this.pagination.page = page
    },
    async loadProjects() {
      this.loading = true
      try {
        const res = await projectsService.getAll({
          page: this.pagination.page,
          perPage: this.pagination.perPage,
          filters: this.filters,
        })
        this.projects = res.data
        this.pagination = { ...this.pagination, total: res.total, pages: res.pages }
      } finally {
        this.loading = false
      }
    },
    async loadProject(id) {
      this.loading = true
      try {
        this.currentProject = await projectsService.getById(id)
        return this.currentProject
      } finally {
        this.loading = false
      }
    },
    resetCurrent() {
      this.currentProject = null
    },
    async isSlugTaken(slug, exceptId = null) {
      const row = await projectsService.getBySlug(slug)
      if (!row) return false
      if (exceptId && String(row.id) === String(exceptId)) return false
      return true
    },
    async createProject(form) {
      const cover = form.coverFile
        ? (await projectsService.uploadCover(form.coverFile)).url
        : form.coverImage || null
      const created = await projectsService.create(buildRow(form, cover))
      if (form.galleryFiles?.length) {
        await projectsService.uploadGallery(form.galleryFiles, created.id)
      }
      return created
    },
    async updateProject(id, form) {
      let coverUrl = form.coverImage || null
      if (form.coverFile) {
        const uploaded = await projectsService.uploadCover(form.coverFile)
        coverUrl = uploaded.url
        if (form.coverPath) await projectsService.deleteImage(form.coverPath).catch(() => {})
      }
      await projectsService.update(id, buildRow(form, coverUrl))

      const items = form.galleryItems || []
      const newIds = []
      for (const item of items) {
        if (item.status === 'new' && item.file) {
          const inserted = await projectsService.uploadGallery([item.file], id)
          inserted.forEach((r) => newIds.push(r.id))
        } else if (item.status === 'removed' && item.id) {
          await projectsService.deleteGalleryItem(item.id, item.url)
        }
      }
      const finalIds = items
        .filter((it) => it.status !== 'removed')
        .map((it) => (it.status === 'new' ? newIds.shift() : it.id))
        .filter((x) => x != null)
      if (finalIds.length) await projectsService.reorderGallery(id, finalIds)
      return true
    },
    async deleteProject(id) {
      await projectsService.delete(id)
      this.projects = this.projects.filter((p) => p.id !== id)
      this.selectedProjects = this.selectedProjects.filter((pid) => pid !== id)
    },
    async setPublished(id, value) {
      const updated = await projectsService.update(id, { published: value })
      this.syncProject(id, updated)
      return updated
    },
    publishProject(id) {
      return this.setPublished(id, true)
    },
    unpublishProject(id) {
      return this.setPublished(id, false)
    },
    async toggleFeatured(id) {
      const current = this.projects.find((p) => p.id === id)
      const next = !(current?.featured ?? false)
      const updated = await projectsService.update(id, { featured: next })
      this.syncProject(id, updated)
      return updated
    },
    syncProject(id, updated) {
      const i = this.projects.findIndex((p) => p.id === id)
      if (i > -1) this.projects[i] = { ...this.projects[i], ...updated }
      if (this.currentProject?.id === id) {
        this.currentProject = { ...this.currentProject, ...updated }
      }
    },
  },
})
