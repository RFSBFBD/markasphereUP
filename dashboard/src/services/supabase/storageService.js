import { getSupabaseClient } from './supabaseClient'

export const storageService = {
  upload(bucket, path, file, options) {
    const client = getSupabaseClient()
    // TODO: implement file upload
  },

  download(bucket, path) {
    const client = getSupabaseClient()
    // TODO: implement file download
  },

  remove(bucket, paths) {
    const client = getSupabaseClient()
    // TODO: implement file removal
  },

  getPublicUrl(bucket, path) {
    const client = getSupabaseClient()
    // TODO: implement public url
  },

  list(bucket, folder) {
    const client = getSupabaseClient()
    // TODO: implement file listing
  },

  update(bucket, path, file, options) {
    const client = getSupabaseClient()
    // TODO: implement file update
  }
}
