export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  permissions: string[]
  active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}
