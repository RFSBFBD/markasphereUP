import { supabase } from '@/lib/supabase/client'

const isDev = import.meta.env.DEV

const POST_GRADIENTS = {
  branding: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
  marketing: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
  web: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  content: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
  strategy: 'linear-gradient(135deg, #2a2a72 0%, #009ffd 100%)'
}

// Deterministic gradient so cards never render blank when the dashboard
// has not set a per-post gradient.
function fallbackGradient(category) {
  const keys = Object.keys(POST_GRADIENTS)
  const key = category || ''
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return POST_GRADIENTS[keys[hash % keys.length]]
}

function estimateReadTime(contentAr = '', contentEn = '') {
  const words = (contentAr + ' ' + contentEn).trim().split(/\s+/).filter(Boolean).length
  if (!words) return '5 min'
  return `${Math.max(1, Math.round(words / 200))} min`
}

// Normalize a posts row into the shape consumed by BlogCard.
function mapPost(post) {
  if (!post) return null
  return {
    id: post.id,
    slug: post.slug,
    titleAr: post.title_ar || '',
    titleEn: post.title_en || '',
    excerptAr: post.excerpt_ar || '',
    excerptEn: post.excerpt_en || '',
    category: post.category || '',
    cover: post.cover_image || '',
    gradient: post.gradient || fallbackGradient(post.category),
    readTime: post.read_time || estimateReadTime(post.content_ar, post.content_en),
    date: post.created_at || post.published_at || '',
    published: post.published !== false,
    createdAt: post.created_at
  }
}

export const blogService = {
  async getAll({ limit = 50, published = true, category = '', search = '' } = {}) {
    let query = supabase
      .from('posts')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (published) query = query.eq('published', true)
    if (category) query = query.eq('category', category)
    if (search) {
      const s = `%${search}%`
      query = query.or(`title_ar.ilike.${s},title_en.ilike.${s},excerpt_ar.ilike.${s},excerpt_en.ilike.${s}`)
    }
    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) {
      if (isDev) console.error('[BlogService:getAll]', error)
      throw error
    }
    return (data || []).map(mapPost)
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error) {
      if (isDev) console.error('[BlogService:getBySlug]', error)
      throw error
    }
    if (!data) return null
    const base = mapPost(data)
    return {
      ...base,
      contentAr: data.content_ar || '',
      contentEn: data.content_en || '',
      createdAt: data.created_at
    }
  }
}

export default blogService
