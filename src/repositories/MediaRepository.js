import { supabase } from '@/lib/supabase/client'

const TABLE = 'media'
const FOLDERS_TABLE = 'media_folders'
const USAGE_TABLE = 'media_usage'
const BUCKET = 'media'

export const MediaRepository = {
  async list({ page = 1, perPage = 40, search = '', folder = null, module = null, type = null, sort = 'created_at', order = 'desc', includeDeleted = false } = {}) {
    let query = supabase.from(TABLE).select('*', { count: 'exact' })

    if (!includeDeleted) {
      query = query.is('deleted_at', null)
    }

    if (search) {
      query = query.or(`filename.ilike.%${search}%,original_name.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`)
    }
    if (folder) {
      query = query.eq('folder', folder)
    }
    if (module) {
      query = query.eq('module', module)
    }
    if (type) {
      if (type === 'image') query = query.like('mime_type', 'image/%')
      else if (type === 'video') query = query.like('mime_type', 'video/%')
      else if (type === 'document') query = query.like('mime_type', 'application/%')
    }

    const from = (page - 1) * perPage
    const to = from + perPage - 1

    query = query.order(sort, { ascending: order === 'asc' }).range(from, to)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0, page, perPage }
  },

  async getById(id) {
    const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async create(mediaData) {
    const { data, error } = await supabase.from(TABLE).insert(mediaData).select().single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async softDelete(id) {
    const { data, error } = await supabase.from(TABLE).update({ deleted_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async restore(id) {
    const { data, error } = await supabase.from(TABLE).update({ deleted_at: null }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async permanentDelete(id) {
    const { data, error } = await supabase.from(TABLE).delete().eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteMultiple(ids) {
    const { error } = await supabase.from(TABLE).update({ deleted_at: new Date().toISOString() }).in('id', ids)
    if (error) throw error
  },

  async permanentDeleteMultiple(ids) {
    const { error } = await supabase.from(TABLE).delete().in('id', ids)
    if (error) throw error
  },

  async moveToFolder(ids, folder) {
    const { error } = await supabase.from(TABLE).update({ folder }).in('id', ids)
    if (error) throw error
  },

  async countByFolder() {
    const { data, error } = await supabase.from(TABLE).select('folder').is('deleted_at', null)
    if (error) throw error
    const counts = {}
    data.forEach(item => {
      counts[item.folder] = (counts[item.folder] || 0) + 1
    })
    return counts
  },

  async countByModule() {
    const { data, error } = await supabase.from(TABLE).select('module').is('deleted_at', null)
    if (error) throw error
    const counts = {}
    data.forEach(item => {
      counts[item.module] = (counts[item.module] || 0) + 1
    })
    return counts
  },

  async getFolders() {
    const { data, error } = await supabase.from(FOLDERS_TABLE).select('*').order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getTrash({ page = 1, perPage = 40 } = {}) {
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data, error, count } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false })
      .range(from, to)

    if (error) throw error
    return { data: data || [], total: count || 0, page, perPage }
  },

  async emptyTrash() {
    const { data: trashed } = await supabase.from(TABLE).select('id').not('deleted_at', 'is', null)
    if (!trashed || !trashed.length) return true
    const ids = trashed.map(t => t.id)
    const { error } = await supabase.from(TABLE).delete().in('id', ids)
    if (error) throw error
    return true
  },

  async getUsage(mediaId) {
    const usedBy = []

    const { data: usageRows } = await supabase.from(USAGE_TABLE).select('*').eq('media_id', mediaId)
    if (usageRows && usageRows.length) {
      usageRows.forEach(u => usedBy.push({ module: u.module, id: u.record_id, field: u.field_name }))
    }

    const { data: projects } = await supabase
      .from('projects')
      .select('id, title_ar')
      .or(`cover_image.eq.${mediaId},thumbnail.eq.${mediaId}`)
      .eq('deleted_at', null)

    if (projects) {
      projects.forEach(p => {
        if (!usedBy.find(u => u.module === 'projects' && u.id === p.id)) {
          usedBy.push({ module: 'projects', id: p.id, label: p.title_ar })
        }
      })
    }

    return usedBy
  },

  async registerUsage(mediaId, module, recordId, fieldName = '') {
    const { error } = await supabase
      .from(USAGE_TABLE)
      .upsert({ media_id: mediaId, module, record_id: recordId, field_name: fieldName }, { onConflict: 'media_id,module,record_id,field_name' })
    if (error) throw error
  },

  async unregisterUsage(mediaId, module, recordId, fieldName = '') {
    const { error } = await supabase
      .from(USAGE_TABLE)
      .delete()
      .eq('media_id', mediaId)
      .eq('module', module)
      .eq('record_id', recordId)
      .eq('field_name', fieldName)
    if (error) throw error
  },

  async uploadFile(file, folder) {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const path = `${folder}/${fileName}`

    const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
    if (error) throw error

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return { path: data.path, id: data.id, publicUrl: urlData.publicUrl }
  },

  async deleteFile(path) {
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) throw error
  },

  async listFiles(folder) {
    const { data, error } = await supabase.storage.from(BUCKET).list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (error) throw error
    return (data || []).map(file => ({ ...file, full_path: `${folder}/${file.name}` }))
  },

  getPublicUrl(path) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  },

  subscribe(callback) {
    const channel = supabase
      .channel('media-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, callback)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }
}
