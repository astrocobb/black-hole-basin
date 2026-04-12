import { useActionState, useState } from 'react'
import { Link } from 'react-router'
import { calculateDepth, type DepthCalculatorResult } from '../../depth-calculator/api/calculate-depth'
import type { DashboardSection } from './types'
import type { JSX } from 'react'


/**
 * Depth calculator dashboard section. Provides an inline form for one-off
 * depth calculations without leaving the dashboard. Links the result into
 * the new-well-design form so the user can escalate into a full design.
 * @returns { JSX.Element } The depth calculator inline form and result panel.
 */
function DepthCalculatorSection(): JSX.Element {
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
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
        <form action={ submitAction } className="flex flex-col gap-6">
          { error && (
            <p className="rounded-md bg-error/20 px-4 py-2.5 text-sm text-error">{ error }</p>
          ) }

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="dc-inputLat" className="text-sm font-medium text-neutral-content">
                Latitude
              </label>
              <input
                id="dc-inputLat"
                name="inputLat"
                type="number"
                step="any"
                required
                placeholder="e.g. 32.7157"
                className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dc-inputLon" className="text-sm font-medium text-neutral-content">
                Longitude
              </label>
              <input
                id="dc-inputLon"
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

export const depthCalculatorSection: DashboardSection<null> = {
  id: 'depth-calculator',
  label: 'Depth Calculator',
  load: async () => null,
  Component: DepthCalculatorSection
}
