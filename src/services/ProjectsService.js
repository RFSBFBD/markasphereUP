import { ProjectsRepository } from '@/repositories/ProjectsRepository'

export const ProjectsService = {
  async getProjects() {
    return ProjectsRepository.getProjects()
  },

  async getProject(id) {
    return ProjectsRepository.getProject(id)
  },

  async createProject(project) {
    return ProjectsRepository.createProject(project)
  },

  async updateProject(id, updates) {
    return ProjectsRepository.updateProject(id, updates)
  },

  async deleteProject(id) {
    return ProjectsRepository.deleteProject(id)
  },

  async toggleFeatured(id) {
    return ProjectsRepository.toggleFeatured(id)
  },

  async updateStatus(id, status) {
    return ProjectsRepository.updateStatus(id, status)
  }
}
