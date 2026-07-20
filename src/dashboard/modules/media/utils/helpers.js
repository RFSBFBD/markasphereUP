export const BUCKET = 'media'

export const MEDIA_FOLDERS = [
  { value: 'projects', label: 'المشاريع' },
  { value: 'blog', label: 'المدونة' },
  { value: 'team', label: 'الفريق' },
  { value: 'settings', label: 'الإعدادات' },
]

export const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif', 'image/heic', 'image/heif']
export const ACCEPTED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'heic', 'heif']
export const MAX_BYTES = 25 * 1024 * 1024
export const MAX_DIMENSION = 2000
export const QUALITY = 0.88

export function folderLabel(value) {
  const f = MEDIA_FOLDERS.find((x) => x.value === value)
  return f ? f.label : value || '—'
}

function normalizeExtension(file) {
  const name = (file?.name || '').toLowerCase()
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot + 1)
}

export function isImageFile(file) {
  if (!file) return false
  const type = (file.type || '').toLowerCase()
  const ext = normalizeExtension(file)
  if (type.startsWith('image/')) return true
  return ACCEPTED_EXT.includes(ext)
}

export function validateFile(file) {
  if (!file) return 'لم يتم اختيار ملف'
  if (!isImageFile(file)) return 'الملف غير صورة أو الصيغة غير مدعومة'
  return null
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—'
  if (bytes === 0) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function dimensions(img) {
  if (!img || !img.width || !img.height) return '—'
  return `${img.width} × ${img.height}`
}

export function pathFromUrl(url) {
  if (!url || typeof url !== 'string') return null
  const marker = `/object/public/${BUCKET}/`
  const i = url.indexOf(marker)
  return i === -1 ? null : url.slice(i + marker.length)
}

export function getImageSize(file) {
  return new Promise((resolve) => {
    if (!isImageFile(file) || (file.type || '').toLowerCase() === 'image/svg+xml') {
      resolve(null)
      return
    }
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      resolve(null)
    }
    img.src = URL.createObjectURL(file)
  })
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('تعذر تحويل الصورة إلى ملف محسّن'))
      }, mimeType, quality)
      return
    }
    try {
      const dataUrl = canvas.toDataURL(mimeType, quality)
      const parts = dataUrl.split(',')
      const base64 = parts[1] || ''
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
      resolve(new Blob([bytes], { type: mimeType }))
    } catch (error) {
      reject(error)
    }
  })
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('تعذر قراءة الملف كصورة'))
    }
    img.src = url
  })
}

export async function optimizeImageFile(file, options = {}) {
  if (!isImageFile(file)) throw new Error('الملف غير صورة أو الصيغة غير مدعومة')

  const ext = normalizeExtension(file).toLowerCase()
  const isSvg = ext === 'svg' || (file.type || '').toLowerCase() === 'image/svg+xml'
  if (isSvg) {
    return {
      file,
      width: null,
      height: null,
      mime: file.type || 'image/svg+xml',
      thumbnailFile: null,
    }
  }

  const img = await loadImage(file)
  const width = img.naturalWidth || img.width || 0
  const height = img.naturalHeight || img.height || 0
  const maxDimension = options.maxDimension || MAX_DIMENSION
  let targetWidth = width
  let targetHeight = height
  const scale = Math.min(1, maxDimension / Math.max(width, height, 1))
  if (width > maxDimension || height > maxDimension) {
    targetWidth = Math.max(1, Math.round(width * scale))
    targetHeight = Math.max(1, Math.round(height * scale))
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('تعذر تجهيز الصورة للرفع')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(img, 0, 0, targetWidth, targetHeight)

  const mimeType = typeof HTMLCanvasElement !== 'undefined' && canvas.toDataURL ? 'image/webp' : 'image/jpeg'
  const outputType = mimeType === 'image/webp' && typeof HTMLCanvasElement !== 'undefined' ? 'image/webp' : 'image/jpeg'
  const blob = await canvasToBlob(canvas, outputType, options.quality || QUALITY)
  const safeName = (file.name || 'image').replace(/\.[^/.]+$/, '') || 'image'
  const optimizedFile = new File([blob], `${safeName}.${outputType === 'image/webp' ? 'webp' : 'jpg'}`, {
    type: outputType,
    lastModified: Date.now(),
  })

  let thumbnailFile = null
  const thumbWidth = Math.min(320, targetWidth || 320)
  const thumbHeight = Math.min(320, targetHeight || 320)
  if (thumbWidth > 0 && thumbHeight > 0) {
    const thumbCanvas = document.createElement('canvas')
    thumbCanvas.width = thumbWidth
    thumbCanvas.height = thumbHeight
    const thumbContext = thumbCanvas.getContext('2d')
    if (thumbContext) {
      thumbContext.imageSmoothingEnabled = true
      thumbContext.imageSmoothingQuality = 'high'
      thumbContext.drawImage(img, 0, 0, thumbWidth, thumbHeight)
      const thumbBlob = await canvasToBlob(thumbCanvas, outputType, 0.82)
      thumbnailFile = new File([thumbBlob], `${safeName}-thumb.${outputType === 'image/webp' ? 'webp' : 'jpg'}`, {
        type: outputType,
        lastModified: Date.now(),
      })
    }
  }

  return {
    file: optimizedFile,
    width: targetWidth,
    height: targetHeight,
    mime: outputType,
    thumbnailFile,
  }
}
