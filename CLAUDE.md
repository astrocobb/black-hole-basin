# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TODO

- [ ] Create graceful error handling for sign-in before activation
- [ ] Add OSE well logs to database
- [ ] Implement OSE well logs into estimates or calculator
- [ ] Add the nearest OSE wells info and monitoring well info to each estimate
- [ ] Add a delete well design button
- [ ] Estimate history page with filters (date, location, cost range) and CSV export
- [ ] Map view showing estimates + nearest monitoring wells
- [ ] Side-by-side comparison of multiple estimates
- [ ] PDF report generation for client deliverables
- [ ] Historical water-level charts from `well_data` for the nearest monitoring well
- [ ] Confidence score on estimates based on distance to nearest well + data recency
- [ ] Shareable read-only estimate links
- [ ] Team/organization accounts with shared client configs
- [ ] Audit log of estimate edits
- [ ] Password reset flow
- [ ] Admin dashboard UI for monitoring well CRUD
- [ ] Per-user usage metrics

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

React 19 conventions live in the `react-19` skill (`.claude/skills/react-19/SKILL.md`).

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

## Depth Calculator + Well Designs

The old `estimates` feature was split into two features:

### `depth-calculator` (ephemeral)

Pure compute — no persistence. Given `(inputLat, inputLon)`, finds the nearest monitoring well, pulls its latest `depthToWater`, compares altitudes, and returns an `estimatedDepth` (with a 200 ft safety buffer). Used both as a standalone tool and internally by `well-designs`.

- `POST /api/depth-calculator` — `{ inputLat, inputLon }` → `{ nearestMonitoringWellId, estimatedDepth, altitudeDifference, depthToWater, inputAltitude }`
- Repository: `selectNearestMonitoringWell(lat, lon)` (PostGIS), `selectLatestWellData(wellId)` — read-only.

### `well-designs` (persisted)

Turns a depth + water demand + config into casing/screen specs and a cost breakdown, then persists to the `well_designs` table. Accepts **either** a precomputed `estimatedDepth` **or** `(inputLat, inputLon)`; when coords are given, the service calls `calculateDepthService()` internally. When a depth is supplied directly, `nearestMonitoringWellId`, `altitudeDifference`, and `depthToWater` are stored as `NULL`.

**Endpoints**:
- `POST /api/well-designs` — run the pipeline, persist, return 201. Validated by `WellDesignInputSchema.superRefine(...)` which requires exactly one of `(inputLat+inputLon)` or `estimatedDepth`.
- `GET /api/well-designs/:id` — retrieve by ID (ownership check).
- `GET /api/well-designs` — list for the session user (`created_at DESC`).
- `DELETE /api/well-designs/:id` — remove (ownership check).

**Key calculation helpers** (pure, in `well-designs.service.ts`): `calculateCasingDiameter(waterDemandGpm)` — GPM lookup; `calculateScreenLength(waterDemandGpm, estimatedDepth)`; cost math inline. Pricing rates come from `selectUserConfigById()` in `user-configs`.

**Frontend**:
- `/depth-calculator` — standalone page.
- `/well-designs/new` — form. Reads `?estimatedDepth=` to pre-fill from the calculator; otherwise shows lat/lon inputs.
- `/well-designs/:id` — detail view; renders `—` for the nullable calc-derived fields.
- `/dashboard` — three sectioned tabs (Well Designs, Depth Calculator, Configs) via the `features/dashboard/sections/` registry. New sections drop a file and append to the `dashboardSections` array.