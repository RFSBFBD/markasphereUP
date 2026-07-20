import { defineStore } from 'pinia'
import { settingsService } from '../services/settingsService'
import {
  SETTINGS_FIELDS,
  MEDIA_KEYS,
  defaultSettings,
  validateSettings,
} from '../utils/helpers'

function clone(row) {
  return JSON.parse(JSON.stringify(row))
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    loading: false,
    settings: null,
    form: null,
    dirty: false,
    errors: {},
    savedAt: null,
  }),
  actions: {
    async loadSettings() {
      this.loading = true
      try {
        const row = await settingsService.get()
        this.settings = row
        this.form = this.toForm(row)
        this.dirty = false
        this.errors = {}
      } finally {
        this.loading = false
      }
    },

    toForm(row) {
      const f = clone(row)
      for (const m of MEDIA_KEYS) {
        const url = row[m]
        f[m] = url ? { url, name: m } : null
      }
      return f
    },

    recomputeDirty() {
      if (!this.form || !this.settings) {
        this.dirty = false
        return
      }
      this.dirty =
        JSON.stringify(this.form) !== JSON.stringify(this.toForm(this.settings))
    },

    setField(key, value) {
      if (!this.form) return
      this.form[key] = value
      this.recomputeDirty()
    },

    buildPatch() {
      const patch = {}
      for (const f of SETTINGS_FIELDS) {
        const v = this.form[f]
        patch[f] = v && String(v).trim() ? v : null
      }
      for (const m of MEDIA_KEYS) {
        patch[m] = this.form[m]?.url ?? null
      }
      return patch
    },

    validate() {
      this.errors = validateSettings(this.form || {})
      return Object.keys(this.errors).length === 0
    },

    async saveSettings() {
      if (!this.form) return false
      if (!this.validate()) return false
      this.loading = true
      try {
        const patch = this.buildPatch()
        const saved = await settingsService.update(this.form.id, patch)
        this.settings = saved
        this.form = this.toForm(saved)
        this.dirty = false
        this.errors = {}
        this.savedAt = new Date()
        return true
      } finally {
        this.loading = false
      }
    },

    resetSettings() {
      if (this.settings) {
        this.form = this.toForm(this.settings)
        this.dirty = false
        this.errors = {}
      }
    },
  },
})
