import { Link, redirect } from 'react-router'
import type { Route } from './+types/well-design-detail'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { fetchWellDesign } from '../../features/well-designs/api/fetch-well-design'


/**
 * Client loader that fetches a single well design by id.
 * Redirects to /sign-in when the user is unauthenticated.
 * @param { Route.ClientLoaderArgs } args - Contains the `:id` route parameter.
 * @returns { Promise<{ wellDesign: WellDesign | null, error: string }> } The well design and/or an error message.
 */
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw redirect('/sign-in')

  const res = await fetchWellDesign(params.id)
  if (res.status === 200) {
    return { wellDesign: res.data, error: '' }
  }
  return { wellDesign: null, error: res.message }
}

export default function WellDesignDetail({ loaderData }: Route.ComponentProps) {
  const { wellDesign, error } = loaderData

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
        { error && (
          <p className="rounded-md bg-error/20 px-4 py-2.5 text-sm text-error">{ error }</p>
        ) }

        { wellDesign && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Well Design Details</h2>
              <p className="text-sm text-neutral-content">
                { new Date(wellDesign.createdAt).toLocaleDateString() }
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <section className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-content">
                  Location &amp; Input
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Detail
                    label="Latitude"
                    value={ wellDesign.inputLat != null ? wellDesign.inputLat.toFixed(6) : '—' }
                  />
                  <Detail
                    label="Longitude"
                    value={ wellDesign.inputLon != null ? wellDesign.inputLon.toFixed(6) : '—' }
                  />
                  <Detail label="Water Demand" value={ `${ wellDesign.waterDemandGpm } GPM` } />
                  <Detail
                    label="Nearest Monitoring Well"
                    value={ wellDesign.nearestMonitoringWellId ?? '—' }
                  />
                </div>
              </section>

              <section className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-content">
                  Well Specifications
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Detail label="Estimated Depth" value={ `${ wellDesign.estimatedDepth.toFixed(0) } ft` } />
                  <Detail
                    label="Depth to Water"
                    value={
                      wellDesign.depthToWater != null && wellDesign.altitudeDifference != null
                        ? `${ (wellDesign.depthToWater + wellDesign.altitudeDifference).toFixed(1) } ft`
                        : '—'
                    }
                  />
                  <Detail
                    label="Altitude Difference"
                    value={
                      wellDesign.altitudeDifference != null
                        ? `${ wellDesign.altitudeDifference.toFixed(1) } ft`
                        : '—'
                    }
                  />
                  <Detail label="Casing Diameter" value={ `${ wellDesign.casingDiameter }"` } />
                  <Detail label="Screen Length" value={ `${ wellDesign.screenLength.toFixed(1) } ft` } />
                  <Detail label="Slot Size" value={ `${ wellDesign.slotSize }"` } />
                </div>
              </section>

              <section className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-content">
                  Cost Breakdown
                </h3>
                <div className="flex flex-col gap-3">
                  <CostRow label="Drilling" amount={ wellDesign.drillingCost } />
                  <CostRow label="Casing" amount={ wellDesign.casingCost } />
                  <CostRow label="Screen" amount={ wellDesign.screenCost } />
                  <CostRow label="Gravel Pack" amount={ wellDesign.gravelPackCost } />
                  <CostRow label="Mobilization" amount={ wellDesign.mobilizationCost } />
                  <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg">${ wellDesign.totalCost.toFixed(2) }</span>
                  </div>
                </div>
              </section>
            </div>
          </>
        ) }
      </main>
    </div>
  )
}

function Detail({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="text-sm text-neutral-content">{ label }</p>
      <p className="font-medium">{ value }</p>
    </div>
  )
}

function CostRow({ label, amount }: Readonly<{ label: string; amount: number }>) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-content">{ label }</span>
      <span>${ amount.toFixed(2) }</span>
    </div>
  )
}
