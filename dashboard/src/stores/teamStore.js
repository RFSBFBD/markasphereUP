import { defineStore } from 'pinia'

export const useTeamStore = defineStore('team', {
  state: () => ({
    members: [],
    loading: false,
    error: null
  }),
  getters: {
    activeMembers: (state) => state.members.filter(m => m.active),
    memberById: (state) => (id) => state.members.find(m => m.id === id)
  },
  actions: {
    fetchMembers() {},
    fetchMember(id) {},
    createMember(data) {},
    updateMember(id, data) {},
    deleteMember(id) {},
    reorderMembers(ids) {}
  }
})
