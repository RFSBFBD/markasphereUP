import { defineStore } from 'pinia'

export const useMediaStore = defineStore('media', {
  state: () => ({
    files: [],
    total: 0,
    uploading: false,
    loading: false,
    error: null
  }),
  getters: {
    images: (state) => state.files.filter(f => f.mime_type?.startsWith('image/')),
    recentFiles: (state) => [...state.files].sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    )
  },
  actions: {
    fetchFiles(params) {},
    uploadFile(file, options) {},
    uploadMultiple(files, options) {},
    deleteFile(id) {},
    deleteFiles(ids) {},
    updateFile(id, data) {},
    clearError() {}
  }
})
