-- ============================================================
-- Migration: 20260711160000_reconcile_app_schema
-- Purpose: bring the deployed schema in line with the columns
-- actually used by src/dashboard and the public site.
--
-- The earlier migrations (001-003) created a LEGACY placeholder
-- schema (settings, blog_posts, projects(title/image_url),
-- team_members(name/role), media(file_name/file_url)) that does
-- NOT match the application code. This migration drops those
-- legacy tables and recreates them with the correct shape,
-- adds the gallery tables, the correct RLS policies, and the
-- `projects` storage bucket.
--
-- SAFE TO RUN ON A FRESH / EMPTY DATABASE (seed.sql is empty).
-- If you already have production data in the legacy tables,
-- back it up first or convert the DROP/CREATE below into ALTERs.
-- ============================================================

-- ---------------- settings  ->  site_settings ----------------
DROP TABLE IF EXISTS settings CASCADE;

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Site names / descriptions
  site_name_ar TEXT DEFAULT '',
  site_name_en TEXT DEFAULT '',
  site_description_ar TEXT DEFAULT '',
  site_description_en TEXT DEFAULT '',

  -- Contact
  company_email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  google_maps_url TEXT DEFAULT '',
  address_ar TEXT DEFAULT '',
  address_en TEXT DEFAULT '',

  -- Hero
  hero_title_ar TEXT DEFAULT '',
  hero_title_en TEXT DEFAULT '',
  hero_description_ar TEXT DEFAULT '',
  hero_description_en TEXT DEFAULT '',
  hero_button_text TEXT DEFAULT '',
  hero_button_url TEXT DEFAULT '',

  -- SEO
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  keywords TEXT DEFAULT '',
  google_verification TEXT DEFAULT '',
  facebook_verification TEXT DEFAULT '',
  twitter_verification TEXT DEFAULT '',

  -- Socials (plain URLs, no _url suffix)
  facebook TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  behance TEXT DEFAULT '',
  dribbble TEXT DEFAULT '',
  github TEXT DEFAULT '',
  youtube TEXT DEFAULT '',
  tiktok TEXT DEFAULT '',
  x TEXT DEFAULT '',

  -- Footer
  footer_copyright TEXT DEFAULT '',
  footer_description TEXT DEFAULT '',

  -- Media assets
  logo TEXT,
  white_logo TEXT,
  favicon TEXT,
  og_image TEXT,

  -- Flexible lists consumed by the public site (PartnersSection / Section6)
  partners JSONB DEFAULT '[]'::jsonb,
  testimonials JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------- blog_posts  ->  posts ----------------
DROP TABLE IF EXISTS blog_posts CASCADE;

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT,
  title_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  excerpt_ar TEXT DEFAULT '',
  excerpt_en TEXT DEFAULT '',
  content_ar TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  category TEXT DEFAULT '',          -- string slug, NOT a foreign key
  cover_image TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------- projects ----------------
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT,
  title_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  excerpt_ar TEXT DEFAULT '',
  excerpt_en TEXT DEFAULT '',
  content_ar TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  short_description_ar TEXT DEFAULT '',
  short_description_en TEXT DEFAULT '',
  category TEXT DEFAULT '',          -- string slug, NOT a foreign key
  client TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  services JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  completion_date TEXT DEFAULT '',
  cover_image TEXT,
  thumbnail TEXT,
  gradient TEXT DEFAULT '',
  year TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  website TEXT DEFAULT '',
  behance TEXT DEFAULT '',
  challenge_ar TEXT DEFAULT '',
  challenge_en TEXT DEFAULT '',
  solution_ar TEXT DEFAULT '',
  solution_en TEXT DEFAULT '',
  project_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  links JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  process JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  seo_keywords TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  canonical TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------- team_members ----------------
DROP TABLE IF EXISTS team_members CASCADE;

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT,
  name_en TEXT,
  position_ar TEXT DEFAULT '',
  position_en TEXT DEFAULT '',
  bio_ar TEXT DEFAULT '',
  bio_en TEXT DEFAULT '',
  photo TEXT,
  linkedin TEXT DEFAULT '',
  github TEXT DEFAULT '',
  behance TEXT DEFAULT '',
  x TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------- media ----------------
DROP TABLE IF EXISTS media CASCADE;

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  folder TEXT DEFAULT '',
  url TEXT NOT NULL,
  path TEXT,
  size INTEGER DEFAULT 0,
  mime TEXT DEFAULT '',
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_site_settings_id ON site_settings(id);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_display ON posts(display_order);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_gallery_post ON post_gallery(post_id);
CREATE INDEX IF NOT EXISTS idx_post_gallery_sort ON post_gallery(sort_order);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_display ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_gallery_project ON project_gallery(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_sort ON project_gallery(sort_order);

CREATE INDEX IF NOT EXISTS idx_team_published ON team_members(published);
CREATE INDEX IF NOT EXISTS idx_team_display ON team_members(display_order);

CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);

-- ============================================================
-- updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_site_settings_updated ON site_settings;
CREATE TRIGGER trigger_site_settings_updated
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_posts_updated ON posts;
CREATE TRIGGER trigger_posts_updated
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_projects_updated ON projects;
CREATE TRIGGER trigger_projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_team_members_updated ON team_members;
CREATE TRIGGER trigger_team_members_updated
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_media_updated ON media;
CREATE TRIGGER trigger_media_updated
  BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Public can read post_gallery" ON post_gallery FOR SELECT USING (true);
CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (published = true AND deleted_at IS NULL);
CREATE POLICY "Public can read project_gallery" ON project_gallery FOR SELECT USING (true);
CREATE POLICY "Public can read published team_members" ON team_members FOR SELECT USING (published = true);
CREATE POLICY "Public can read media" ON media FOR SELECT USING (true);

-- Authenticated full access (dashboard)
CREATE POLICY "Auth can manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can manage posts" ON posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can manage post_gallery" ON post_gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can manage project_gallery" ON project_gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can manage team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can manage media" ON media FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- contact_messages (public contact form submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) may submit a message; no public read (emails stay private).
CREATE POLICY "Public can submit contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Auth can manage contact_messages"
  ON contact_messages FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage: projects bucket (cover/ + gallery/ folders)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view project files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

CREATE POLICY "Authenticated can upload projects"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete projects"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update projects"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
