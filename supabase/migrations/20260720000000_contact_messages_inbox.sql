-- ============================================================
-- Migration: 20260720000000_contact_messages_inbox
-- Purpose: production contact inbox table + RLS
--   - id, full_name, email, phone, company, subject, message,
--     created_at, status
--   - default status 'Unread'
--   - RLS: public (anon) can INSERT only
--          authenticated admins can SELECT / UPDATE / DELETE
--          guests (anon) cannot UPDATE or DELETE
-- Idempotent: safe to re-run in the Supabase SQL editor.
-- ============================================================

-- Ensure the table exists with the core columns (legacy safety).
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add the production columns if missing.
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Unread';

-- Backfill any legacy rows whose status is empty.
UPDATE contact_messages SET status = 'Unread' WHERE status IS NULL OR status = '';

-- Backfill full_name from legacy name column when missing.
UPDATE contact_messages SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop any legacy policies to avoid duplicates / conflicting grants.
DROP POLICY IF EXISTS "Public can submit contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Auth can manage contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Public insert contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated read contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated update contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated delete contact_messages" ON contact_messages;

-- Public (guest / anon) may ONLY insert a message.
CREATE POLICY "Public insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Authenticated admins may read all messages.
CREATE POLICY "Authenticated read contact_messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated admins may update (change status: Read / Archived).
CREATE POLICY "Authenticated update contact_messages"
  ON contact_messages FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admins may delete messages.
CREATE POLICY "Authenticated delete contact_messages"
  ON contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');
