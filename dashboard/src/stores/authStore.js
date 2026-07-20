import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.session,
    isAdmin: (state) => state.user?.role === 'admin',
    userPermissions: (state) => state.user?.permissions || []
  },
  actions: {
    login(credentials) {},
    logout() {},
    register(data) {},
    fetchUser() {},
    updateProfile(data) {},
    resetPassword(email) {},
    clearError() {}
  }
})
