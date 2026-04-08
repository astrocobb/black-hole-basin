import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/hooks/use-auth'


/**
 * Dashboard page component for the well depth calculator.
 * Requires authentication — redirects to sign-in if the user is not logged in.
 * Displays the user's name in the header and provides a sign-out action.
 * @returns { JSX.Element } The dashboard page layout.
 */
export default function Dashboard() {
  const { user, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()

  // Redirect unauthenticated users to the sign-in page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in')
    }
  }, [isAuthenticated, navigate])

  // Don't render dashboard content until auth state is confirmed
  if (!isAuthenticated || !user) {
    return null
  }

  /**
   * Signs the user out and redirects to the home page.
   */
  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Site header with user info and sign-out */}
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-content">{ user.name }</span>
            <button
              type="button"
              onClick={ handleSignOut }
              className="rounded-md border border-base-300 px-3 py-1.5 text-sm text-neutral-content transition hover:bg-base-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold">Enter Coordinates</h2>

          {/* Coordinate input fields in a two-column grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="latitude" className="text-sm font-medium text-neutral-content">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                placeholder="34.6628"
                className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="longitude" className="text-sm font-medium text-neutral-content">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                placeholder="-106.7764"
                className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-8 w-full rounded-md bg-primary px-4 py-2.5 font-medium text-primary-content transition hover:bg-primary/90 active:bg-primary/80"
          >
            Calculate Well Design
          </button>
        </div>
      </main>
    </div>
  )
}
