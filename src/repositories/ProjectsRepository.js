import { supabase } from '@/lib/supabase'

export const ProjectsRepository = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async toggleFeatured(id) {
    const project = await this.getProject(id)
    const { data, error } = await supabase
      .from('projects')
      .update({ featured: !project.featured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('projects')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getProjectCategories({ perPage = 9999, filters = {} } = {}) {
    let query = supabase.from('project_categories').select('*', { count: 'exact' })
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        query = query.eq(key, value)
      }
    })
    query = query.order('name_ar', { ascending: true }).limit(perPage)
    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0 }
  },

  async getProjectCategory(id) {
    const { data, error } = await supabase.from('project_categories').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async createProjectCategory(catData) {
    const { data, error } = await supabase.from('project_categories').insert(catData).select().single()
    if (error) throw error
    return data
  },

  async updateProjectCategory(id, updates) {
    const { data, error } = await supabase.from('project_categories').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteProjectCategory(id) {
    const { error } = await supabase.from('project_categories').delete().eq('id', id)
    if (error) throw error
  },

  async getProjectGallery(projectId) {
    const { data, error } = await supabase
      .from('project_gallery')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async addGalleryItem(item) {
    const { data, error } = await supabase.from('project_gallery').insert(item).select().single()
    if (error) throw error
    return data
  },

  async deleteGalleryItem(id) {
    const { error } = await supabase.from('project_gallery').delete().eq('id', id)
    if (error) throw error
  },

  async deleteGalleryByProject(projectId) {
    const { error } = await supabase.from('project_gallery').delete().eq('project_id', projectId)
    if (error) throw error
  },

  async reorderGallery(items) {
    const updates = items.map(({ id, sort_order }) =>
      supabase.from('project_gallery').update({ sort_order }).eq('id', id)
    )
    const results = await Promise.all(updates)
    const hasError = results.some(r => r.error)
    if (hasError) throw new Error('Failed to reorder gallery items')
  },

  async addGalleryBatch(items) {
    const { data, error } = await supabase.from('project_gallery').insert(items).select()
    if (error) throw error
    return data || []
  }
}
