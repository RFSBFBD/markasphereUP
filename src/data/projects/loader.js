const projectGlob = import.meta.glob('./*.js', { eager: false })

const projectModules = {}
for (const [path, loader] of Object.entries(projectGlob)) {
  const name = path.replace('./', '').replace('.js', '')
  if (name === 'index' || name === 'loader') continue
  projectModules[name] = loader
}

const DEFAULTS = {
  id: 0,
  slug: '',
  titleAr: '',
  titleEn: '',
  category: '',
  cover: '',
  gradient: '',
  gallery: [],
  descriptionAr: '',
  descriptionEn: '',
  services: [],
  year: '',
  thumbnail: '',
  client: '',
  industry: '',
  duration: '',
  website: '',
  behance: '',
  results: [],
  process: [],
  challengeAr: '',
  challengeEn: '',
  solutionAr: '',
  solutionEn: '',
  featured: false,
  links: [],
  videos: [],
  metadata: {}
}

const cache = new Map()

function applyDefaults(raw) {
  return Object.keys(DEFAULTS).reduce((acc, key) => {
    acc[key] = key in raw ? raw[key] : DEFAULTS[key]
    return acc
  }, {})
}

export async function getProjectBySlug(slug) {
  if (cache.has(slug)) return cache.get(slug)
  const loader = projectModules[slug]
  if (!loader) return null
  const mod = await loader()
  const project = applyDefaults(mod.default || mod)
  cache.set(slug, project)
  return project
}

async function loadAll() {
  const entries = await Promise.all(
    Object.keys(projectModules).map(getProjectBySlug)
  )
  return entries.filter(Boolean)
}

export async function getAllProjects() {
  return loadAll()
}

export async function getFeaturedProjects() {
  const all = await loadAll()
  return all.filter(p => p.featured)
}

export async function getProjectsByCategory(categoryId) {
  const all = await loadAll()
  if (!categoryId || categoryId === 'all') return all
  return all.filter(p => p.category === categoryId)
}

export async function preloadProjects() {
  return loadAll()
}
