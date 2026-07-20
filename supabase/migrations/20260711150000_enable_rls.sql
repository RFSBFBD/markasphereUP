-- ============================================
-- Migration: 002_enable_rls
-- Description: Enable RLS and create policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Public SELECT policies
-- ============================================

CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read blog_posts"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Public can read team_members"
  ON team_members FOR SELECT
  USING (true);

-- ============================================
-- Admin policies (authenticated full access)
-- ============================================

CREATE POLICY "Admin can manage settings"
  ON settings FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage blog_posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage team_members"
  ON team_members FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage media"
  ON media FOR ALL
  USING (auth.role() = 'authenticated');
