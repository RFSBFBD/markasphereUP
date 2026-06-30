const BREAKPOINTS = [480, 768, 1024, 1440, 1920]

function hasCloudinary(url) {
  return url && url.includes('/upload/')
}

export function optimizeUrl(url, opts = {}) {
  if (!hasCloudinary(url)) return url

  const parts = ['f_auto', 'q_auto']
  if (opts.width) parts.push(`w_${opts.width}`)
  if (opts.height) parts.push(`h_${opts.height}`)
  if (opts.crop) parts.push(`c_${opts.crop}`)
  if (opts.blur) parts.push(`e_blur:${opts.blur}`)

  return url.replace('/upload/', `/upload/${parts.join(',')}/`)
}

export function srcset(url, widths = BREAKPOINTS) {
  if (!hasCloudinary(url)) return ''
  return widths
    .map(w => `${optimizeUrl(url, { width: w, crop: 'limit' })} ${w}w`)
    .join(', ')
}

export function blurUrl(url) {
  return optimizeUrl(url, { width: 20, blur: 1000, quality: 1 })
}

export function isCloudinary(url) {
  return hasCloudinary(url) && url.includes('res.cloudinary.com')
}
