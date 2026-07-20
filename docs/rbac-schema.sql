-- Enterprise RBAC Schema
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_roles_slug ON roles(slug);

-- ============================================
-- PERMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module, action)
);

CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_slug ON permissions(slug);

-- ============================================
-- ROLE_PERMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- ============================================
-- USER_ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_roles_updated_at();

-- ============================================
-- SEED: Default Roles
-- ============================================
INSERT INTO roles (name, slug, description, is_system) VALUES
  ('Super Admin', 'super_admin', 'Full system access with all permissions', true),
  ('Admin', 'admin', 'Administrative access with most permissions', true),
  ('Editor', 'editor', 'Can edit and publish content', true),
  ('Author', 'author', 'Can create and edit own content', true),
  ('Marketing', 'marketing', 'Marketing team access', true),
  ('Viewer', 'viewer', 'Read-only access to dashboard', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: Permissions (16 modules × 10 actions)
-- ============================================
INSERT INTO permissions (name, slug, module, action) VALUES
  -- Dashboard
  ('Dashboard View', 'dashboard.view', 'dashboard', 'view'),
  ('Dashboard Manage', 'dashboard.manage', 'dashboard', 'manage'),
  -- Projects
  ('Projects View', 'projects.view', 'projects', 'view'),
  ('Projects Create', 'projects.create', 'projects', 'create'),
  ('Projects Edit', 'projects.edit', 'projects', 'edit'),
  ('Projects Delete', 'projects.delete', 'projects', 'delete'),
  ('Projects Publish', 'projects.publish', 'projects', 'publish'),
  ('Projects Restore', 'projects.restore', 'projects', 'restore'),
  ('Projects Export', 'projects.export', 'projects', 'export'),
  ('Projects Import', 'projects.import', 'projects', 'import'),
  ('Projects Manage', 'projects.manage', 'projects', 'manage'),
  -- Blog
  ('Blog View', 'blog.view', 'blog', 'view'),
  ('Blog Create', 'blog.create', 'blog', 'create'),
  ('Blog Edit', 'blog.edit', 'blog', 'edit'),
  ('Blog Delete', 'blog.delete', 'blog', 'delete'),
  ('Blog Publish', 'blog.publish', 'blog', 'publish'),
  ('Blog Restore', 'blog.restore', 'blog', 'restore'),
  ('Blog Export', 'blog.export', 'blog', 'export'),
  ('Blog Import', 'blog.import', 'blog', 'import'),
  ('Blog Manage', 'blog.manage', 'blog', 'manage'),
  -- Media
  ('Media View', 'media.view', 'media', 'view'),
  ('Media Create', 'media.create', 'media', 'create'),
  ('Media Edit', 'media.edit', 'media', 'edit'),
  ('Media Delete', 'media.delete', 'media', 'delete'),
  ('Media Publish', 'media.publish', 'media', 'publish'),
  ('Media Restore', 'media.restore', 'media', 'restore'),
  ('Media Export', 'media.export', 'media', 'export'),
  ('Media Import', 'media.import', 'media', 'import'),
  ('Media Manage', 'media.manage', 'media', 'manage'),
  -- Settings
  ('Settings View', 'settings.view', 'settings', 'view'),
  ('Settings Create', 'settings.create', 'settings', 'create'),
  ('Settings Edit', 'settings.edit', 'settings', 'edit'),
  ('Settings Delete', 'settings.delete', 'settings', 'delete'),
  ('Settings Publish', 'settings.publish', 'settings', 'publish'),
  ('Settings Restore', 'settings.restore', 'settings', 'restore'),
  ('Settings Export', 'settings.export', 'settings', 'export'),
  ('Settings Import', 'settings.import', 'settings', 'import'),
  ('Settings Manage', 'settings.manage', 'settings', 'manage'),
  -- Users
  ('Users View', 'users.view', 'users', 'view'),
  ('Users Create', 'users.create', 'users', 'create'),
  ('Users Edit', 'users.edit', 'users', 'edit'),
  ('Users Delete', 'users.delete', 'users', 'delete'),
  ('Users Publish', 'users.publish', 'users', 'publish'),
  ('Users Restore', 'users.restore', 'users', 'restore'),
  ('Users Export', 'users.export', 'users', 'export'),
  ('Users Import', 'users.import', 'users', 'import'),
  ('Users Manage', 'users.manage', 'users', 'manage'),
  -- Roles
  ('Roles View', 'roles.view', 'roles', 'view'),
  ('Roles Create', 'roles.create', 'roles', 'create'),
  ('Roles Edit', 'roles.edit', 'roles', 'edit'),
  ('Roles Delete', 'roles.delete', 'roles', 'delete'),
  ('Roles Publish', 'roles.publish', 'roles', 'publish'),
  ('Roles Restore', 'roles.restore', 'roles', 'restore'),
  ('Roles Export', 'roles.export', 'roles', 'export'),
  ('Roles Import', 'roles.import', 'roles', 'import'),
  ('Roles Manage', 'roles.manage', 'roles', 'manage'),
  -- Analytics
  ('Analytics View', 'analytics.view', 'analytics', 'view'),
  ('Analytics Create', 'analytics.create', 'analytics', 'create'),
  ('Analytics Edit', 'analytics.edit', 'analytics', 'edit'),
  ('Analytics Delete', 'analytics.delete', 'analytics', 'delete'),
  ('Analytics Publish', 'analytics.publish', 'analytics', 'publish'),
  ('Analytics Restore', 'analytics.restore', 'analytics', 'restore'),
  ('Analytics Export', 'analytics.export', 'analytics', 'export'),
  ('Analytics Import', 'analytics.import', 'analytics', 'import'),
  ('Analytics Manage', 'analytics.manage', 'analytics', 'manage'),
  -- Team
  ('Team View', 'team.view', 'team', 'view'),
  ('Team Create', 'team.create', 'team', 'create'),
  ('Team Edit', 'team.edit', 'team', 'edit'),
  ('Team Delete', 'team.delete', 'team', 'delete'),
  ('Team Publish', 'team.publish', 'team', 'publish'),
  ('Team Restore', 'team.restore', 'team', 'restore'),
  ('Team Export', 'team.export', 'team', 'export'),
  ('Team Import', 'team.import', 'team', 'import'),
  ('Team Manage', 'team.manage', 'team', 'manage'),
  -- Partners
  ('Partners View', 'partners.view', 'partners', 'view'),
  ('Partners Create', 'partners.create', 'partners', 'create'),
  ('Partners Edit', 'partners.edit', 'partners', 'edit'),
  ('Partners Delete', 'partners.delete', 'partners', 'delete'),
  ('Partners Publish', 'partners.publish', 'partners', 'publish'),
  ('Partners Restore', 'partners.restore', 'partners', 'restore'),
  ('Partners Export', 'partners.export', 'partners', 'export'),
  ('Partners Import', 'partners.import', 'partners', 'import'),
  ('Partners Manage', 'partners.manage', 'partners', 'manage'),
  -- Testimonials
  ('Testimonials View', 'testimonials.view', 'testimonials', 'view'),
  ('Testimonials Create', 'testimonials.create', 'testimonials', 'create'),
  ('Testimonials Edit', 'testimonials.edit', 'testimonials', 'edit'),
  ('Testimonials Delete', 'testimonials.delete', 'testimonials', 'delete'),
  ('Testimonials Publish', 'testimonials.publish', 'testimonials', 'publish'),
  ('Testimonials Restore', 'testimonials.restore', 'testimonials', 'restore'),
  ('Testimonials Export', 'testimonials.export', 'testimonials', 'export'),
  ('Testimonials Import', 'testimonials.import', 'testimonials', 'import'),
  ('Testimonials Manage', 'testimonials.manage', 'testimonials', 'manage'),
  -- FAQ
  ('FAQ View', 'faq.view', 'faq', 'view'),
  ('FAQ Create', 'faq.create', 'faq', 'create'),
  ('FAQ Edit', 'faq.edit', 'faq', 'edit'),
  ('FAQ Delete', 'faq.delete', 'faq', 'delete'),
  ('FAQ Publish', 'faq.publish', 'faq', 'publish'),
  ('FAQ Restore', 'faq.restore', 'faq', 'restore'),
  ('FAQ Export', 'faq.export', 'faq', 'export'),
  ('FAQ Import', 'faq.import', 'faq', 'import'),
  ('FAQ Manage', 'faq.manage', 'faq', 'manage'),
  -- Leads
  ('Leads View', 'leads.view', 'leads', 'view'),
  ('Leads Create', 'leads.create', 'leads', 'create'),
  ('Leads Edit', 'leads.edit', 'leads', 'edit'),
  ('Leads Delete', 'leads.delete', 'leads', 'delete'),
  ('Leads Publish', 'leads.publish', 'leads', 'publish'),
  ('Leads Restore', 'leads.restore', 'leads', 'restore'),
  ('Leads Export', 'leads.export', 'leads', 'export'),
  ('Leads Import', 'leads.import', 'leads', 'import'),
  ('Leads Manage', 'leads.manage', 'leads', 'manage'),
  -- Logs
  ('Logs View', 'logs.view', 'logs', 'view'),
  ('Logs Create', 'logs.create', 'logs', 'create'),
  ('Logs Edit', 'logs.edit', 'logs', 'edit'),
  ('Logs Delete', 'logs.delete', 'logs', 'delete'),
  ('Logs Publish', 'logs.publish', 'logs', 'publish'),
  ('Logs Restore', 'logs.restore', 'logs', 'restore'),
  ('Logs Export', 'logs.export', 'logs', 'export'),
  ('Logs Import', 'logs.import', 'logs', 'import'),
  ('Logs Manage', 'logs.manage', 'logs', 'manage'),
  -- Backup
  ('Backup View', 'backup.view', 'backup', 'view'),
  ('Backup Create', 'backup.create', 'backup', 'create'),
  ('Backup Edit', 'backup.edit', 'backup', 'edit'),
  ('Backup Delete', 'backup.delete', 'backup', 'delete'),
  ('Backup Publish', 'backup.publish', 'backup', 'publish'),
  ('Backup Restore', 'backup.restore', 'backup', 'restore'),
  ('Backup Export', 'backup.export', 'backup', 'export'),
  ('Backup Import', 'backup.import', 'backup', 'import'),
  ('Backup Manage', 'backup.manage', 'backup', 'manage'),
  -- System
  ('System View', 'system.view', 'system', 'view'),
  ('System Create', 'system.create', 'system', 'create'),
  ('System Edit', 'system.edit', 'system', 'edit'),
  ('System Delete', 'system.delete', 'system', 'delete'),
  ('System Publish', 'system.publish', 'system', 'publish'),
  ('System Restore', 'system.restore', 'system', 'restore'),
  ('System Export', 'system.export', 'system', 'export'),
  ('System Import', 'system.import', 'system', 'import'),
  ('System Manage', 'system.manage', 'system', 'manage')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: Default Role-Permission Mappings
-- ============================================

-- Super Admin: ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'super_admin'
ON CONFLICT DO NOTHING;

-- Admin: All except system.manage
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'admin' AND p.slug != 'system.manage'
ON CONFLICT DO NOTHING;

-- Editor: dashboard.view, projects/view/create/edit/delete/publish/restore, blog/view/create/edit/delete/publish/restore, media/view/create/edit/delete, settings/view
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'editor' AND p.slug IN (
  'dashboard.view',
  'projects.view', 'projects.create', 'projects.edit', 'projects.delete', 'projects.publish', 'projects.restore',
  'blog.view', 'blog.create', 'blog.edit', 'blog.delete', 'blog.publish', 'blog.restore',
  'media.view', 'media.create', 'media.edit', 'media.delete',
  'settings.view',
  'team.view', 'team.edit',
  'partners.view', 'partners.edit',
  'testimonials.view', 'testimonials.edit',
  'faq.view', 'faq.edit'
)
ON CONFLICT DO NOTHING;

-- Author: dashboard.view, projects/view/create/edit, blog/view/create/edit, media/view/create, team/view, partners/view, testimonials/view, faq/view
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'author' AND p.slug IN (
  'dashboard.view',
  'projects.view', 'projects.create', 'projects.edit',
  'blog.view', 'blog.create', 'blog.edit',
  'media.view', 'media.create',
  'team.view',
  'partners.view',
  'testimonials.view',
  'faq.view'
)
ON CONFLICT DO NOTHING;

-- Marketing: dashboard.view, projects/view, blog/view/create/edit/publish, media/view/create/edit, analytics/view, team/view, partners/view, testimonials/view/create/edit, faq/view/create/edit
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'marketing' AND p.slug IN (
  'dashboard.view',
  'projects.view',
  'blog.view', 'blog.create', 'blog.edit', 'blog.publish',
  'media.view', 'media.create', 'media.edit',
  'analytics.view',
  'team.view',
  'partners.view',
  'testimonials.view', 'testimonials.create', 'testimonials.edit',
  'faq.view', 'faq.create', 'faq.edit'
)
ON CONFLICT DO NOTHING;

-- Viewer: dashboard.view only
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'viewer' AND p.slug = 'dashboard.view'
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS
-- ============================================

-- Convenience view: user permissions
CREATE OR REPLACE VIEW user_permissions_view AS
SELECT
  ur.user_id,
  p.slug AS permission_slug,
  p.module,
  p.action,
  r.slug AS role_slug
FROM user_roles ur
JOIN role_permissions rp ON rp.role_id = ur.role_id
JOIN permissions p ON p.id = rp.permission_id
JOIN roles r ON r.id = ur.role_id;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read roles" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage roles" ON roles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can read permissions" ON permissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage permissions" ON permissions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage role_permissions" ON role_permissions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage user_roles" ON user_roles
  FOR ALL USING (auth.role() = 'authenticated');
