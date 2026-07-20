import { supabase } from '@/lib/supabase'
import { defaultSettings } from '../utils/helpers'

const TABLE = 'site_settings'

export const settingsService = {
  async get() {
    const { data, error } = await supabase.from(TABLE).select('*').limit(1)
    if (error) throw new Error(error.message)
    if (data && data.length) return data[0]

    const base = defaultSettings()
    delete base.id
    const { data: created, error: insErr } = await supabase
      .from(TABLE)
      .insert(base)
      .select()
      .single()
    if (insErr) throw new Error(insErr.message)
    return created
  },

  async update(id, patch) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },
}
