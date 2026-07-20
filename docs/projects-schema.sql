-- ============================================
-- MarkaSphere Projects Module - Supabase Schema
-- ============================================

-- 1. Project Categories
CREATE TABLE IF NOT EXISTS project_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  short_description_ar TEXT DEFAULT '',
  short_description_en TEXT DEFAULT '',
  category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
  cover_image TEXT DEFAULT '',
  thumbnail TEXT DEFAULT '',
  gradient TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  client TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  year TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  website TEXT DEFAULT '',
  behance TEXT DEFAULT '',
  challenge_ar TEXT DEFAULT '',
  challenge_en TEXT DEFAULT '',
  solution_ar TEXT DEFAULT '',
  solution_en TEXT DEFAULT '',
  services JSONB DEFAULT '[]',
  technologies JSONB DEFAULT '[]',
  project_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]',
  links JSONB DEFAULT '[]',
  videos JSONB DEFAULT '[]',
  process JSONB DEFAULT '[]',
  results JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  seo_keywords TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  canonical TEXT DEFAULT '',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- 3. Project Gallery (separate table for better media management)
CREATE TABLE IF NOT EXISTS project_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_display ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(year);
CREATE INDEX IF NOT EXISTS idx_gallery_project ON project_gallery(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_sort ON project_gallery(sort_order);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_published_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

-- Public read access for published projects (excluding soft-deleted)
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (published = true AND deleted_at IS NULL);

-- Public read access for all published projects
CREATE POLICY "Public can view all published projects"
  ON projects FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

-- Authenticated full access
CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories"
  ON project_categories FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage gallery"
  ON project_gallery FOR ALL
  USING (auth.role() = 'authenticated');

-- Storage Bucket (run in Supabase Dashboard)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('project-images', 'project-images', true);
