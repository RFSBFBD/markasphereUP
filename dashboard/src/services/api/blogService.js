import { BaseRepository } from './baseRepository'

const TABLE = 'blogs'

export const blogService = {
  repository: new BaseRepository(TABLE),

  getAll(options) {
    // TODO: implement with author join, pagination
  },

  getBySlug(slug) {
    // TODO: implement with full content
  },

  getPublished() {
    // TODO: implement only published articles
  },

  getDrafts() {
    // TODO: implement only draft articles
  },

  create(data) {
    // TODO: implement with SEO fields
  },

  update(id, data) {
    // TODO: implement with slug regeneration
  },

  remove(id) {
    // TODO: implement soft delete
  },

  publish(id) {
    // TODO: implement publish action
  },

  unpublish(id) {
    // TODO: implement unpublish action
  }
}
