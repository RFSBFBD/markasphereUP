export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  email?: string
  social_links: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  }
  order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface TeamMemberForm {
  name: string
  role: string
  bio: string
  email?: string
  social_links?: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  }
  active: boolean
}
