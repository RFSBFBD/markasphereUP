import { supabase } from '@/lib/supabase'
import { BUCKET, pathFromUrl, optimizeImageFile } from '@/dashboard/modules/media/utils/helpers'

function fileExt(file) {
  const name = file?.name || ''
  const dot = name.lastIndexOf('.')
  return dot === -1 ? 'bin' : name.slice(dot + 1).toLowerCase()
}

function buildPath(folder, file) {
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `${folder}/${ts}-${rand}.${fileExt(file)}`
}

function publicUrl(path) {
  if (!path) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data?.publicUrl || null
}

export const mediaService = {
  async getImages({ page = 1, perPage = 24, folder = null, search = '' } = {}) {
    let query = supabase.from('media').select('*', { count: 'exact' })
    if (folder && folder !== 'all') query = query.eq('folder', folder)
    if (search) query = query.ilike('name', `%${search}%`)

    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return {
      data: data || [],
      total: count || 0,
      pages: perPage ? Math.max(1, Math.ceil((count || 0) / perPage)) : 1,
    }
  },

  async uploadImage(file, folder = 'projects', meta = {}, opts = {}) {
    const optimized = await optimizeImageFile(file)
    const uploadFile = optimized.file
    const path = buildPath(folder, uploadFile)
    const { error } = await supabase.storage.from(BUCKET).upload(path, uploadFile, {
      cacheControl: '3600',
      upsert: false,
      onUploadProgress: opts.onProgress,
      signal: opts.signal,
    })
    if (error) throw new Error(error.message)

    const url = publicUrl(path)
    const row = {
      name: uploadFile.name,
      folder,
      url,
      path,
      size: uploadFile.size,
      mime: uploadFile.type || optimized.mime,
      width: meta.width || optimized.width || null,
      height: meta.height || optimized.height || null,
      created_at: new Date().toISOString(),
    }
    const { data, error: insErr } = await supabase.from('media').insert(row).select().single()
    if (insErr) {
      await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
      throw new Error(insErr.message)
    }
    return data
  },

  async deleteImage(id) {
    const { data, error } = await supabase.from('media').select('*').eq('id', id).single()
    if (error) throw new Error(error.message)
    if (data?.path) await supabase.storage.from(BUCKET).remove([data.path]).catch(() => {})
    const { error: delErr } = await supabase.from('media').delete().eq('id', id)
    if (delErr) throw new Error(delErr.message)
    return true
  },

  async deleteMany(ids) {
    const { data, error } = await supabase.from('media').select('*').in('id', ids)
    if (error) throw new Error(error.message)
    const paths = (data || []).map((d) => d.path).filter(Boolean)
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths).catch(() => {})
    const { error: delErr } = await supabase.from('media').delete().in('id', ids)
    if (delErr) throw new Error(delErr.message)
    return true
  },
}
