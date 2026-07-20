import { supabase } from '@/lib/supabase'
import { optimizeImageFile } from '@/dashboard/modules/media/utils/helpers'

const BUCKET = 'projects'

function publicUrl(path) {
  if (!path) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data?.publicUrl || null
}

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

export const projectsService = {
  async getAll({ page = 1, perPage = 10, filters = {} } = {}) {
    let query = supabase.from('projects').select('*', { count: 'exact' })

    if (filters.search) {
      const s = `%${filters.search}%`
      query = query.or(`title_ar.ilike.${s},title_en.ilike.${s},slug.ilike.${s},client.ilike.${s}`)
    }
    if (filters.category) query = query.eq('category', filters.category)
    if (typeof filters.published === 'boolean') query = query.eq('published', filters.published)
    if (typeof filters.featured === 'boolean') query = query.eq('featured', filters.featured)

    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query
      .order('display_order', { ascending: true })
      .order('updated_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return {
      data: data || [],
      total: count || 0,
      pages: perPage ? Math.max(1, Math.ceil((count || 0) / perPage)) : 1,
    }
  },

  async getById(id) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
    if (error) throw new Error(error.message)
    const gallery = await this.getGallery(id)
    return { ...data, gallery }
  },

  async getBySlug(slug) {
    const { data, error } = await supabase.from('projects').select('id').eq('slug', slug).maybeSingle()
    if (error) throw new Error(error.message)
    return data
  },

  async getGallery(projectId) {
    const { data, error } = await supabase
      .from('project_gallery')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    return (data || []).map((g) => ({ ...g, url: g.image }))
  },

  async create(row) {
    const { data, error } = await supabase.from('projects').insert(row).select().single()
    if (error) throw new Error(error.message)
    return data
  },

  async update(id, patch) {
    const { data, error } = await supabase.from('projects').update(patch).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data
  },

  async delete(id) {
    const project = await this.getById(id)
    if (project?.cover_image) {
      const p = pathFromUrl(project.cover_image)
      if (p) await supabase.storage.from(BUCKET).remove([p]).catch(() => {})
    }
    if (project?.gallery?.length) {
      const paths = project.gallery.map((g) => pathFromUrl(g.image)).filter(Boolean)
      if (paths.length) await supabase.storage.from(BUCKET).remove(paths).catch(() => {})
    }
    await supabase.from('project_gallery').delete().eq('project_id', id)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  async uploadCover(file) {
    const optimized = await optimizeImageFile(file)
    const uploadFile = optimized.file
    const path = buildPath('cover', uploadFile)
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, uploadFile, { upsert: true, cacheControl: '3600' })
    if (error) throw new Error(error.message)
    const url = publicUrl(path)
    return { url, path, width: optimized.width, height: optimized.height }
  },

  async uploadGallery(files, projectId) {
    const inserted = []
    for (const file of files) {
      const optimized = await optimizeImageFile(file)
      const uploadFile = optimized.file
      const path = buildPath('gallery', uploadFile)
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, uploadFile, { upsert: true, cacheControl: '3600' })
      if (error) throw new Error(error.message)
      const { data, error: insErr } = await supabase
        .from('project_gallery')
        .insert({ project_id: projectId, image: publicUrl(path), sort_order: 0 })
        .select()
        .single()
      if (insErr) throw new Error(insErr.message)
      inserted.push({ ...data, url: data.image })
    }
    await this.reorderGallery(projectId, inserted.map((i) => i.id))
    return inserted
  },

  async deleteGalleryItem(id, imageUrl) {
    const p = pathFromUrl(imageUrl)
    if (p) await supabase.storage.from(BUCKET).remove([p]).catch(() => {})
    const { error } = await supabase.from('project_gallery').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  async deleteImage(path) {
    if (!path) return
    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) throw new Error(error.message)
  },

  async reorderGallery(projectId, orderedIds) {
    const updates = orderedIds.map((gid, idx) =>
      supabase.from('project_gallery').update({ sort_order: idx }).eq('id', gid).eq('project_id', projectId)
    )
    await Promise.all(updates)
    return true
  },
}
