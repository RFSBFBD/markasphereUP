import { defineStore } from 'pinia'
import { contactMessageService } from '@/dashboard/modules/inbox/services/contactMessageService'

export const useInboxStore = defineStore('inbox', {
  state: () => ({
    loading: false,
    messages: [],
    pagination: { page: 1, perPage: 12, total: 0, pages: 1 },
    filters: { search: '', status: '' },
    stats: { total: 0, unread: 0, archived: 0, today: 0 },
  }),
  actions: {
    setFilters(patch) {
      this.filters = { ...this.filters, ...patch }
      this.pagination.page = 1
    },
    setPage(page) {
      this.pagination.page = page
    },
    async loadMessages() {
      this.loading = true
      try {
        const res = await contactMessageService.list({
          page: this.pagination.page,
          perPage: this.pagination.perPage,
          search: this.filters.search,
          status: this.filters.status,
        })
        this.messages = res.data
        this.pagination = { ...this.pagination, total: res.total, pages: res.pages }
      } finally {
        this.loading = false
      }
    },
    async loadStats() {
      try {
        this.stats = await contactMessageService.stats()
      } catch {
        /* keep previous stats on failure */
      }
    },
    async refresh() {
      await Promise.all([this.loadMessages(), this.loadStats()])
    },
    async setStatus(id, status) {
      const updated = await contactMessageService.updateStatus(id, status)
      const i = this.messages.findIndex((m) => m.id === id)
      if (i > -1) this.messages[i] = { ...this.messages[i], ...updated }
      await this.loadStats()
      return updated
    },
    markRead(id) {
      return this.setStatus(id, 'Read')
    },
    markUnread(id) {
      return this.setStatus(id, 'Unread')
    },
    archive(id) {
      return this.setStatus(id, 'Archived')
    },
    async remove(id) {
      await contactMessageService.remove(id)
      this.messages = this.messages.filter((m) => m.id !== id)
      await this.loadStats()
    },
  },
})
