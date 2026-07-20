export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  author_id: string
  author?: User
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  featured: boolean
  reading_time?: number
  meta_title?: string
  meta_description?: string
  canonical_url?: string
  created_at: string
  updated_at: string
}

export interface BlogForm {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  status: 'draft' | 'published'
  featured: boolean
  meta_title?: string
  meta_description?: string
  canonical_url?: string
}
