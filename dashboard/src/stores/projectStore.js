import { defineStore } from 'pinia'

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    categories: [],
    total: 0,
    loading: false,
    error: null
  }),
  getters: {
    publishedProjects: (state) => state.projects.filter(p => p.status === 'published'),
    draftProjects: (state) => state.projects.filter(p => p.status === 'draft'),
    projectById: (state) => (id) => state.projects.find(p => p.id === id)
  },
  actions: {
    fetchProjects(params) {},
    fetchProject(id) {},
    fetchProjectBySlug(slug) {},
    createProject(data) {},
    updateProject(id, data) {},
    deleteProject(id) {},
    fetchCategories() {},
    createCategory(data) {},
    updateCategory(id, data) {},
    deleteCategory(id) {},
    reorderProjects(ids) {},
    toggleFeatured(id) {}
  }
})
