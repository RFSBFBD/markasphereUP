-- Enterprise Media Processing Engine Schema
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- ENHANCED MEDIA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  extension TEXT NOT NULL,
  size INTEGER DEFAULT 0,
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  dominant_color TEXT DEFAULT '',
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  folder TEXT DEFAULT 'general',
  storage_path TEXT UNIQUE NOT NULL,
  public_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  webp_url TEXT DEFAULT '',
  avif_url TEXT DEFAULT '',
  blurhash TEXT DEFAULT '',
  module TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_media_filename ON media(filename);
CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_media_module ON media(module);
CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_deleted_at ON media(deleted_at);
CREATE INDEX idx_media_created_at ON media(created_at DESC);

-- ============================================
-- MEDIA FOLDERS
-- ============================================
CREATE TABLE IF NOT EXISTS media_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  icon TEXT DEFAULT '📁',
  sort_order INTEGER DEFAULT 0,
  media_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_media_folders_slug ON media_folders(slug);
CREATE INDEX idx_media_folders_parent ON media_folders(parent_id);

-- ============================================
-- MEDIA USAGE TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS media_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES media(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  record_id TEXT NOT NULL,
  field_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(media_id, module, record_id, field_name)
);

CREATE INDEX idx_media_usage_media ON media_usage(media_id);
CREATE INDEX idx_media_usage_module ON media_usage(module);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_media_updated_at();

-- Update folder media_count
CREATE OR REPLACE FUNCTION update_folder_media_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE media_folders SET media_count = media_count + 1 WHERE slug = NEW.folder;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE media_folders SET media_count = media_count - 1 WHERE slug = OLD.folder;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_folder_media_count
  AFTER INSERT OR DELETE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_folder_media_count();

-- ============================================
-- SEED: Default Folders
-- ============================================
INSERT INTO media_folders (name, slug, icon, sort_order) VALUES
  ('General', 'general', '📁', 0),
  ('Projects', 'projects', '🏗️', 1),
  ('Blog', 'blog', '📝', 2),
  ('Team', 'team', '👥', 3),
  ('Partners', 'partners', '🤝', 4),
  ('Testimonials', 'testimonials', '💬', 5),
  ('Settings', 'settings', '⚙️', 6),
  ('Temp', 'temp', '🗑️', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media" ON media
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Authenticated can manage media" ON media
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage folders" ON media_folders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage usage" ON media_usage
  FOR ALL USING (auth.role() = 'authenticated');
