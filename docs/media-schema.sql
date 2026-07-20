-- ============================================
-- MarkaSphere Media Manager - Supabase Schema
-- ============================================

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  medium_url TEXT DEFAULT '',
  file_type TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  bucket TEXT DEFAULT 'media',
  folder TEXT DEFAULT 'general',
  module TEXT DEFAULT 'general',
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_module ON media(module);
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_name ON media USING gin(name gin_trgm_ops);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_media_updated
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_media_updated_at();

-- Row Level Security
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read for published media
CREATE POLICY "Public can view media"
  ON media FOR SELECT
  USING (true);

-- Authenticated full access
CREATE POLICY "Authenticated users can manage media"
  ON media FOR ALL
  USING (auth.role() = 'authenticated');

-- Enable pg_trgm for search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Storage Bucket (run in Supabase Dashboard)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('media', 'media', true);
