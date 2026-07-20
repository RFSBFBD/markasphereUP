-- Global Settings Schema for MarkaSphere
-- Run this SQL in Supabase SQL Editor

-- ============================================
-- SETTINGS TABLE (Key/Value Architecture)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_key TEXT NOT NULL DEFAULT 'general',
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT 'null'::jsonb,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'number', 'boolean', 'image', 'json', 'color', 'url', 'email')),
  label TEXT DEFAULT '',
  description TEXT DEFAULT '',
  placeholder TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_group ON settings(group_key);
CREATE INDEX idx_settings_public ON settings(is_public);

-- ============================================
-- SETTINGS GROUPS (for organization)
-- ============================================
CREATE TABLE IF NOT EXISTS setting_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_setting_groups_key ON setting_groups(key);

-- ============================================
-- TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- ============================================
-- RLS
-- ============================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE setting_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public settings" ON settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Authenticated can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage setting_groups" ON setting_groups
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED: Setting Groups
-- ============================================
INSERT INTO setting_groups (key, label, icon, description, sort_order) VALUES
  ('general', 'General', '⚙️', 'Company info, contact, working hours', 1),
  ('branding', 'Branding', '🎨', 'Logo, colors, typography', 2),
  ('social', 'Social Media', '📱', 'Social media links', 3),
  ('seo', 'SEO Defaults', '🔍', 'Default meta tags and SEO settings', 4),
  ('analytics', 'Analytics', '📊', 'Analytics and tracking codes', 5),
  ('email', 'Email', '✉️', 'Email configuration', 6),
  ('contact', 'Contact Form', '📋', 'Contact form settings', 7),
  ('homepage', 'Homepage', '🏠', 'Homepage sections config', 8),
  ('footer', 'Footer', '📎', 'Footer content and links', 9),
  ('system', 'System', '🔧', 'Maintenance, version, cache', 10)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED: Default Settings
