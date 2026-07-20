export const STORAGE_BUCKETS = {
  PROJECTS: 'projects',
  BLOGS: 'blogs',
  TEAM: 'team',
  PARTNERS: 'partners',
  AVATARS: 'avatars',
  SETTINGS: 'settings'
}

export const STORAGE_PATHS = {
  PROJECT_THUMBNAILS: 'thumbnails',
  PROJECT_IMAGES: 'images',
  BLOG_COVERS: 'covers',
  TEAM_AVATARS: 'avatars',
  PARTNER_LOGOS: 'logos',
  SETTINGS_LOGOS: 'logos',
  SETTINGS_FAVICONS: 'favicons',
  SETTINGS_OG: 'og-images'
}

export const STORAGE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_WIDTH: 3840,
  MAX_IMAGE_HEIGHT: 2160,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg']
}
