export function normalizeProject(project) {
  if (!project) return null
  return {
    ...project,
    tags: project.tags || [],
    technologies: project.technologies || [],
    images: project.images || []
  }
}

export function normalizeBlog(blog) {
  if (!blog) return null
  return {
    ...blog,
    tags: blog.tags || [],
    reading_time: blog.reading_time || estimateReadingTime(blog.content)
  }
}

export function estimateReadingTime(content) {
  if (!content) return 1
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function normalizeTeamMember(member) {
  if (!member) return null
  return {
    ...member,
    social_links: member.social_links || {},
    active: member.active ?? true
  }
}

export function normalizePartner(partner) {
  if (!partner) return null
  return {
    ...partner,
    active: partner.active ?? true
  }
}
