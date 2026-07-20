-- Blog CMS Schema for MarkaSphere
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- POST CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS post_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  color TEXT DEFAULT '#6366f1',
  parent_id UUID REFERENCES post_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_post_categories_slug ON post_categories(slug);
CREATE INDEX idx_post_categories_active ON post_categories(is_active);

-- ============================================
-- POST TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6366f1',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_post_tags_slug ON post_tags(slug);

-- ============================================
-- POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  gallery JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'unpublished')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT false,
  featured_order INTEGER DEFAULT 0,
  category_id UUID REFERENCES post_categories(id) ON DELETE SET NULL,
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  seo_keywords TEXT[] DEFAULT '{}',
  canonical_url TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  reading_time INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_featured ON posts(featured);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- ============================================
-- POST-TAGS (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS post_tags_rel (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES post_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_rel_post ON post_tags_rel(post_id);
CREATE INDEX idx_post_tags_rel_tag ON post_tags_rel(tag_id);

-- ============================================
-- POST REVISIONS (Architecture)
-- ============================================
CREATE TABLE IF NOT EXISTS post_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  revision_number INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_post_revisions_post ON post_revisions(post_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_categories_updated_at
  BEFORE UPDATE ON post_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update post_count on categories
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE post_categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.category_id != OLD.category_id THEN
    IF OLD.category_id IS NOT NULL THEN
      UPDATE post_categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
    END IF;
    IF NEW.category_id IS NOT NULL THEN
      UPDATE post_categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE post_categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_post_count
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_category_post_count();

-- Update tag post_count
CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE post_tags SET post_count = post_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_tags SET post_count = post_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tag_post_count
  AFTER INSERT OR DELETE ON post_tags_rel
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_post_count();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags_rel ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_revisions ENABLE ROW LEVEL SECURITY;

-- Public read for published posts
CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Authenticated full access
CREATE POLICY "Authenticated can manage posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage categories" ON post_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage tags" ON post_tags
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage post_tags_rel" ON post_tags_rel
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage revisions" ON post_revisions
  FOR ALL USING (auth.role() = 'authenticated');
