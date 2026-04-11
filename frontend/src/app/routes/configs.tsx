import { Link, redirect } from 'react-router'
import type { Route } from './+types/configs'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { fetchUserConfigs } from '../../features/user-configs/api/fetch-user-configs'


/**
 * Client loader that fetches all configs owned by the signed-in user.
 * Redirects to /sign-in when no JWT is present in localStorage.
 * @param { Route.ClientLoaderArgs } _args - React Router client loader args (unused).
 * @returns { Promise<{ configs: UserConfig[] }> } The user's configs.
 */
export async function clientLoader(_args: Route.ClientLoaderArgs) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw redirect('/sign-in')

  const payload = token.split('.')[1]
  const decoded = payload ? JSON.parse(atob(payload)) : null
  const userId = decoded?.auth?.id
  if (!userId) throw redirect('/sign-in')

  const res = await fetchUserConfigs(userId)
  return { configs: res.data }
}

export default function Configs({ loaderData }: Route.ComponentProps) {
  const { configs } = loaderData

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </Link>
          <Link
            to="/dashboard"
            className="rounded-md border border-base-300 px-3 py-1.5 text-sm text-neutral-content transition hover:bg-base-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Configs</h2>
          <Link
            to="/configs/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content transition hover:bg-primary/90"
          >
            New Config
          </Link>
        </div>

        { configs.length === 0 && (
          <p className="text-neutral-content">No configs yet. Create your first one.</p>
        ) }

        { configs.length > 0 && (
          <div className="flex flex-col gap-4">
            { configs.map(config => (
              <div
                key={ config.id }
                className="rounded-md border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium text-base">{ config.name }</p>
                    <p className="text-sm text-neutral-content">
                      Updated { new Date(config.updatedAt).toLocaleDateString() }
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-neutral-content">Mobilization</p>
                    <p className="font-medium">${ config.mobilizationFee.toFixed(2) }</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PriceBlock title="Cost Per Foot" entries={ config.costPerFoot } unit="$/ft" />
                  <PriceBlock title="Casing Prices" entries={ config.casingPrices } unit="$/ft" />
                  <PriceBlock title="Screen Prices" entries={ config.screenPrices } unit="$/ft" />
                  <PriceBlock title="Gravel Pack Prices" entries={ config.gravelPackPrices } unit="$/ft" />
                </div>

                <div className="mt-4 border-t border-base-300 pt-3 text-sm text-neutral-content">
                  Slot size: <span className="text-base-content">{ config.slotSize }"</span>
                </div>
              </div>
            )) }
          </div>
        ) }
      </main>
    </div>
  )
}

function PriceBlock({ title, entries, unit }: { title: string; entries: Record<string, number>; unit: string }) {
  const rows = Object.entries(entries)
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-content">{ title }</p>
      { rows.length === 0 ? (
        <p className="text-sm text-neutral-content/60">—</p>
      ) : (
        <ul className="flex flex-col gap-1">
          { rows.map(([ key, value ]) => (
            <li key={ key } className="flex items-center justify-between text-sm">
              <span className="text-neutral-content">{ key }</span>
              <span>${ value.toFixed(2) } { unit }</span>
            </li>
          )) }
        </ul>
      ) }
    </div>
  )
}
