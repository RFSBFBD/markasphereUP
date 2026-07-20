-- ============================================
-- Migration: 00001_enable_pgcrypto
-- Description: Enable pgcrypto extension for UUID generation
-- Created: 2026-07-11
-- ============================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verify extension is loaded
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto'
  ) THEN
    RAISE EXCEPTION 'pgcrypto extension not found';
  END IF;
END
$$;
