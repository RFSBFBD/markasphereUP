import { supabase } from '@/lib/supabase'

const TABLE = 'posts'
const GALLERY = 'post_gallery'

export async function getAll({ page = 1, perPage = 12, category = '', search = '', published } = {}) {
  let query = supabase.from(TABLE).select('*', { count: 'exact' })
  if (category) query = query.eq('category', category)
  if (typeof published === 'boolean') query = query.eq('published', published)
  if (search) {
    query = query.or(`title_ar.ilike.%${search}%,title_en.ilike.%${search}%,slug.ilike.%${search}%`)
  }
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.order('display_order', { ascending: true }).order('created_at', { ascending: false }).range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  const total = count || 0
  return { data: data || [], total, pages: Math.max(1, Math.ceil(total / perPage)) }
}

export async function getById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  const { data: gallery } = await supabase
    .from(GALLERY)
    .select('*')
    .eq('post_id', id)
    .order('sort_order', { ascending: true })
  data.gallery = (gallery || []).map((g) => ({ id: g.id, url: g.image, sort_order: g.sort_order }))
  return data
}

function buildRow(form, cover) {
  return {
    title_ar: form.title_ar?.trim() || '',
    title_en: form.title_en?.trim() || '',
    slug: form.slug?.trim() || '',
    excerpt_ar: form.excerpt_ar?.trim() || '',
    excerpt_en: form.excerpt_en?.trim() || '',
    content_ar: form.content_ar || '',
    content_en: form.content_en || '',
    category: form.category || '',
    cover_image: cover || null,
    display_order: Number(form.display_order) || 0,
    published: !!form.published,
  }
}

export async function create(form) {
  const cover = form.coverImage?.url || form.coverImage || null
  const row = buildRow(form, cover)
  const { data, error } = await supabase.from(TABLE).insert(row).select().single()
  if (error) throw error
  return data
}

export async function update(id, form) {
  const cover = form.coverImage?.url || form.coverImage || null
  const row = buildRow(form, cover)
  const { error } = await supabase.from(TABLE).update(row).eq('id', id)
  if (error) throw error
  return { id }
}

export async function remove(id) {
  await supabase.from(GALLERY).delete().eq('post_id', id)
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

export async function addGallery(postId, urls) {
  if (!urls.length) return []
  const rows = urls.map((image, i) => ({ post_id: postId, image, sort_order: i }))
  const { data, error } = await supabase.from(GALLERY).insert(rows).select()
  if (error) throw error
  return data || []
}

export async function deleteGalleryItem(id) {
  const { error } = await supabase.from(GALLERY).delete().eq('id', id)
  if (error) throw error
}

export async function reorderGallery(postId, ids) {
  const updates = ids.map((id, i) =>
    supabase.from(GALLERY).update({ sort_order: i }).eq('id', id)
  )
  await Promise.all(updates)
}
