import { getSupabaseClient } from './supabaseClient'

export const authService = {
  signUp(credentials) {
    const client = getSupabaseClient()
    // TODO: implement sign up
  },

  signIn(credentials) {
    const client = getSupabaseClient()
    // TODO: implement sign in
  },

  signOut() {
    const client = getSupabaseClient()
    // TODO: implement sign out
  },

  getSession() {
    const client = getSupabaseClient()
    // TODO: implement get session
  },

  onAuthChange(callback) {
    const client = getSupabaseClient()
    // TODO: implement on auth state change
  },

  resetPassword(email) {
    const client = getSupabaseClient()
    // TODO: implement password reset
  },

  updatePassword(password) {
    const client = getSupabaseClient()
    // TODO: implement update password
  },

  getUser() {
    const client = getSupabaseClient()
    // TODO: implement get current user
  }
}
