export interface Media {
  id: string
  url: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  width?: number
  height?: number
  alt?: string
  bucket: string
  path: string
  uploaded_by?: string
  created_at: string
  updated_at: string
}

export interface MediaUploadOptions {
  bucket: string
  path?: string
  maxSizeMB?: number
  allowedExtensions?: string[]
  compress?: boolean
  quality?: number
}
