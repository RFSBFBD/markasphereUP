# MarkaSphere — Architecture

## Overview

```
markasphare/
├── src/               # Frontend (Vue 3 + Vite) — live website
├── dashboard/         # Dashboard (Vue 3 + Vite) — admin panel (standalone)
├── shared/            # Shared types, constants, helpers (future)
├── docs/              # Architecture documentation
├── public/            # Static assets (favicon)
├── dist/              # Frontend build output
├── index.html         # Frontend entry
├── vite.config.js     # Frontend Vite config
└── package.json       # Frontend dependencies
```

## Frontend (`src/`)

The production website. Built with:
- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 4** (8 routes: home, about, services, portfolio, case study, blog, contact, 404)
- **Pinia** (state management)
- **vue-i18n** (Arabic/English bilingual, RTL-first)
- **GSAP** (animations — scroll reveal, hover, slider, stagger)
- **SASS/SCSS** (design tokens, component styles)

### Directory structure

```
src/
├── components/
│   ├── base/            # Base UI (BaseSection, BaseHeading, BaseSubtitle)
│   ├── blog/            # BlogCard
│   ├── layout/          # MainLayout, Header, Footer, MobileMenu, WhatsAppFAB
│   ├── portfolio/       # PortfolioCard, PremiumCaseStudy
│   ├── sections/        # Page sections (Hero, Portfolio, Services, etc.)
│   ├── shared/          # Shared cards (ServiceCard, TestimonialCard)
│   └── team/            # TeamCard
├── composables/
│   ├── animations/      # GSAP-driven motion system
│   ├── services/        # Business logic (PortfolioSlider, WhatsApp, image)
│   └── utils/           # Utilities (direction, cursor, header)
├── constants/           # Site-wide constants
├── data/                # Static content (projects, articles, team, partners)
│   ├── portfolio/
│   ├── projects/        # 14 project case studies
│   └── site/
├── locales/             # i18n JSON files (ar, en)
├── router/              # Vue Router configuration
├── styles/              # SCSS/CSS (tokens, base, components, sections, layout)
├── views/               # 8 route-level views
├── App.vue
├── main.js
└── i18n.js
```

## Dashboard (`dashboard/`)

Standalone Vue 3 + Vite application for the admin panel.

- **Independent** — separate `package.json`, `vite.config.js`, `index.html`
- Runs on port 5174 (dev) and `/dashboard/` base path (production)
- Shares **no code** with the frontend at build time
- Will consume `shared/` modules in the future

### Future connection points
- Supabase client (via `shared/services/`)
- Shared types and constants (via `shared/types/`, `shared/constants/`)
- Reusable validators (via `shared/validators/`)

## Shared (`shared/`)

Future home for cross-project sharing:

| Directory     | Purpose                          |
|---------------|----------------------------------|
| `types/`      | Shared TypeScript interfaces     |
| `validators/` | Shared validation logic          |
| `constants/`  | Shared constants (API URLs, etc.)|
| `services/`   | Shared services (Supabase, etc.) |
| `helpers/`    | Shared utility functions         |

## Key architectural decisions

1. **Frontend and Dashboard are separate builds** — avoids coupling, allows independent deployment.
2. **No Laravel** — Laravel backend was fully removed. The frontend had zero runtime dependency on it. Supabase will serve as the backend in the next phase.
3. **Interaction isolation** — Desktop and touch pointer events are split in `PortfolioSlider.js` using `(pointer: coarse)` media query.
4. **Performance-sensitive animations** — GSAP handles all animations; `will-change: transform` and composited-only properties are used throughout.
5. **Bilingual RTL-first** — Arabic is the default locale. Direction and language are stored in `localStorage` and set before page render to prevent FOUC.
