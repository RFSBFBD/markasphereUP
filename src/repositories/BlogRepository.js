import { supabase } from '@/lib/supabase/client'

const POST_SELECT = '*, category:post_categories(id, name_ar, name_en, slug, color), tags:post_tags_rel(tag:post_tags(id, name, slug, color))'

export const BlogRepository = {
  async getPosts({ page = 1, perPage = 20, search = '', filters = {}, orderBy = 'created_at', order = 'desc' } = {}) {
    let query = supabase
      .from('posts')
      .select(POST_SELECT, { count: 'exact' })
      .is('deleted_at', null)

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,seo_title.ilike.%${search}%`)
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

  async getPost(id) {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createPost(postData) {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select(POST_SELECT)
      .single()
    if (error) throw error
    return data
  },

  async updatePost(id, updates) {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(POST_SELECT)
      .single()
    if (error) throw error
    return data
  },

  async deletePost(id) {
    const { error } = await supabase
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  },

  async permanentDeletePost(id) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async restorePost(id) {
    const { data, error } = await supabase
      .from('posts')
      .update({ deleted_at: null })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getTrash({ page = 1, perPage = 20, search = '', filters = {} } = {}) {
    let query = supabase
      .from('posts')
      .select(POST_SELECT, { count: 'exact' })
      .not('deleted_at', 'is', null)

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        query = query.eq(key, value)
      }
    })

    query = query.order('deleted_at', { ascending: false })

    const from = (page - 1) * perPage
    query = query.range(from, from + perPage - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0, page, perPage }
  },

  async getStats() {
    const [published, drafts, scheduled, total] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published').is('deleted_at', null),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft').is('deleted_at', null),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled').is('deleted_at', null),
      supabase.from('posts').select('id', { count: 'exact', head: true }).is('deleted_at', null)
    ])
    return {
      published: published.count || 0,
      drafts: drafts.count || 0,
      scheduled: scheduled.count || 0,
      total: total.count || 0
    }
  },

  async getTagsForPost(postId) {
    const { data, error } = await supabase
      .from('post_tags_rel')
      .select('tag:post_tags(id, name, slug, color)')
      .eq('post_id', postId)
    if (error) throw error
    return data.map(r => r.tag)
  },

  async setTagsForPost(postId, tagIds) {
    await supabase.from('post_tags_rel').delete().eq('post_id', postId)
    if (tagIds.length > 0) {
      const rows = tagIds.map(tagId => ({ post_id: postId, tag_id: tagId }))
      const { error } = await supabase.from('post_tags_rel').insert(rows)
      if (error) throw error
    }
  },

  async saveRevision(postId, userId) {
    const post = await this.getPost(postId)
    const { count } = await supabase
      .from('post_revisions')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId)

    const { error } = await supabase.from('post_revisions').insert({
      post_id: postId,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      revision_number: (count || 0) + 1,
      created_by: userId
    })
    if (error) throw error
  },

  async getRevisions(postId) {
    const { data, error } = await supabase
      .from('post_revisions')
      .select('*')
      .eq('post_id', postId)
      .order('revision_number', { ascending: false })
    if (error) throw error
    return data
  },

  async getCategories({ perPage = 100, orderBy = 'sort_order', order = 'asc', filters = {} } = {}) {
    let query = supabase
      .from('post_categories')
      .select('*', { count: 'exact' })

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        query = query.eq(key, value)
      }
    })

    query = query.order(orderBy, { ascending: order === 'asc' })

    if (perPage) {
      const { data, error, count } = await query.limit(perPage)
      if (error) throw error
      return { data: data || [], total: count || 0 }
    }

    const { data, error, count } = await query
    if (error) throw error
    return { data: data || [], total: count || 0 }
  },

  async getCategory(id) {
    const { data, error } = await supabase
      .from('post_categories')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createCategory(catData) {
    const { data, error } = await supabase
      .from('post_categories')
      .insert(catData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateCategory(id, updates) {
    const { data, error } = await supabase
      .from('post_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('post_categories')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async getTags({ perPage = 200 } = {}) {
    const { data, error } = await supabase
      .from('post_tags')
      .select('*')
      .order('name', { ascending: true })
      .limit(perPage)
    if (error) throw error
    return data || []
  },

  async getTag(id) {
    const { data, error } = await supabase
      .from('post_tags')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createTag(tagData) {
    const { data, error } = await supabase
      .from('post_tags')
      .insert(tagData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateTag(id, updates) {
    const { data, error } = await supabase
      .from('post_tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteTag(id) {
    const { error } = await supabase
      .from('post_tags')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async getOrCreateTag(name) {
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
    const { data: existing } = await supabase
      .from('post_tags')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .single()

    if (existing) return existing

    const { data, error } = await supabase
      .from('post_tags')
      .insert({ name, slug })
      .select()
      .single()
    if (error) throw error
    return data
  },

  subscribe(callback) {
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, callback)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }
}
