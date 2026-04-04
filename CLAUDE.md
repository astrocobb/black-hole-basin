# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # React Router SSR dev server (frontend on :5173)
npm run dev:backend  # Backend API only with tsx watch (on :4200)

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

## TODO

- [ ] Create `monitoring-well-data` feature (schema, repository, controller, route) for time-series readings (`depthToWater`, `dateMeasured`)
- [x] Fix activation flow — `auth.repository.ts` `selectUserActivationByToken` return type doesn't match `User | null`, activation endpoint is broken
- [x] Update `monitoring-wells.schema.ts` to match SQL columns (`locationId`, `locationName`, `stateCode`, `countyCode`, `altitude`, `holeDepth`, `wellDepth`, `dateDrilled`)
- [x] Update `monitoring-wells.repository.ts` queries to use real SQL columns including PostGIS `geom`
- [x] Update `updateUser` in `users.repository.ts` to set `updated_at = now()`
- [x] Remove commented-out `selectUserByActivationToken` from `users.repository.ts`

## Restructuring Plan: 3-Layer Architecture

Add a service layer and centralized config to align with standard Express/Node.js architecture guides (controller -> service -> repository).

### New files to create
- [x] `backend/src/lib/errors.ts` — `AppError` base class + `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError` subclasses with HTTP status codes
- [x] `backend/src/config/index.ts` — centralize all `process.env` reads into one validated `config` object (port, frontendUrl, session, redis, postgres, resend)
- [x] `backend/src/lib/redis.ts` — extract Redis client creation from `index.ts` into `createRedisClient()`
- [x] `backend/src/features/auth/auth.service.ts` — `signIn(email, password)`, `signUp(data)`, `activateAccount(token)`
- `backend/src/features/users/users.service.ts` — `getUserById(id)` with hash stripping
- `backend/src/features/monitoring-wells/monitoring-wells.service.ts` — `createMonitoringWell(data, sessionUser)` with admin/ownership/duplicate checks

### Files to modify
- `backend/src/features/auth/auth.controller.ts` — slim to: validate request -> call service -> send response
- `backend/src/features/users/users.controller.ts` — same pattern
- `backend/src/features/monitoring-wells/monitoring-wells.controller.ts` — same pattern
- `backend/src/lib/auth.ts` — replace `validUser(req, res, id)` with `assertOwnership(sessionUserId, resourceUserId)` that throws `ForbiddenError` (removes Express coupling)
- `backend/src/lib/db.ts` — use `config` import instead of `process.env`
- `backend/src/App.ts` — use `config` import instead of `process.env`
- `backend/src/index.ts` — use `config` + `createRedisClient()`, simplify bootstrap

### Implementation order
1. `lib/errors.ts`, `config/index.ts`, `lib/redis.ts` (no interdependencies)
2. `lib/auth.ts` refactor, `lib/db.ts` update
3. Three service files (auth, users, monitoring-wells)
4. Three controller refactors
5. `App.ts`, `index.ts` updates
6. Update `CLAUDE.md` paths and feature structure docs

### Target feature structure
```
features/<name>/
  <name>.route.ts        # Express Router with basePath
  <name>.controller.ts   # Validate request, call service, send response
  <name>.service.ts      # Business logic, throws AppError on failure
  <name>.repository.ts   # SQL queries (postgres lib)
  <name>.schema.ts       # Zod schema + TypeScript type
```
