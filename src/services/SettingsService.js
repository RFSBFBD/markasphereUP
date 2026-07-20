import { supabase } from '@/lib/supabase/client'

const isDev = import.meta.env.DEV

export const settingsService = {
  async getSiteSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) {
      if (isDev) console.error('[SettingsService:getSiteSettings]', error)
      throw error
    }
    return data || null
  }
}

export default settingsService
