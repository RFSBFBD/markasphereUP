import { defineStore } from 'pinia'
import { teamService } from '@/dashboard/modules/team/services/teamService'

function buildRow(form) {
  return {
    name_ar: form.name_ar?.trim() || null,
    name_en: form.name_en?.trim() || null,
    position_ar: form.position_ar?.trim() || null,
    position_en: form.position_en?.trim() || null,
    bio_ar: form.bio_ar || null,
    bio_en: form.bio_en || null,
    photo: (form.photo && form.photo.url) || (typeof form.photo === 'string' ? form.photo : null),
    linkedin: form.social?.linkedin?.trim() || null,
    github: form.social?.github?.trim() || null,
    behance: form.social?.behance?.trim() || null,
    x: form.social?.x?.trim() || null,
    email: form.email?.trim() || null,
    phone: form.phone?.trim() || null,
    display_order: Number(form.display_order) || 0,
    published: !!form.published,
  }
}

export const useTeamStore = defineStore('team', {
  state: () => ({
    loading: false,
    members: [],
    currentMember: null,
    pagination: { page: 1, perPage: 10, total: 0, pages: 1 },
    filters: { search: '', published: null },
    selectedMembers: [],
  }),
  actions: {
    setFilters(patch) {
      this.filters = { ...this.filters, ...patch }
      this.pagination.page = 1
    },
    setPage(page) {
      this.pagination.page = page
    },
    async loadMembers() {
      this.loading = true
      try {
        const res = await teamService.getAll({
          page: this.pagination.page,
          perPage: this.pagination.perPage,
          filters: this.filters,
        })
        this.members = res.data
        this.pagination = { ...this.pagination, total: res.total, pages: res.pages }
      } finally {
        this.loading = false
      }
    },
    async loadMember(id) {
      this.loading = true
      try {
        this.currentMember = await teamService.getById(id)
        return this.currentMember
      } finally {
        this.loading = false
      }
    },
    resetCurrent() {
      this.currentMember = null
    },
    async createMember(form) {
      return teamService.create(buildRow(form))
    },
    async updateMember(id, form) {
      const updated = await teamService.update(id, buildRow(form))
      this.syncMember(id, updated)
      return updated
    },
    async deleteMember(id) {
      await teamService.delete(id)
      this.members = this.members.filter((m) => m.id !== id)
      this.selectedMembers = this.selectedMembers.filter((x) => x !== id)
    },
    async setPublished(id, value) {
      const updated = await teamService.update(id, { published: value })
      this.syncMember(id, updated)
      return updated
    },
    publishMember(id) {
      return this.setPublished(id, true)
    },
    unpublishMember(id) {
      return this.setPublished(id, false)
    },
    async reorderMembers(orderedIds) {
      await teamService.reorder(orderedIds)
    },
    syncMember(id, updated) {
      const i = this.members.findIndex((m) => m.id === id)
      if (i > -1) this.members[i] = { ...this.members[i], ...updated }
      if (this.currentMember?.id === id) {
        this.currentMember = { ...this.currentMember, ...updated }
      }
    },
  },
})
