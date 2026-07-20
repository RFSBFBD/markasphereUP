export interface Partner {
  id: string
  name: string
  logo: string
  website?: string
  order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface PartnerForm {
  name: string
  website?: string
  active: boolean
}
