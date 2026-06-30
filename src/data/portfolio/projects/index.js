import { categories } from '../categories'
import { projects } from '@/data/projects'

export { projects }
export {
  featuredProjects,
  getProjectBySlug,
  getProjectsByCategory
} from '@/data/projects'

export {
  getProjectBySlug as getProjectBySlugAsync,
  getAllProjects,
  getFeaturedProjects as getFeaturedProjectsAsync,
  getProjectsByCategory as getProjectsByCategoryAsync,
  preloadProjects
} from '@/data/projects/loader'

export const getCategoryById = (id) => {
  return categories.find(c => c.id === id)
}
