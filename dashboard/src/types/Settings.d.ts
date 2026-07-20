export interface Settings {
  id: string
  site_name: string
  site_description: string
  site_url: string
  logo_url?: string
  favicon_url?: string
  og_image_url?: string
  default_locale: 'ar' | 'en'
  contact_email: string
  contact_phone?: string
  social_links: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    whatsapp?: string
  }
  analytics_id?: string
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}

export interface SettingsForm {
  site_name: string
  site_description: string
  site_url: string
  default_locale: 'ar' | 'en'
  contact_email: string
  contact_phone?: string
  social_links?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    whatsapp?: string
  }
  analytics_id?: string
  maintenance_mode: boolean
}
