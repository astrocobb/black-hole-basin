# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # React Router SSR dev server (frontend on :5173)
npm run dev:api      # Backend API only with tsx watch (on :4200)

# Build & Typecheck
npm run build        # Build React Router SSR bundle
npm run typecheck    # Run react-router typegen + tsc

# Production
npm run start        # Serve built production bundle

# Infrastructure
docker compose up -d # Start PostgreSQL 16 (:5432) and Redis 7 (:6379)
```

No test framework is configured.

## Architecture

Monorepo with separate backend API and React Router frontend sharing a single root `package.json`.

### Backend (`backend/api/src/`)

Express 5 app using a class-based setup (`App.ts`) with Redis session store and JWT auth.

**Feature structure** — each feature is a self-contained folder under `features/`:
```
features/<name>/
  <name>.route.ts        # Express Router with basePath
  <name>.controller.ts   # Request handlers
  <name>.model.ts        # Zod schema, TypeScript type, and SQL queries (postgres lib)
```

**Auth flow**: Sign-up → email activation (Resend) → sign-in → session + JWT. Protected routes use `isSignedInController` middleware that verifies session + JWT signature. Resource ownership checked via `validUser()`.

**API response shape** — all endpoints return `{ status, data, message }` in that property order, using the `Status` interface. Sensitive fields (`hash`, `activationToken`) are stripped before sending user data to clients.

**Database**: PostgreSQL via the `postgres` npm package with automatic camelCase transformation. Migrations in `backend/api/src/database/`. Zod schemas serve as both validation and the TypeScript type source (`z.infer`).

**Utilities** in `utils/`:
- `auth.utils.ts` — JWT generation, argon2 hashing, password validation, user ownership check
- `response.utils.ts` — `zodErrorResponse`, `serverErrorResponse`, `createStatus`
- `controllers/is-signed-in.controller.ts` — auth middleware

### Frontend (`frontend/src/`)

React Router 7 with SSR enabled. Tailwind CSS 4 via Vite plugin. Dark theme (gray-800 base, blue-600 accents).

**Follows [bulletproof-react](https://github.com/alan2207/bulletproof-react) conventions:**

- `app/` — routes, root layout, router config (composes features into pages)
- `features/` — self-contained feature modules with internal `api/`, `components/`, `hooks/` sub-folders as needed
- `components/` — shared UI components only
- `hooks/`, `stores/`, `utils/`, `types/`, `config/` — shared modules

**Key rules:**
- Import direction: `shared → features → app` (features never import from each other or from app)
- No barrel files (`index.ts` re-exports) — import files directly
- Colocate code with the feature that uses it; only promote to shared folders when reused
- API calls use a shared client in `lib/`; each feature defines its own fetchers in `features/<name>/api/`

**Route config** in `frontend/src/app/routes.ts` using React Router's `route()` and `index()` helpers. The `react-router.config.ts` points `appDirectory` to `frontend/src/app`.

## Conventions

- Zod 4 for all validation (backend schemas double as TypeScript types)
- UUIDs are v7 (`uuid` package)
- REST endpoints use plural kebab-case nouns (`/api/monitoring-wells`, `/api/users`)
- Role-based access: check `user.role` in controllers (e.g., `admin` required for monitoring well creation)
- Frontend pages share a consistent layout: dark `bg-gray-800` wrapper, bordered header with "Black Hole Basin" title, `max-w-4xl` centered content
