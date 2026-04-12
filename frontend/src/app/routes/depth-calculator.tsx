import { useActionState, useState } from 'react'
import { Link, redirect } from 'react-router'
import type { Route } from './+types/depth-calculator'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { calculateDepth, type DepthCalculatorResult } from '../../features/depth-calculator/api/calculate-depth'


/**
 * Client loader that gates the depth-calculator page on authentication.
 * @param { Route.ClientLoaderArgs } _args - React Router client loader args (unused).
 * @returns { Promise<null> } No data — the calculator is fully interactive.
 */
export async function clientLoader(_args: Route.ClientLoaderArgs) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw redirect('/sign-in')

  const payload = token.split('.')[1]
  const decoded = payload ? JSON.parse(atob(payload)) : null
  const userId = decoded?.auth?.id
  if (!userId) throw redirect('/sign-in')

  return null
}

export default function DepthCalculator() {
  const [ result, setResult ] = useState<DepthCalculatorResult | null>(null)

  const [ error, submitAction, isPending ] = useActionState(
    async (_prev: string, formData: FormData) => {
      const inputLat = Number(formData.get('inputLat'))
      const inputLon = Number(formData.get('inputLon'))

      try {
        const response = await calculateDepth({ inputLat, inputLon })
        if (response.status === 200) {
          setResult(response.data)
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
          <Link
            to="/dashboard"
            className="rounded-md border border-base-300 px-3 py-1.5 text-sm text-neutral-content transition hover:bg-base-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Depth Calculator</h2>

        <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
          <form action={ submitAction } className="flex flex-col gap-6">
            { error && (
              <p className="rounded-md bg-error/20 px-4 py-2.5 text-sm text-error">{ error }</p>
            ) }

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

            <button
              type="submit"
              disabled={ isPending }
              className="self-start rounded-md bg-primary px-4 py-2.5 font-medium text-primary-content transition hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50"
            >
              { isPending ? 'Calculating...' : 'Calculate Depth' }
            </button>
          </form>
        </div>

        { result && (
          <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-content">
              Result
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ResultRow label="Estimated Depth" value={ `${ result.estimatedDepth.toFixed(0) } ft` } />
              <ResultRow label="Depth to Water" value={ `${ result.depthToWater.toFixed(1) } ft` } />
              <ResultRow label="Altitude Difference" value={ `${ result.altitudeDifference.toFixed(1) } ft` } />
              <ResultRow label="Input Altitude" value={ `${ result.inputAltitude.toFixed(1) } ft` } />
              <ResultRow label="Nearest Monitoring Well" value={ result.nearestMonitoringWellId } />
            </div>
            <Link
              to={ `/well-designs/new?estimatedDepth=${ result.estimatedDepth.toFixed(2) }` }
              className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content transition hover:bg-primary/90"
            >
              Use this depth in a new well design →
            </Link>
          </div>
        ) }
      </main>
    </div>
  )
}

function ResultRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="text-sm text-neutral-content">{ label }</p>
      <p className="font-medium">{ value }</p>
    </div>
  )
}
