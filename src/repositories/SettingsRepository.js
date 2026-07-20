import { supabase } from '@/lib/supabase'

export const SettingsRepository = {
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createSettings(settings) {
    const { data, error } = await supabase
      .from('settings')
      .insert(settings)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateSettings(id, settings) {
    const { data, error } = await supabase
      .from('settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async saveSettings(settings) {
    const existing = await this.getSettings()
    if (existing) {
      return this.updateSettings(existing.id, settings)
    }
    return this.createSettings(settings)
  }
}
