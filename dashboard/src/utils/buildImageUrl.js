export function buildImageUrl(bucket, path) {
  if (!bucket || !path) return ''
  // TODO: implement full URL builder with Supabase public URL
  return `/storage/${bucket}/${path}`
}

export function getImageDimensions(url) {
  // TODO: implement or use a library
  return null
}

export function isExternalUrl(url) {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}
