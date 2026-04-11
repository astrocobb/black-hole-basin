import { useActionState, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/hooks/use-auth'
import { createEstimate } from '../../features/estimates/api/create-estimate'
import { type UserConfig, fetchUserConfigs } from '../../features/user-configs/api/fetch-user-configs'


export default function NewEstimate() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [configs, setConfigs] = useState<UserConfig[]>([])
  const [configsLoading, setConfigsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/sign-in')
    }
  }, [ authLoading, isAuthenticated, navigate ])

  useEffect(() => {
    if (!user) return
    fetchUserConfigs(user.id)
      .then(res => setConfigs(res.data))
      .catch(console.error)
      .finally(() => setConfigsLoading(false))
  }, [ user ])

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

  if (authLoading || !isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </a>
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
                disabled={ configsLoading }
                className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
              >
                <option value="">{ configsLoading ? 'Loading configs...' : 'Select a config' }</option>
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
              <button
                type="button"
                onClick={ () => navigate('/dashboard') }
                className="flex-1 rounded-md border border-base-300 px-4 py-2.5 font-medium text-neutral-content transition hover:bg-base-200"
              >
                Cancel
              </button>
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
