export const PERMISSIONS = {
  MANAGE_PROJECTS: 'manage_projects',
  MANAGE_BLOG: 'manage_blog',
  MANAGE_TEAM: 'manage_team',
  MANAGE_PARTNERS: 'manage_partners',
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_MEDIA: 'manage_media',
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data'
}

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  editor: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.MANAGE_BLOG,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.MANAGE_MEDIA,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  viewer: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS
  ]
}

export function hasPermission(userPermissions, requiredPermission) {
  if (!userPermissions) return false
  return userPermissions.includes(PERMISSIONS.MANAGE_USERS) || userPermissions.includes(requiredPermission)
}

export function can(userPermissions, permission) {
  return hasPermission(userPermissions, permission)
}
