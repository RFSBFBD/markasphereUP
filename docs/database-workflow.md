# Database Workflow Guide

> MarkaSphere — Supabase CLI + Migrations

## Prerequisites

- Node.js 18+
- Supabase CLI (`npm install -g supabase`)
- Docker Desktop (required for local development)

## Directory Structure

```
supabase/
├── config.toml          # Supabase project configuration
├── seed.sql             # Seed data (runs on supabase db reset)
├── migrations/          # Ordered SQL migration files
│   └── YYYYMMDDHHMMSS_migration_name.sql
└── functions/           # Edge Functions (optional)
```

## Quick Start (New Developer)

```bash
# 1. Install dependencies
npm install

# 2. Install Supabase CLI
npm install -g supabase

# 3. Start local Supabase (requires Docker)
supabase start

# 4. Apply all migrations + seed
supabase db reset

# 5. Open Studio (local dashboard)
# Available at http://localhost:54323
```

## Creating a New Migration

### Step 1: Generate migration file

```bash
supabase migration new <migration_name>
```

This creates: `supabase/migrations/YYYYMMDDHHMMSS_<name>.sql`

### Step 2: Write your SQL

```sql
-- Migration: Add new column to projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'
CHECK (status IN ('published', 'draft'));
```

### Step 3: Test locally

```bash
# Reset database (applies all migrations + seed)
supabase db reset

# Or push without reset
supabase db push
```

### Step 4: Commit

```bash
git add supabase/migrations/
git commit -m "feat(db): add status column to projects"
```

## Pushing to Production

```bash
# Link to your remote project (first time only)
supabase link --project-ref <your-project-ref>

# Push migrations to production
supabase db push
```

**Important:** Always review migration SQL before pushing to production.

## How Migrations Work

- Files are executed in **alphabetical order** (timestamps ensure correct order)
- Each migration runs **exactly once** (tracked in `supabase_migrations` table)
- `supabase db reset` drops and recreates the database, running all migrations from scratch

## Rolling Back a Migration

Supabase CLI does not have automatic rollback. Manual steps:

1. Create a **new migration** that reverses the change:

```sql
-- Rollback: Remove status column from projects
ALTER TABLE projects DROP COLUMN IF EXISTS status;
```

2. Push the new migration:

```bash
supabase db push
```

**Never delete or edit existing migration files.** Always create a new migration to undo changes.

## Common Commands

| Command | Description |
|---------|-------------|
| `supabase init` | Initialize Supabase in project |
| `supabase start` | Start local Supabase (Docker) |
| `supabase stop` | Stop local Supabase |
| `supabase db reset` | Reset local DB + apply all migrations + seed |
| `supabase db push` | Push migrations to remote |
| `supabase migration new <name>` | Create new migration file |
| `supabase migration list` | List all migrations and their status |
| `supabase link --project-ref <ref>` | Link to remote project |
| `supabase status` | Check status of local/remote Supabase |
| `supabase studio` | Open local Studio dashboard |

## Seed Data

Edit `supabase/seed.sql` to add development seed data. This file runs when you execute `supabase db reset`.

```sql
-- Example: Seed project categories
INSERT INTO project_categories (name_ar, name_en, slug) VALUES
  ('الهويات البصرية', 'Visual Identity', 'visual-identity'),
  ('المواقع الإلكترونية', 'Websites', 'websites')
ON CONFLICT (slug) DO NOTHING;
```

## Environment Variables

The `.env` file (excluded from Git) should contain:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Never commit `.env` to Git.** Use `.env.example` as a template.

## Troubleshooting

### "Docker not running"
Start Docker Desktop before running `supabase start` or `supabase db reset`.

### "Migration already applied"
If a migration shows as "applied" but you need to re-run it:
```bash
supabase db reset  # Drops and recreates local DB
```

### "Port already in use"
Change ports in `supabase/config.toml`:
```toml
[api]
port = 54321

[db]
port = 54322
```

### "supabase: command not found"
Ensure npm global bin is in your PATH:
```bash
npm config get prefix
# Add the output to your PATH
```

## Git Workflow

```
main
└── feat/db/projects-schema     ← branch
    └── supabase/migrations/20260711_add_projects.sql
    └── commit: "feat(db): add projects schema"
```

- Always commit migration files to Git
- Never commit `.env` or local state
- Review migration SQL in PRs before merging
