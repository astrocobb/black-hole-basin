import { Link, redirect } from 'react-router'
import type { Route } from './+types/estimate-detail'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { fetchEstimate } from '../../features/estimates/api/fetch-estimate'


/**
 * Client loader that fetches a single estimate by id.
 * Redirects to /sign-in when the user is unauthenticated.
 * @param { Route.ClientLoaderArgs } args - Contains the `:id` route parameter.
 * @returns { Promise<{ estimate: Estimate | null, error: string }> } The estimate and/or an error message.
 */
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw redirect('/sign-in')

  const res = await fetchEstimate(params.id)
  if (res.status === 200) {
    return { estimate: res.data, error: '' }
  }
  return { estimate: null, error: res.message }
}

export default function EstimateDetail({ loaderData }: Route.ComponentProps) {
  const { estimate, error } = loaderData

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

        { estimate && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Estimate Details</h2>
              <p className="text-sm text-neutral-content">
                { new Date(estimate.createdAt).toLocaleDateString() }
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <section className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-content">
                  Location &amp; Input
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Detail label="Latitude" value={ estimate.inputLat.toFixed(6) } />
                  <Detail label="Longitude" value={ estimate.inputLon.toFixed(6) } />
                  <Detail label="Water Demand" value={ `${estimate.waterDemandGpm} GPM` } />
                  <Detail label="Nearest Monitoring Well" value={ estimate.nearestMonitoringWellId } />
                </div>
              </section>

              <section className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-content">
                  Well Specifications
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Detail label="Estimated Depth" value={ `${estimate.estimatedDepth.toFixed(0)} ft` } />
                  <Detail label="Depth to Water" value={ `${(estimate.depthToWater + estimate.altitudeDifference).toFixed(1)} ft` } />
                  <Detail label="Altitude Difference" value={ `${estimate.altitudeDifference.toFixed(1)} ft` } />
                  <Detail label="Casing Diameter" value={ `${estimate.casingDiameter}"` } />
                  <Detail label="Screen Length" value={ `${estimate.screenLength.toFixed(1)} ft` } />
                  <Detail label="Slot Size" value={ `${estimate.slotSize}"` } />
                </div>
              </section>

              <section className="rounded-md border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-content">
                  Cost Breakdown
                </h3>
                <div className="flex flex-col gap-3">
                  <CostRow label="Drilling" amount={ estimate.drillingCost } />
                  <CostRow label="Casing" amount={ estimate.casingCost } />
                  <CostRow label="Screen" amount={ estimate.screenCost } />
                  <CostRow label="Gravel Pack" amount={ estimate.gravelPackCost } />
                  <CostRow label="Mobilization" amount={ estimate.mobilizationCost } />
                  <div className="border-t border-base-300 pt-3 flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg">${ estimate.totalCost.toFixed(2) }</span>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-neutral-content">{ label }</p>
      <p className="font-medium">{ value }</p>
    </div>
  )
}

function CostRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-content">{ label }</span>
      <span>${ amount.toFixed(2) }</span>
    </div>
  )
}
