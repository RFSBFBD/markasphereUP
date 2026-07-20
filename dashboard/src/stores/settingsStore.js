import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null,
    loading: false,
    saving: false,
    error: null
  }),
  getters: {
    siteName: (state) => state.settings?.site_name || '',
    contactEmail: (state) => state.settings?.contact_email || '',
    isMaintenanceMode: (state) => state.settings?.maintenance_mode || false
  },
  actions: {
    fetchSettings() {},
    updateSettings(data) {},
    resetSettings(key) {},
    clearError() {}
  }
})
