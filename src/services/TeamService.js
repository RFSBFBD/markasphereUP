import { supabase } from '@/lib/supabase/client'

const isDev = import.meta.env.DEV

// Normalize a team_members row into the shape consumed by TeamCard.
function mapMember(m) {
  if (!m) return null
  return {
    id: m.id,
    nameAr: m.name_ar || '',
    nameEn: m.name_en || '',
    roleAr: m.position_ar || '',
    roleEn: m.position_en || '',
    bioAr: m.bio_ar || '',
    bioEn: m.bio_en || '',
    image: m.photo || '',
    social: {
      linkedin: m.linkedin || '',
      github: m.github || '',
      behance: m.behance || '',
      x: m.x_twitter || m.x || ''
    },
    displayOrder: m.display_order || 0,
    published: m.published !== false
  }
}

export const teamService = {
  async getAll({ published = true } = {}) {
    let query = supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })

    if (published) query = query.eq('published', true)

    const { data, error } = await query
    if (error) {
      if (isDev) console.error('[TeamService:getAll]', error)
      throw error
    }
    return (data || []).map(mapMember)
  }
}

export default teamService
