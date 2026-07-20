import { MediaRepository } from '@/repositories/MediaRepository'

export const MediaService = {
  async list(options = {}) {
    return MediaRepository.list(options)
  },

  async getById(id) {
    return MediaRepository.getById(id)
  },

  async create(mediaData) {
    return MediaRepository.create(mediaData)
  },

  async update(id, updates) {
    return MediaRepository.update(id, updates)
  },

  async softDelete(id) {
    return MediaRepository.softDelete(id)
  },

  async restore(id) {
    return MediaRepository.restore(id)
  },

  async permanentDelete(id) {
    return MediaRepository.permanentDelete(id)
  },

  async deleteMultiple(ids) {
    return MediaRepository.deleteMultiple(ids)
  },

  async permanentDeleteMultiple(ids) {
    return MediaRepository.permanentDeleteMultiple(ids)
  },

  async moveToFolder(ids, folder) {
    return MediaRepository.moveToFolder(ids, folder)
  },

  async countByFolder() {
    return MediaRepository.countByFolder()
  },

  async countByModule() {
    return MediaRepository.countByModule()
  },

  async getFolders() {
    return MediaRepository.getFolders()
  },

  async getTrash(options = {}) {
    return MediaRepository.getTrash(options)
  },

  async emptyTrash() {
    return MediaRepository.emptyTrash()
  },

  async getUsage(mediaId) {
    return MediaRepository.getUsage(mediaId)
  },

  async uploadFile(file, folder) {
    return MediaRepository.uploadFile(file, folder)
  },

  async deleteFile(path) {
    return MediaRepository.deleteFile(path)
  },

  async listFiles(folder) {
    return MediaRepository.listFiles(folder)
  },

  getPublicUrl(path) {
    return MediaRepository.getPublicUrl(path)
  },

  subscribe(callback) {
    return MediaRepository.subscribe(callback)
  }
}
