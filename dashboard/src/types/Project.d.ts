export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category_id: string
  category?: Category
  thumbnail: string
  images: string[]
  tags: string[]
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  order: number
  client_name?: string
  client_url?: string
  completion_date?: string
  technologies: string[]
  testimonial?: string
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface ProjectForm {
  title: string
  slug: string
  description: string
  content: string
  category_id: string
  tags: string[]
  featured: boolean
  status: 'draft' | 'published'
  client_name?: string
  client_url?: string
  completion_date?: string
  technologies: string[]
  testimonial?: string
  meta_title?: string
  meta_description?: string
}
