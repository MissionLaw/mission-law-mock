# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A toy / mock version of Mission Law used for **ideation and technical interviews**. It's a Next.js 15 + TypeScript + Drizzle + Supabase app modeling a legal-services portal with separate Client and Admin experiences. Treat it as a sandbox — features are intentionally simplified, and code shipped here is not production-grade. Keep changes small, focused, and easy to follow in an interview setting.

## Commands

```bash
npm run setup         # First-time bootstrap: starts local Supabase, rewrites the
                      # SUPABASE_*_KEY values in .env.local from `supabase start`
                      # output, applies the Drizzle schema, and seeds data.
npm run dev           # Next.js dev server on :3000 (falls back to :3001 if taken)
npm run build         # Production build
npm run lint          # eslint --fix
npm run db:start      # Just start Supabase (Docker required)
npm run db:stop       # Stop Supabase
npm run db:studio     # Open Supabase Studio at http://localhost:54323
npm run db:push       # Push lib/db/schema.ts to the local DB (no migrations dir)
npm run db:reset      # Drop + recreate the local DB
npm run script seed   # Re-seed sample data (dispatched via scripts/index.ts)
```

There is **no test framework** wired up — no `npm test`, no jest/vitest config. If a task asks for tests, raise the gap before adding a runner.

Schema changes are applied via `db:push` against the schema file directly; the project does **not** use generated migration files. After editing `lib/db/schema.ts`, run `db:push` (or `db:reset` then `npm run script seed` if you need clean data).

## Branching

`develop` is the default branch. Feature branches follow `<initials>/<feature-name>`, e.g. `bc/nda-document-upload`.

## Architecture

### Routing (Next.js 15 App Router)

Three top-level route groups under `app/`:

- `(public)/` — unauthenticated routes (currently just `login`).
- `client/` — client portal. Layout wraps children in `<AuthGuard requiredRole="client">`.
- `admin/` — admin portal. Layout wraps children in `<AuthGuard requiredRole="admin">`.
- `app/api/` — REST-ish handlers: `auth/signin`, `services`, `services/[id]`, `client`, `attorneys`, `health/db`.

### Auth (mock — not real)

Authentication is a demo, not a security boundary:

- `lib/auth.ts` (`AuthService`) stores the current user in **`localStorage`** on the client.
- Sign-in is by **email only** — `POST /api/auth/signin` looks the email up in the `users` table and returns the row.
- `components/AuthGuard.tsx` is a client-side redirect; it does not protect API routes.
- API routes do not currently check who's calling them.

Don't try to bolt Supabase Auth, RLS, or session cookies onto this without explicit ask — it's deliberately simple. If asked to harden auth, flag the scope first.

### Data layer

- **Drizzle schema**: `lib/db/schema.ts` defines five tables — `clients`, `attorneys`, `users`, `services`, `documents` — plus enums `service_type` (`nda | employee_onboarding | contract_review`), `service_status` (`submitted → legal_review → client_review → complete`), and `user_role` (`client | admin`). Relations are declared via Drizzle `relations()`.
- **Service layer**: `lib/services/database.ts` exports a single class `DatabaseService` with static methods for client/service/attorney CRUD. API routes call into this. Note: `DATABASE_SETUP.md` references a `HybridDatabaseService` with mock-data fallback — **that class does not exist in the code.** Only `DatabaseService` is real; ignore the hybrid-fallback story in the docs.
- **JSONB fields** carry dynamic data: `services.formData` holds the per-service-type form payload, `services.notes` is a string array, `attorneys.specialties` is a string array of service types.
- **Types** come from `$inferSelect` / `$inferInsert` on each table — import from `@/lib/db/schema`, not duplicate interfaces.

### Service templates (the dynamic-form system)

`lib/constants.ts` exports `SERVICE_TEMPLATES: ServiceTemplate[]` — one entry per `ServiceType`, each declaring the form fields (id, label, type, required, options/placeholder) that the client portal renders when a user requests that service. The submitted values land in `services.formData` as JSONB. To add a new service type: extend the `service_type` enum in `schema.ts`, add a template here, and (if needed) update labels in `SERVICE_STATUS_LABELS` / `SERVICE_TYPES`.

### Local Supabase

`supabase/config.toml` pins the project to ports **54321** (API), **54322** (Postgres), **54323** (Studio). Only one Supabase project can run on these ports at a time — if `supabase start` fails because another local project owns them, stop that one first.

`npm run setup` parses the `Publishable key:` / `Secret key:` lines out of `supabase start`'s stdout and writes them into `.env.local`. If you rotate keys or reset the stack, re-run `npm run setup` (or copy keys manually) — the dev server reads them from `.env.local` at startup.

### Demo accounts

Seeded by `scripts/seed.ts`. Sign in by email (no password):

- **Client**: `sarah.johnson@techcorp.com` (also `michael.chen@innovatelab.com`, `amanda.rodriguez@globalventures.com`)
- **Admin**: `david.morrison@missionlaw.com`, `lisa.thompson@missionlaw.com`

## Conventions worth keeping

- Absolute imports use the `@/` prefix (configured in `tsconfig.json`).
- File names: kebab-case for routes and non-component modules; PascalCase for React component files.
- Server components by default; add `'use client'` only where state, effects, or browser APIs require it (e.g. `AuthGuard`, anything using `AuthService`).
- Client-side data fetching uses **SWR**; reach for it before adding a new fetching primitive.
- Styling: Tailwind utility classes, combined via `clsx` + `tailwind-merge` (see `lib/utils.ts`). Icons from `@heroicons/react`.
