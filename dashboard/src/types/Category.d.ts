export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  order: number
  project_count?: number
  created_at: string
  updated_at: string
}

export interface CategoryForm {
  name: string
  slug: string
  description?: string
}
