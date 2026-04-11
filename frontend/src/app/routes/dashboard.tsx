import { Link, redirect, useNavigate, useSearchParams } from 'react-router'
import type { Route } from './+types/dashboard'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { useAuth } from '../../features/auth/hooks/use-auth'
import { dashboardSections, resolveSection } from '../../features/dashboard/sections/registry'


/**
 * Client loader that resolves the active dashboard section from the
 * `view` search param and runs that section's loader. Redirects to
 * /sign-in when no JWT is present in localStorage.
 * @param { Route.ClientLoaderArgs } args - React Router client loader args.
 * @returns { Promise<{ sectionId: string, data: unknown }> } The active section id and its data.
 */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw redirect('/sign-in')

  const payload = token.split('.')[1]
  const decoded = payload ? JSON.parse(atob(payload)) : null
  const userId = decoded?.auth?.id
  if (!userId) throw redirect('/sign-in')

  const url = new URL(request.url)
  const section = resolveSection(url.searchParams.get('view'))
  const data = await section.load(userId)
  return { sectionId: section.id, data }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [ searchParams, setSearchParams ] = useSearchParams()
  const { sectionId, data } = loaderData

  const activeSection = resolveSection(sectionId)
  const ActiveComponent = activeSection.Component

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  function selectSection(id: string) {
    const next = new URLSearchParams(searchParams)
    next.set('view', id)
    setSearchParams(next)
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
        <nav className="mb-6 flex items-center gap-2 border-b border-base-300">
          { dashboardSections.map(section => {
            const isActive = section.id === activeSection.id
            return (
              <button
                key={ section.id }
                type="button"
                onClick={ () => selectSection(section.id) }
                className={
                  'cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition -mb-px ' +
                  (isActive
                    ? 'border-primary text-base-content'
                    : 'border-transparent text-neutral-content hover:text-base-content')
                }
              >
                { section.label }
              </button>
            )
          }) }
        </nav>

        <ActiveComponent data={ data } />
      </main>
    </div>
  )
}