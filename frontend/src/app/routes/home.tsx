import React from 'react'
import { useAuth } from '../../features/auth/hooks/use-auth'


/**
 * Landing page component for Black Hole Basin.
 * Displays an overview of the well depth calculator with feature highlights.
 * Shows contextual navigation based on the user's authentication state.
 * @returns { JSX.Element } The home page layout.
 */
export default function Home() {
  const { isAuthenticated, user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Site header with auth-aware navigation */}
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Black Hole Basin</h1>
          { isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-content">{ user.name }</span>
              <button
                type="button"
                onClick={ signOut }
                className="text-sm text-neutral-content/70 transition hover:text-base-content"
              >
                Sign Out
              </button>
            </div>
          ) : null }
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-24">
        {/* Hero section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Well Depth Calculator
          </h2>
          <p className="mt-4 text-lg text-neutral-content">
            Calculate optimal well designs using geographic coordinates and subsurface data.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Coordinate Input</h3>
            <p className="mt-2 text-sm text-neutral-content">
              Enter latitude and longitude to target a specific drilling location.
            </p>
          </div>

          <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Depth Analysis</h3>
            <p className="mt-2 text-sm text-neutral-content">
              Get calculated well depth recommendations based on subsurface conditions.
            </p>
          </div>

          <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Monitoring</h3>
            <p className="mt-2 text-sm text-neutral-content">
              Track and monitor well status through a centralized dashboard.
            </p>
          </div>
        </div>

        {/* Call-to-action buttons — change based on auth state */}
        <div className="mt-12 flex justify-center gap-4">
          <a
            href="/dashboard"
            className="rounded-md bg-primary px-6 py-2.5 font-medium text-primary-content transition hover:bg-primary/90 active:bg-primary/80"
          >
            Go to Dashboard
          </a>
          { !isAuthenticated && (
            <a
              href="/sign-in"
              className="rounded-md border border-base-300 px-6 py-2.5 font-medium text-neutral-content transition hover:bg-base-100"
            >
              Sign In
            </a>
          ) }
        </div>
      </main>
    </div>
  )
}
