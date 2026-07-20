-- ============================================
-- Migration: 003_storage_buckets
-- Description: Create media storage bucket
-- ============================================

-- Create media bucket (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public can view media files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Authenticated insert
CREATE POLICY "Authenticated can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Authenticated delete
CREATE POLICY "Authenticated can delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Authenticated update
CREATE POLICY "Authenticated can update media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');
