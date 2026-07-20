-- Enterprise Team Management Schema
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- DEPARTMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '#667eea',
  sort_order INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_departments_slug ON departments(slug);
CREATE INDEX idx_departments_deleted_at ON departments(deleted_at);

-- ============================================
-- TEAM MEMBERS
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  job_title TEXT DEFAULT '',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  bio TEXT DEFAULT '',
  short_bio TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  cover TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  location TEXT DEFAULT '',
  website TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  github TEXT DEFAULT '',
  behance TEXT DEFAULT '',
  dribbble TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  skills JSONB DEFAULT '[]',
  years_of_experience INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  joined_at DATE,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  canonical TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_team_members_slug ON team_members(slug);
CREATE INDEX idx_team_members_department ON team_members(department_id);
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_members_featured ON team_members(featured);
CREATE INDEX idx_team_members_sort ON team_members(sort_order);
CREATE INDEX idx_team_members_deleted_at ON team_members(deleted_at);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_departments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_departments_updated_at();

CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_members_updated_at();

-- Update department member count
CREATE OR REPLACE FUNCTION update_department_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.department_id IS NOT NULL THEN
    UPDATE departments SET member_count = member_count + 1 WHERE id = NEW.department_id;
  ELSIF TG_OP = 'DELETE' AND OLD.department_id IS NOT NULL THEN
    UPDATE departments SET member_count = member_count - 1 WHERE id = OLD.department_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.department_id IS DISTINCT FROM NEW.department_id THEN
      IF OLD.department_id IS NOT NULL THEN
        UPDATE departments SET member_count = member_count - 1 WHERE id = OLD.department_id;
      END IF;
      IF NEW.department_id IS NOT NULL THEN
        UPDATE departments SET member_count = member_count + 1 WHERE id = NEW.department_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_department_member_count
  AFTER INSERT OR UPDATE OR DELETE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_department_member_count();

-- ============================================
-- SEED: Default Departments
-- ============================================
INSERT INTO departments (name, slug, description, icon, sort_order) VALUES
  ('Engineering', 'engineering', 'Software development and technical teams', '&#128187;', 0),
  ('Design', 'design', 'UI/UX and visual design teams', '&#127912;', 1),
  ('Marketing', 'marketing', 'Marketing and growth teams', '&#128200;', 2),
  ('Sales', 'sales', 'Business development and sales teams', '&#128176;', 3),
  ('Operations', 'operations', 'Business operations and logistics', '&#9881;', 4),
  ('Human Resources', 'human-resources', 'People and culture teams', '&#128101;', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read departments" ON departments
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Authenticated can manage departments" ON departments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read team members" ON team_members
  FOR SELECT USING (deleted_at IS NULL AND status = 'published');

CREATE POLICY "Authenticated can manage team members" ON team_members
  FOR ALL USING (auth.role() = 'authenticated');
