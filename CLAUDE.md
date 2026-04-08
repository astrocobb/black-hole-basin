# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TODO

- [ ] Add `GET /api/estimates` — list all estimates for session user
- [ ] Add `DELETE /api/estimates/:id` — remove a saved estimate (ownership check)
- [ ] Create graceful error handling for sign-in before activation
- [ ] Build frontend for estimates feature

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

### Backend (`backend/src/`)

Express 5 app using a class-based setup (`App.ts`) with Redis session store and JWT auth. Follows a **3-layer architecture**: controller → service → repository.

**Feature structure** — each feature is a self-contained folder under `features/`:
```
features/<name>/
  <name>.route.ts        # Express Router with basePath
  <name>.controller.ts   # Validate request, call service, send response
  <name>.service.ts      # Business logic, throws AppError on failure
  <name>.repository.ts   # SQL queries (postgres lib)
  <name>.schema.ts       # Zod schema + TypeScript type
```

**Auth flow**: Sign-up → email activation (Resend) → sign-in → session + JWT. Protected routes use `requireAuth` middleware that verifies session + JWT signature. Resource ownership checked via `assertOwnership()` which throws `ForbiddenError`.

**API response shape** — all endpoints return `{ status, data, message }` in that property order, using the `Status` interface. Sensitive fields (`hash`) are stripped in the service layer before returning user data.

**Error handling**: Services throw typed `AppError` subclasses (`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`) defined in `lib/errors.ts`. Controllers catch these and respond with the appropriate status code.

**Database**: PostgreSQL via the `postgres` npm package with automatic camelCase transformation. Zod schemas serve as both validation and the TypeScript type source (`z.infer`).

**Config**: All environment variables are centralized in `config/index.ts`. No other file reads `process.env` directly.

**Utilities** in `lib/`:
- `auth.ts` — JWT generation, argon2 hashing, password validation, `assertOwnership()`
- `response.ts` — `zodErrorResponse`, `serverErrorResponse`, `createStatus`
- `errors.ts` — `AppError` base class and typed subclasses
- `db.ts` — PostgreSQL client
- `redis.ts` — Redis client factory

**Middleware**: `middleware/require-auth.ts` — session and JWT verification for protected routes

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

**Doc blocks** — all JSDoc comments follow these rules:
- Spaces inside type braces: `{ Type }` not `{Type}`
- Multi-line for functions/methods; single-line `/** Description */` for declarations
- Param format: `@param { Type } name - Description`
- Returns format: `@returns { Type } Description` — always include `{ void }` for void-returning functions
- Throws format: `@throws { ErrorClass } When condition`
- Route comments: `/** METHOD /path - Description */` — HTTP verb in all caps, with `@` prefix

## Estimates Feature

`POST /api/estimates` — single endpoint that returns a full well drilling estimate.

**Input**: lat/lon location, water demand (GPM), client config ID

**Pipeline** (orchestrated by `estimates.service.ts`):
1. Find nearest monitoring well to input location (PostGIS spatial query)
2. Get that well's `wellDepth` and `altitude`
3. Look up recent `depthToWater` from `well_data` for that well
4. Compare altitudes between input location and monitoring well → estimated depth
5. Calculate casing diameter from water demand (standard GPM-to-diameter rules)
6. Calculate screen length from water demand and estimated depth
7. Pull client config for pricing rates
8. Calculate cost from depth × cost-per-foot, casing cost, screen cost, etc.

**Output**: estimated depth, casing diameter, screen length, depth to water, altitude difference, cost breakdown, nearest monitoring well reference

**Endpoints**:
- `POST /api/estimates` — run the pipeline, persist the result, return 201 with the full estimate
- `GET /api/estimates/:id` — retrieve a saved estimate by ID (ownership check)
- `GET /api/estimates` — list all estimates for the session user (ordered by `created_at DESC`)
- `DELETE /api/estimates/:id` — remove a saved estimate (ownership check)

**POST service flow**:
1. Validate ownership / attach `sessionUserId`
2. Spatial query: find nearest monitoring well to `(lat, lon)` via PostGIS `ST_Distance` → get `wellDepth`, `altitude`
3. Query `well_data` for that well: most recent `depthToWater` (`ORDER BY date_measured DESC LIMIT 1`)
4. Get altitude at input location (external API or lookup) → compute `altitudeDifference` and `estimatedDepth`
5. Derive `casingDiameter` from `waterDemandGpm` (standard GPM-to-diameter rules)
6. Derive `screenLength` from `waterDemandGpm` and `estimatedDepth`
7. Fetch user config (`selectUserConfigById`) for pricing rates
8. Compute costs: drilling (depth × cost-per-foot), casing, screen, gravel pack, mobilization → `totalCost`
9. Generate estimate ID, build full estimate object, `insertEstimate`, return result

**Key functions for POST**:
- *Repository (new)*: `selectNearestMonitoringWell(lat, lon)` — PostGIS spatial query returning closest well (`id`, `wellDepth`, `altitude`); `selectLatestWellData(monitoringWellId)` — most recent `depthToWater` for a well; `insertEstimate(estimate)` — persist the full estimate
- *Repository (existing)*: `selectUserConfigById(id)` — pulls pricing rates from user configs
- *Calculation helpers* (pure functions in service or lib): `calculateCasingDiameter(waterDemandGpm)` — GPM-to-diameter lookup; `calculateScreenLength(waterDemandGpm, estimatedDepth)` — screen sizing; `calculateCosts(estimatedDepth, casingDiameter, screenLength, userConfig)` — returns cost breakdown

**Features**:
- `estimates/` — route, controller, service, schema; repository for spatial queries
- `client-configs/` — CRUD for pricing/config (cost per foot, casing prices, screen prices, mobilization fee)