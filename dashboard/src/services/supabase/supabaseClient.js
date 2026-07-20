import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '@/config'

let client = null

export function getSupabaseClient() {
  if (client) return client

  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    console.warn('[Supabase] Missing credentials. Create a .env file based on .env.example')
    return null
  }

  client = createClient(supabaseConfig.url, supabaseConfig.anonKey, supabaseConfig.options)
  return client
}
