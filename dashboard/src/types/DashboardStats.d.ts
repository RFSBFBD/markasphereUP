export interface DashboardStats {
  total_projects: number
  published_projects: number
  draft_projects: number
  total_blogs: number
  published_blogs: number
  draft_blogs: number
  total_team_members: number
  total_partners: number
  total_media: number
  storage_used: number
  storage_limit: number
  recent_views: number
  views_today: number
  views_change_percent: number
  last_updated: string
}

export interface ActivityEntry {
  id: string
  action: string
  entity_type: string
  entity_id: string
  entity_title: string
  user_id: string
  user_name: string
  created_at: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
  status: number
}

export interface PaginationParams {
  page: number
  per_page: number
  sort_field?: string
  sort_order?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, string>
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
