import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '../../features/auth/hooks/use-auth'
import type { Estimate } from '../../features/estimates/api/fetch-estimates'
import { fetchEstimate } from '../../features/estimates/api/fetch-estimate'


export default function EstimateDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/sign-in')
    }
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!user || !id) return
    fetchEstimate(id)
      .then(res => {
        if (res.status === 200) {
          setEstimate(res.data)
        } else {
          setError(res.message)
        }
      })
      .catch(() => setError('Failed to load estimate.'))
      .finally(() => setLoading(false))
  }, [user, id])

  if (authLoading || !isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </a>
          <button
            type="button"
            onClick={ () => navigate('/dashboard') }
            className="rounded-md border border-base-300 px-3 py-1.5 text-sm text-neutral-content transition hover:bg-base-100"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        { loading && <p className="text-neutral-content">Loading...</p> }

        { error && (
          <p className="rounded-md bg-error/20 px-4 py-2.5 text-sm text-error">{ error }</p>
        ) }

        { !loading && !error && estimate && (
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
