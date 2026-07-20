export const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'github', label: 'GitHub' },
  { key: 'behance', label: 'Behance' },
  { key: 'x', label: 'X' },
]

export function isValidEmail(v) {
  if (!v) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function isValidUrl(v) {
  if (!v) return true
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function initials(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}
