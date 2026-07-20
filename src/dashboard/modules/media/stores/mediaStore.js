import { defineStore } from 'pinia'
import { mediaService } from '@/dashboard/modules/media/services/mediaService'

function emptyPagination() {
  return { page: 1, perPage: 24, total: 0, pages: 1 }
}

export const useMediaStore = defineStore('media', {
  state: () => ({
    loading: false,
    images: [],
    selectedImages: [],
    search: '',
    pagination: emptyPagination(),
    currentFolder: 'all',
  }),
  actions: {
    setFolder(folder) {
      this.currentFolder = folder
      this.pagination.page = 1
    },
    setSearch(value) {
      this.search = value
      this.pagination.page = 1
    },
    setPage(page) {
      this.pagination.page = page
    },
    async loadImages() {
      this.loading = true
      try {
        const res = await mediaService.getImages({
          page: this.pagination.page,
          perPage: this.pagination.perPage,
          folder: this.currentFolder,
          search: this.search,
        })
        this.images = res.data
        this.pagination = { ...this.pagination, total: res.total, pages: res.pages }
      } finally {
        this.loading = false
      }
    },
    async upload(file, folder, opts = {}) {
      const row = await mediaService.uploadImage(file, folder, opts.meta || {}, {
        onProgress: opts.onProgress,
        signal: opts.signal,
      })
      await this.loadImages()
      return row
    },
    async deleteImage(id) {
      await mediaService.deleteImage(id)
      this.images = this.images.filter((i) => i.id !== id)
      this.unselect(id)
    },
    async deleteSelected() {
      if (!this.selectedImages.length) return
      await mediaService.deleteMany([...this.selectedImages])
      const set = new Set(this.selectedImages)
      this.images = this.images.filter((i) => !set.has(i.id))
      this.selectedImages = []
    },
    select(id) {
      if (!this.selectedImages.includes(id)) this.selectedImages.push(id)
    },
    unselect(id) {
      this.selectedImages = this.selectedImages.filter((x) => x !== id)
    },
    clearSelection() {
      this.selectedImages = []
    },
  },
})
