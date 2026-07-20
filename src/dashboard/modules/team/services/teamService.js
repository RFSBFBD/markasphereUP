import { supabase } from '@/lib/supabase'

export const teamService = {
  async getAll({ page = 1, perPage = 10, filters = {} } = {}) {
    let query = supabase.from('team_members').select('*', { count: 'exact' })
    if (filters.search) {
      const s = `%${filters.search}%`
      query = query.or(
        `name_ar.ilike.${s},name_en.ilike.${s},position_ar.ilike.${s},position_en.ilike.${s},email.ilike.${s}`
      )
    }
    if (typeof filters.published === 'boolean') query = query.eq('published', filters.published)

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
    const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single()
    if (error) throw new Error(error.message)
    return data
  },

  async create(row) {
    const { data, error } = await supabase.from('team_members').insert(row).select().single()
    if (error) throw new Error(error.message)
    return data
  },

  async update(id, patch) {
    const { data, error } = await supabase
      .from('team_members')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  async reorder(orderedIds) {
    const updates = orderedIds.map((id, idx) =>
      supabase.from('team_members').update({ display_order: idx }).eq('id', id)
    )
    await Promise.all(updates)
    return true
  },
}
