import { defineStore } from 'pinia'

export const usePartnerStore = defineStore('partners', {
  state: () => ({
    partners: [],
    loading: false,
    error: null
  }),
  getters: {
    activePartners: (state) => state.partners.filter(p => p.active),
    partnerById: (state) => (id) => state.partners.find(p => p.id === id)
  },
  actions: {
    fetchPartners() {},
    fetchPartner(id) {},
    createPartner(data) {},
    updatePartner(id, data) {},
    deletePartner(id) {},
    reorderPartners(ids) {}
  }
})
