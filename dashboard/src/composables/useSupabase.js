import { getSupabaseClient } from '@/services/supabase'

export function useSupabase() {
  const client = getSupabaseClient()

  function isReady() {
    return client !== null
  }

  function getClient() {
    return client
  }

  return {
    client,
    isReady,
    getClient
  }
}
