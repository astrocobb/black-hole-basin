import { useActionState } from 'react'
import { Link, redirect, useNavigate } from 'react-router'
import type { Route } from './+types/new-estimate'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { createEstimate } from '../../features/estimates/api/create-estimate'
import { fetchUserConfigs } from '../../features/user-configs/api/fetch-user-configs'


/**
 * Client loader that fetches the signed-in user's saved configs.
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

export default function NewEstimate({ loaderData }: Route.ComponentProps) {
  const { configs } = loaderData
  const navigate = useNavigate()

  const [ error, submitAction, isPending ] = useActionState(
    async (_prev: string, formData: FormData) => {
      const userConfigId = formData.get('userConfigId') as string
      const inputLat = Number(formData.get('inputLat'))
      const inputLon = Number(formData.get('inputLon'))
      const waterDemandGpm = Number(formData.get('waterDemandGpm'))

      try {
        const response = await createEstimate({ userConfigId, inputLat, inputLon, waterDemandGpm })
        if (response.status === 201) {
          navigate('/dashboard')
          return ''
        }
        return response.message
      } catch {
        return 'Something went wrong. Please try again.'
      }
    },
    ''
  )

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </Link>
          <span className="text-sm text-neutral-content/70">New Estimate</span>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-10">
        <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold">New Estimate</h2>

          <form action={ submitAction } className="flex flex-col gap-6">
            { error && (
              <p className="rounded-md bg-error/20 px-4 py-2.5 text-sm text-error">{ error }</p>
            ) }

            <div className="flex flex-col gap-2">
              <label htmlFor="userConfigId" className="text-sm font-medium text-neutral-content">
                Config
              </label>
              <select
                id="userConfigId"
                name="userConfigId"
                required
                className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a config</option>
                { configs.map(config => (
                  <option key={ config.id } value={ config.id }>{ config.name }</option>
                )) }
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="inputLat" className="text-sm font-medium text-neutral-content">
                  Latitude
                </label>
                <input
                  id="inputLat"
                  name="inputLat"
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 32.7157"
                  className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="inputLon" className="text-sm font-medium text-neutral-content">
                  Longitude
                </label>
                <input
                  id="inputLon"
                  name="inputLon"
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. -117.1611"
                  className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="waterDemandGpm" className="text-sm font-medium text-neutral-content">
                Water Demand (GPM)
              </label>
              <input
                id="waterDemandGpm"
                name="waterDemandGpm"
                type="number"
                step="any"
                required
                placeholder="e.g. 50"
                className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <Link
                to="/dashboard"
                className="flex-1 rounded-md border border-base-300 px-4 py-2.5 font-medium text-neutral-content transition hover:bg-base-200 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={ isPending }
                className="flex-1 rounded-md bg-primary px-4 py-2.5 font-medium text-primary-content transition hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50"
              >
                { isPending ? 'Creating...' : 'Create Estimate' }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
