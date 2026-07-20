import { BaseRepository } from './baseRepository'

const TABLE = 'projects'

export const projectService = {
  repository: new BaseRepository(TABLE),

  getAll(options) {
    // TODO: implement with portfolio-specific joins
  },

  getBySlug(slug) {
    // TODO: implement with full project data
  },

  getCategories() {
    // TODO: implement category fetch
  },

  getFeatured() {
    // TODO: implement featured projects
  },

  create(data) {
    // TODO: implement with storage integration
  },

  update(id, data) {
    // TODO: implement with storage integration
  },

  remove(id) {
    // TODO: implement with storage cleanup
  },

  reorder(ids) {
    // TODO: implement drag-and-drop reorder
  },

  toggleFeatured(id) {
    // TODO: implement featured toggle
  }
}
