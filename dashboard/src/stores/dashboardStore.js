import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    recentProjects: [],
    recentBlogs: [],
    activityLog: [],
    systemHealth: null,
    loading: false,
    error: null
  }),
  getters: {
    isLoading: (state) => state.loading,
    hasStats: (state) => !!state.stats
  },
  actions: {
    fetchStats() {},
    fetchRecentProjects() {},
    fetchRecentBlogs() {},
    fetchActivityLog() {},
    fetchSystemHealth() {},
    clearDashboard() {}
  }
})
