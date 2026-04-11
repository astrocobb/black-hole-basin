import { Link } from 'react-router'
import { fetchEstimates, type Estimate } from '../../estimates/api/fetch-estimates'
import type { DashboardSection } from './types'
import type { JSX } from 'react'


/**
 * Estimates dashboard section. Lists the signed-in user's saved estimates
 * with a link to create a new one.
 * @param { { data: Estimate[] } } props - Estimates loaded for the section.
 * @returns { JSX.Element } The estimates list view.
 */
function EstimatesSection({ data: estimates }: Readonly<{ data: Estimate[] }>): JSX.Element {
  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <Link
          to="/estimates/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content transition hover:bg-primary/90"
        >
          New Estimate
        </Link>
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
    </>
  )
}

export const estimatesSection: DashboardSection<Estimate[]> = {
  id: 'estimates',
  label: 'Estimates',
  load: async () => (await fetchEstimates()).data,
  Component: EstimatesSection
}
