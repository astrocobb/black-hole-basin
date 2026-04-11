---
name: react-router-7
description: React Router 7.14.0 (framework mode / SSR) conventions for this codebase. Use when adding or editing routes, loaders, actions, navigation, or data fetching in the frontend.
---

# React Router 7.14.0 (Framework Mode)

This project runs React Router v7 in **framework mode**: SSR via `react-router dev`/`react-router-serve`, file-based routes declared in `frontend/src/app/routes.ts`, `root.tsx` Layout, and typegen (`react-router typegen`) producing per-route types at `./+types/<route>`.

**Not data router mode**: do NOT import `createBrowserRouter`, `RouterProvider`, `BrowserRouter`, or `Routes`/`Route` components. Routes are registered in `routes.ts` with `route()` and `index()`.

## Imports
- Always import from `react-router` (not `react-router-dom` — that package is deprecated in v7).
- Use generated route types: `import type { Route } from './+types/<route-name>'`.

## Route module exports

Each route file in `app/routes/` can export:

```tsx
import type { Route } from './+types/dashboard'

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  return { items: await fetchItems() }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData()
  // mutate...
  return redirect('/dashboard')
}

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Dashboard' }]
}

export function links(): Route.LinksFunction {
  return [{ rel: 'icon', href: '/favicon.ico' }]
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.items.length}</div>
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) { /* ... */ }
export function HydrateFallback() { return <p>Loading...</p> }
```

- `loader` runs on the server; `clientLoader` runs in the browser. Use `clientLoader` for data that depends on client-only state (e.g. JWT in `localStorage`).
- `loaderData` is passed as a prop to the default component — prefer that over `useLoaderData()` in framework mode.
- `action` / `clientAction` mirror loaders for mutations.

## Navigation
- Use `<Link to="/path">` — never `<a href="/path">` for internal links (full-page reload breaks SSR hydration and loses state).
- Use `<NavLink>` for active-state styling.
- `useNavigate()` for programmatic navigation after non-form work.
- In loaders/actions, return `redirect('/path')` rather than calling `navigate`.

## Data flow
- Prefer `clientLoader` over `useEffect` + `useState` for route data. The loader runs before the component mounts and its return value arrives as `loaderData`.
- For auth-gated routes, throw `redirect('/sign-in')` from `clientLoader` when the token is missing/expired.
- Use `useNavigation()` for loading states across navigations; `useFetcher()` for mutations that should not cause a navigation.

## Forms
- React 19 native form actions with `useActionState` are acceptable for client-only API submissions (see `sign-in.tsx`).
- For submissions that should revalidate route data, prefer `<Form method="post">` + a `clientAction` export, then return `redirect()` from the action.

## Error boundaries
- Every route file can export an `ErrorBoundary`. The root boundary in `root.tsx` handles anything uncaught.
- Use `isRouteErrorResponse(error)` to distinguish thrown `Response`s (e.g. from `redirect()` or 404s) from runtime errors.

## Do NOT
- Do not import from `react-router-dom`.
- Do not use `createBrowserRouter`/`RouterProvider` — routes live in `routes.ts`.
- Do not use `<a href>` for internal navigation.
- Do not fetch route data in `useEffect` when a `clientLoader` would do.
- Do not call `useNavigate()` from a loader/action — return `redirect()` instead.
- Do not use `useHistory` (removed) or `<Switch>` (removed).