-- ============================================
INSERT INTO settings (group_key, key, value, type, label, placeholder, is_public, sort_order) VALUES
  -- General
  ('general', 'company_name', '"MarkaSphere"', 'text', 'Company Name', 'Your company name', true, 1),
  ('general', 'company_description', '""', 'textarea', 'Company Description', 'Brief description of your company', true, 2),
  ('general', 'address', '""', 'textarea', 'Address', 'Full address', true, 3),
  ('general', 'email', '""', 'email', 'Email', 'contact@example.com', true, 4),
  ('general', 'phone', '""', 'text', 'Phone', '+1 234 567 890', true, 5),
  ('general', 'whatsapp', '""', 'text', 'WhatsApp', '+1 234 567 890', true, 6),
  ('general', 'working_hours', '""', 'text', 'Working Hours', 'Mon-Fri 9:00 AM - 6:00 PM', true, 7),
  ('general', 'google_maps', '""', 'textarea', 'Google Maps Embed URL', 'https://www.google.com/maps/embed?...', false, 8),

  -- Branding
  ('branding', 'logo', '""', 'image', 'Logo', 'Upload logo', true, 1),
  ('branding', 'logo_dark', '""', 'image', 'Dark Logo', 'Upload dark theme logo', true, 2),
  ('branding', 'favicon', '""', 'image', 'Favicon', 'Upload favicon (32x32)', true, 3),
  ('branding', 'app_icon', '""', 'image', 'App Icon', 'Upload app icon (192x192)', true, 4),
  ('branding', 'primary_color', '"#6366f1"', 'color', 'Primary Color', '#6366f1', true, 5),
  ('branding', 'secondary_color', '"#8b5cf6"', 'color', 'Secondary Color', '#8b5cf6', true, 6),
  ('branding', 'accent_color', '"#f59e0b"', 'color', 'Accent Color', '#f59e0b', true, 7),
  ('branding', 'typography', '"Geist"', 'text', 'Typography', 'Primary font family', false, 8),

  -- Social Media
  ('social', 'facebook', '""', 'url', 'Facebook', 'https://facebook.com/...', true, 1),
  ('social', 'instagram', '""', 'url', 'Instagram', 'https://instagram.com/...', true, 2),
  ('social', 'linkedin', '""', 'url', 'LinkedIn', 'https://linkedin.com/in/...', true, 3),
  ('social', 'twitter', '""', 'url', 'X (Twitter)', 'https://x.com/...', true, 4),
  ('social', 'behance', '""', 'url', 'Behance', 'https://behance.net/...', true, 5),
  ('social', 'dribbble', '""', 'url', 'Dribbble', 'https://dribbble.com/...', true, 6),
  ('social', 'github', '""', 'url', 'GitHub', 'https://github.com/...', true, 7),
  ('social', 'youtube', '""', 'url', 'YouTube', 'https://youtube.com/...', true, 8),
  ('social', 'tiktok', '""', 'url', 'TikTok', 'https://tiktok.com/@...', true, 9),

  -- SEO Defaults
  ('seo', 'default_title', '"MarkaSphere | Digital Agency"', 'text', 'Default Title', 'Default page title', true, 1),
  ('seo', 'default_description', '""', 'textarea', 'Default Description', 'Default meta description', true, 2),
  ('seo', 'default_keywords', '""', 'text', 'Default Keywords', 'keyword1, keyword2, keyword3', true, 3),
  ('seo', 'canonical_base', '"https://markasphere.com"', 'url', 'Canonical Base URL', 'https://yourdomain.com', true, 4),
  ('seo', 'default_og_image', '""', 'image', 'Default OG Image', 'Upload default share image', true, 5),
  ('seo', 'twitter_card', '"summary_large_image"', 'text', 'Twitter Card Type', 'summary_large_image', false, 6),
  ('seo', 'robots', '"index, follow"', 'text', 'Robots', 'index, follow', false, 7),

  -- Analytics
  ('analytics', 'ga_id', '""', 'text', 'Google Analytics ID', 'G-XXXXXXXXXX', false, 1),
  ('analytics', 'gtm_id', '""', 'text', 'Google Tag Manager', 'GTM-XXXXXXX', false, 2),
  ('analytics', 'meta_pixel', '""', 'text', 'Meta Pixel ID', '123456789', false, 3),
  ('analytics', 'clarity_id', '""', 'text', 'Microsoft Clarity', 'Clarity project ID', false, 4),
  ('analytics', 'search_console', '""', 'text', 'Search Console Verification', 'Verification code', false, 5),

  -- Email
  ('email', 'sender_name', '"MarkaSphere"', 'text', 'Sender Name', 'Company name for emails', false, 1),
  ('email', 'sender_email', '""', 'email', 'Sender Email', 'noreply@example.com', false, 2),
  ('email', 'reply_to', '""', 'email', 'Reply To', 'support@example.com', false, 3),

  -- Contact Form
  ('contact', 'receiver_email', '""', 'email', 'Receiver Email', 'contact@example.com', false, 1),
  ('contact', 'auto_reply', 'false', 'boolean', 'Auto Reply', 'Send auto-reply to sender', false, 2),
  ('contact', 'spam_protection', 'true', 'boolean', 'Spam Protection', 'Enable reCAPTCHA', false, 3),

  -- Homepage
  ('homepage', 'hero_title', '""', 'text', 'Hero Title', 'Main hero headline', true, 1),
  ('homepage', 'hero_subtitle', '""', 'textarea', 'Hero Subtitle', 'Hero description', true, 2),
  ('homepage', 'hero_cta_text', '"Get Started"', 'text', 'Hero CTA Text', 'Button text', true, 3),
  ('homepage', 'hero_cta_link', '"/contact"', 'text', 'Hero CTA Link', '/contact', true, 4),
  ('homepage', 'featured_projects_count', '6', 'number', 'Featured Projects Count', '6', false, 5),
  ('homepage', 'featured_articles_count', '3', 'number', 'Featured Articles Count', '3', false, 6),
  ('homepage', 'featured_testimonials_count', '3', 'number', 'Featured Testimonials Count', '3', false, 7),

  -- Footer
  ('footer', 'copyright', '"© 2024 MarkaSphere. All rights reserved."', 'text', 'Copyright Text', '© 2024 Company', true, 1),
  ('footer', 'quick_links', '[]', 'json', 'Quick Links', 'JSON array of links', true, 2),
  ('footer', 'privacy_policy', '""', 'url', 'Privacy Policy URL', '/privacy', true, 3),
  ('footer', 'terms', '""', 'url', 'Terms URL', '/terms', true, 4),

  -- System
  ('system', 'maintenance_mode', 'false', 'boolean', 'Maintenance Mode', 'Enable maintenance mode', false, 1),
  ('system', 'coming_soon', 'false', 'boolean', 'Coming Soon', 'Enable coming soon page', false, 2),
  ('system', 'site_status', '"active"', 'text', 'Site Status', 'active, maintenance, coming_soon', false, 3),
  ('system', 'version', '"1.0.0"', 'text', 'Version', '1.0.0', false, 4),
  ('system', 'cache_bust', '""', 'text', 'Cache Bust', 'Last cache clear timestamp', false, 5)
ON CONFLICT (key) DO NOTHING;
