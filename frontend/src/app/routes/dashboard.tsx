import { Link, redirect, useNavigate } from 'react-router'
import type { Route } from './+types/dashboard'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { useAuth } from '../../features/auth/hooks/use-auth'
import { fetchEstimates } from '../../features/estimates/api/fetch-estimates'


/**
 * Client loader that fetches the signed-in user's estimates.
 * Redirects to /sign-in when no JWT is present in localStorage.
 * @param { Route.ClientLoaderArgs } _args - React Router client loader args (unused).
 * @returns { Promise<{ estimates: Estimate[] }> } The estimates for the current user.
 */
export async function clientLoader(_args: Route.ClientLoaderArgs) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw redirect('/sign-in')

  const payload = token.split('.')[1]
  const decoded = payload ? JSON.parse(atob(payload)) : null
  const userId = decoded?.auth?.id
  if (!userId) throw redirect('/sign-in')

  const res = await fetchEstimates(userId)
  return { estimates: res.data }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { estimates } = loaderData

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-content">{ user?.name }</span>
            <button
              type="button"
              onClick={ handleSignOut }
              className="cursor-pointer rounded-md border border-base-300 bg-base-100 px-3 py-1.5 text-sm text-neutral-content transition hover:bg-base-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Estimates</h2>
          <div className="flex items-center gap-2">
            <Link
              to="/configs"
              className="rounded-md border border-base-300 bg-base-100 px-4 py-2 text-sm font-medium text-neutral-content transition hover:bg-base-300"
            >
              Configs
            </Link>
            <Link
              to="/estimates/new"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content transition hover:bg-primary/90"
            >
              New Estimate
            </Link>
          </div>
        </div>

        { estimates.length === 0 && (
          <p className="text-neutral-content">No estimates yet. Create your first one.</p>
        ) }

        { estimates.length > 0 && (
          <div className="flex flex-col gap-4">
            { estimates.map(estimate => (
              <Link
                key={ estimate.id }
                to={ `/estimates/${ estimate.id }` }
                className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm text-left transition hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      { estimate.estimatedDepth.toFixed(0) } ft &middot; { estimate.casingDiameter }" casing
                    </p>
                    <p className="text-sm text-neutral-content">
                      { estimate.inputLat.toFixed(4) }, { estimate.inputLon.toFixed(4) } &middot; {
                      estimate.waterDemandGpm } GPM
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${ estimate.totalCost.toFixed(2) }</p>
                    <p className="text-sm text-neutral-content">
                      { new Date(estimate.createdAt).toLocaleDateString() }
                    </p>
                  </div>
                </div>
              </Link>
            )) }
          </div>
        ) }
      </main>
    </div>
  )
}
