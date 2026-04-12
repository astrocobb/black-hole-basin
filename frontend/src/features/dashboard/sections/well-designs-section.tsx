import { Link } from 'react-router'
import { fetchWellDesigns, type WellDesign } from '../../well-designs/api/fetch-well-designs'
import type { DashboardSection } from './types'
import type { JSX } from 'react'


/**
 * Well-designs dashboard section. Lists the signed-in user's saved well
 * designs with a link to create a new one.
 * @param { { data: WellDesign[] } } props - Well designs loaded for the section.
 * @returns { JSX.Element } The well-designs list view.
 */
function WellDesignsSection({ data: wellDesigns }: Readonly<{ data: WellDesign[] }>): JSX.Element {
  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <Link
          to="/well-designs/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content transition hover:bg-primary/90"
        >
          New Well Design
        </Link>
      </div>

      { wellDesigns.length === 0 && (
        <p className="text-neutral-content">No well designs yet. Create your first one.</p>
      ) }

      { wellDesigns.length > 0 && (
        <div className="flex flex-col gap-4">
          { wellDesigns.map(wellDesign => (
            <Link
              key={ wellDesign.id }
              to={ `/well-designs/${ wellDesign.id }` }
              className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm text-left transition hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    { wellDesign.estimatedDepth.toFixed(0) } ft &middot; { wellDesign.casingDiameter }" casing
                  </p>
                  <p className="text-sm text-neutral-content">
                    { wellDesign.inputLat != null && wellDesign.inputLon != null
                      ? `${ wellDesign.inputLat.toFixed(4) }, ${ wellDesign.inputLon.toFixed(4) }`
                      : 'Depth supplied directly' } &middot; { wellDesign.waterDemandGpm } GPM
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${ wellDesign.totalCost.toFixed(2) }</p>
                  <p className="text-sm text-neutral-content">
                    { new Date(wellDesign.createdAt).toLocaleDateString() }
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

export const wellDesignsSection: DashboardSection<WellDesign[]> = {
  id: 'well-designs',
  label: 'Well Designs',
  load: async () => (await fetchWellDesigns()).data,
  Component: WellDesignsSection
}
