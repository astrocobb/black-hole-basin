import { Link } from 'react-router'
import { fetchUserConfigs, type UserConfig } from '../../user-configs/api/fetch-user-configs'
import type { DashboardSection } from './types'


/**
 * Configs dashboard section. Lists the signed-in user's pricing configs.
 * @param { { data: UserConfig[] } } props - Configs loaded for the section.
 * @returns { JSX.Element } The configs list view.
 */
function ConfigsSection({ data: configs }: Readonly<{ data: UserConfig[] }>) {
  return (
    <>
      <div className="flex items-center justify-end mb-6">
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
    </>
  )
}

function PriceBlock({ title, entries, unit }: Readonly<{ title: string; entries: Record<string, number>; unit: string }>) {
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

export const configsSection: DashboardSection<UserConfig[]> = {
  id: 'configs',
  label: 'Configs',
  load: async (userId) => (await fetchUserConfigs(userId)).data,
  Component: ConfigsSection
}