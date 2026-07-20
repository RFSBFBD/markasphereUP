import { supabase } from '@/lib/supabase/client'

const isDev = import.meta.env.DEV

// Dashboard stores `category` as a plain string column (no project_categories table),
// so we select plain columns only and map the string id for the UI.
const SELECT = '*'

const DETAILED_SELECT = `
  *,
  gallery:project_gallery(id, image, sort_order)
`

const CATEGORY_GRADIENTS = {
  'visual-identity': 'linear-gradient(135deg, #2a2a72 0%, #009ffd 100%)',
  'brand-strategy': 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
  'digital-marketing': 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
  'web-development': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'content-creation': 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
  'ui-ux-design': 'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)'
}

// Deterministic fallback gradient so cards never render with a blank background
// when the dashboard has not set a per-project gradient.
function fallbackGradient(project) {
  const key = project?.category || project?.id || ''
  const keys = Object.keys(CATEGORY_GRADIENTS)
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return CATEGORY_GRADIENTS[keys[hash % keys.length]]
}

function log(operation, details) {
  if (isDev) console.log(`[ProjectsPublic:${operation}]`, details)
}

async function handleSupabaseError(error, operation) {
  if (isDev) console.error(`[ProjectsPublic:${operation}] Error:`, error)
  throw error
}

export const projectsPublicService = {
  async getAll({ page = 1, perPage = 50, published = true } = {}) {
    log('getAll', { page, perPage, published })

    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase
      .from('projects')
      .select(SELECT, { count: 'exact' })

    if (published) {
      query = query.eq('published', true)
    }

    query = query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await query
    if (error) handleSupabaseError(error, 'getAll')

    return {
      data: (data || []).map(mapProject),
      total: count || 0,
      page,
      perPage
    }
  },

  async getBySlug(slug) {
    log('getBySlug', { slug })

    const { data, error } = await supabase
      .from('projects')
      .select(DETAILED_SELECT)
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) handleSupabaseError(error, 'getBySlug')

    return data ? mapProjectDetailed(data) : null
  },

  async getById(id) {
    log('getById', { id })

    const { data, error } = await supabase
      .from('projects')
      .select(DETAILED_SELECT)
      .eq('id', id)
      .single()

    if (error) handleSupabaseError(error, 'getById')

    return data ? mapProjectDetailed(data) : null
  },

  async getFeatured(limit = 10) {
    log('getFeatured', { limit })

    const { data, error } = await supabase
      .from('projects')
      .select(SELECT)
      .eq('published', true)
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .limit(limit)

    if (error) handleSupabaseError(error, 'getFeatured')

    return (data || []).map(mapProject)
  },

  async getByCategory(categoryId) {
    log('getByCategory', { categoryId })

    const { data, error } = await supabase
      .from('projects')
      .select(SELECT)
      .eq('published', true)
      .eq('category', categoryId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) handleSupabaseError(error, 'getByCategory')

    return (data || []).map(mapProject)
  },

  async getAdjacent(slug) {
    log('getAdjacent', { slug })

    const { data: current } = await supabase
      .from('projects')
      .select('id, display_order, created_at')
      .eq('slug', slug)
      .single()

    if (!current) return { prev: null, next: null }

    const { data: prev } = await supabase
      .from('projects')
      .select('slug, title_ar, title_en, thumbnail, cover_image')
      .eq('published', true)
      .or(`display_order.lt.${current.display_order},and(display_order.eq.${current.display_order},created_at.lt.${current.created_at})`)
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const { data: next } = await supabase
      .from('projects')
      .select('slug, title_ar, title_en, thumbnail, cover_image')
      .eq('published', true)
      .or(`display_order.gt.${current.display_order},and(display_order.eq.${current.display_order},created_at.gt.${current.created_at})`)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    return {
      prev: prev ? {
        slug: prev.slug,
        titleAr: prev.title_ar,
        titleEn: prev.title_en,
        thumbnail: prev.thumbnail || prev.cover_image,
        cover: prev.cover_image || prev.thumbnail
      } : null,
      next: next ? {
        slug: next.slug,
        titleAr: next.title_ar,
        titleEn: next.title_en,
        thumbnail: next.thumbnail || next.cover_image,
        cover: next.cover_image || next.thumbnail
      } : null
    }
  },

  async preloadAll() {
    const result = await this.getAll({ perPage: 100 })
    return result.data
  },

  subscribe(callback) {
    const channel = supabase
      .channel('projects-public-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: 'published=eq.true'
      }, callback)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }
}

function mapProject(project) {
  // Dashboard stores `category` as a plain string id (no project_categories table).
  const categorySlug =
    typeof project.category === 'string'
      ? project.category
      : (project.category?.slug || project.category_id)

  const cover = project.cover_image || project.thumbnail || ''
  const thumbnail = project.thumbnail || project.cover_image || ''

  return {
    ...project,
    id: project.id,
    slug: project.slug,
    titleAr: project.title_ar || '',
    titleEn: project.title_en || '',
    descriptionAr: project.description_ar || '',
    descriptionEn: project.description_en || '',
    shortDescriptionAr: project.short_description_ar || '',
    shortDescriptionEn: project.short_description_en || '',
    cover,
    thumbnail,
    gradient: project.gradient || fallbackGradient(project),
    category: categorySlug,
    categoryData: typeof project.category === 'string' ? categorySlug : (project.category || null),
    client: project.client || '',
    industry: project.industry || '',
    year: project.year || '',
    duration: project.duration || '',
    website: project.website || '',
    behance: project.behance || '',
    featured: project.featured || false,
    published: project.published !== false,
    services: project.services || [],
    technologies: project.technologies || [],
    projectUrl: project.project_url || '',
    githubUrl: project.github_url || ''
  }
}

function mapProjectDetailed(project) {
  const mapped = mapProject(project)

  return {
    ...mapped,
    challengeAr: project.challenge_ar,
    challengeEn: project.challenge_en,
    solutionAr: project.solution_ar,
    solutionEn: project.solution_en,
    gallery: (project.gallery || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(g => g.image),
    links: project.links || [],
    videos: project.videos || [],
    process: project.process || [],
    results: project.results || [],
    metadata: project.metadata || {},
    seoTitle: project.seo_title,
    seoDescription: project.seo_description,
    seoKeywords: project.seo_keywords
  }
}

export default projectsPublicService
