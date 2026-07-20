import { supabase } from '@/lib/supabase/client'

export const TeamRepository = {
  async getMembers({ page = 1, perPage = 20, search = '', filters = {}, orderBy = 'sort_order', order = 'asc' } = {}) {
    let query = supabase
      .from('team_members')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,display_name.ilike.%${search}%,job_title.ilike.%${search}%,email.ilike.%${search}%`)
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        query = query.eq(key, value)
      }
    })

    query = query.order(orderBy, { ascending: order === 'asc' })

    const from = (page - 1) * perPage
    query = query.range(from, from + perPage - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0, page, perPage }
  },

  async getMember(id) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createMember(memberData) {
    const { data, error } = await supabase
      .from('team_members')
      .insert(memberData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateMember(id, updates) {
    const { data, error } = await supabase
      .from('team_members')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteMember(id) {
    const { error } = await supabase
      .from('team_members')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async permanentDeleteMember(id) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async restoreMember(id) {
    const { data, error } = await supabase
      .from('team_members')
      .update({ deleted_at: null })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async restoreMultiple(ids) {
    const { error } = await supabase
      .from('team_members')
      .update({ deleted_at: null })
      .in('id', ids)
    if (error) throw error
  },

  async deleteMultiple(ids) {
    const { error } = await supabase
      .from('team_members')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', ids)
    if (error) throw error
  },

  async publishMultiple(ids) {
    const { error } = await supabase
      .from('team_members')
      .update({ status: 'published' })
      .in('id', ids)
    if (error) throw error
  },

  async unpublishMultiple(ids) {
    const { error } = await supabase
      .from('team_members')
      .update({ status: 'draft' })
      .in('id', ids)
    if (error) throw error
  },

  async getTrash({ page = 1, perPage = 40, search = '' } = {}) {
    let query = supabase
      .from('team_members')
      .select('*', { count: 'exact' })
      .not('deleted_at', 'is', null)

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,display_name.ilike.%${search}%`)
    }

    query = query.order('deleted_at', { ascending: false })

    const from = (page - 1) * perPage
    query = query.range(from, from + perPage - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0, page, perPage }
  },

  async emptyTrash() {
    const { data: trashed } = await supabase
      .from('team_members')
      .select('id')
      .not('deleted_at', 'is', null)

    if (!trashed?.length) return true

    const ids = trashed.map(t => t.id)
    const { error } = await supabase
      .from('team_members')
      .delete()
      .in('id', ids)
    if (error) throw error
    return true
  },

  async getStats() {
    const [total, published, drafts, featured] = await Promise.all([
      supabase.from('team_members').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('status', 'published').is('deleted_at', null),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('status', 'draft').is('deleted_at', null),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('featured', true).is('deleted_at', null)
    ])
    return {
      total: total.count || 0,
      published: published.count || 0,
      drafts: drafts.count || 0,
      featured: featured.count || 0
    }
  },

  async getByDepartment(departmentId) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('department_id', departmentId)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async toggleFeatured(id) {
    const member = await this.getMember(id)
    const { data, error } = await supabase
      .from('team_members')
      .update({ featured: !member.featured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  subscribe(callback) {
    const channel = supabase
      .channel('team-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, callback)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },

  async getDepartments({ perPage = 100, orderBy = 'sort_order', order = 'asc' } = {}) {
    let query = supabase
      .from('departments')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order(orderBy, { ascending: order === 'asc' })
      .limit(perPage)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0 }
  },

  async getDepartment(id) {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createDepartment(deptData) {
    const { data, error } = await supabase
      .from('departments')
      .insert(deptData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateDepartment(id, updates) {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteDepartment(id) {
    const { error } = await supabase
      .from('departments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }
}
