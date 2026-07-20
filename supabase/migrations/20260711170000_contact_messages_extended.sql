-- ============================================================
-- Migration: 20260711170000_contact_messages_extended
-- Purpose: extend contact_messages with the production-ready
-- fields requested for the public contact form (phone, company,
-- subject, status) while keeping backward-compatible `name`.
-- RLS already allows anon INSERT; no policy change needed.
-- ============================================================

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';
