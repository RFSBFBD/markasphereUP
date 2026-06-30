import novaCapital from './nova-capital'
import elevateGroup from './elevate-group'
import atlasMedical from './atlas-medical'
import bloomCafe from './bloom-cafe'
import nextgenTech from './nextgen-tech'
import zenith from './zenith'
import urbanEstate from './urban-estate'
import eliteFitness from './elite-fitness'
import horizonHoldings from './horizon-holdings'
import vertexSolutions from './vertex-solutions'
import impactStory from './impact-story'
import momentum from './momentum'
import primeLogistics from './prime-logistics'
import orionTechnologies from './orion-technologies'

export const projects = [
  novaCapital,
  elevateGroup,
  atlasMedical,
  bloomCafe,
  nextgenTech,
  zenith,
  urbanEstate,
  eliteFitness,
  horizonHoldings,
  vertexSolutions,
  impactStory,
  momentum,
  primeLogistics,
  orionTechnologies
]

export const featuredProjects = projects.filter(p => p.featured)

export const getProjectBySlug = (slug) => {
  return projects.find(p => p.slug === slug) || null
}

export const getProjectsByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') return projects
  return projects.filter(p => p.category === categoryId)
}
