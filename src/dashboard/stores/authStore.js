import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false,
  }),
  actions: {
    setUser(user) {
      this.user = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email,
        avatar: user.user_metadata?.avatar_url || ''
      }
      this.isAuthenticated = true
    },
    clearUser() {
      this.user = null
      this.isAuthenticated = false
    },
    async init() {
      if (this.initialized) return
      this.loading = true
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) this.setUser(data.session.user)
      } catch {
        // ignore — stay unauthenticated
      } finally {
        this.loading = false
        this.initialized = true
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) this.setUser(session.user)
        else this.clearUser()
      })
    },
    async login(email, password) {
      this.loading = true
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.session?.user) this.setUser(data.session.user)
        return data
      } finally {
        this.loading = false
      }
    },
    async refreshSession() {
      await this.init()
    },
    async logout() {
      await supabase.auth.signOut()
      this.clearUser()
    }
  }
})
