import { getSupabaseClient } from '@/services/supabase'

export class BaseRepository {
  constructor(table) {
    this.table = table
  }

  get client() {
    return getSupabaseClient()
  }

  getAll(options = {}) {
    // TODO: implement with filters, pagination, sorting
  }

  getById(id) {
    // TODO: implement single record fetch
  }

  getBySlug(slug) {
    // TODO: implement fetch by slug
  }

  create(data) {
    // TODO: implement create record
  }

  update(id, data) {
    // TODO: implement update record
  }

  remove(id) {
    // TODO: implement soft/hard delete
  }

  count(filters = {}) {
    // TODO: implement record count
  }

  exists(filters = {}) {
    // TODO: implement existence check
  }
}
