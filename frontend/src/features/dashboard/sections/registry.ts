import { estimatesSection } from './estimates-section'
import { configsSection } from './configs-section'
import type { DashboardSection } from './types'


/**
 * Ordered list of dashboard sections. Add new sections here to expose them
 * in the dashboard tab bar — each entry must satisfy {@link DashboardSection}.
 */
export const dashboardSections: ReadonlyArray<DashboardSection<any>> = [
  estimatesSection,
  configsSection
]

export const dashboardSectionMap: Record<string, DashboardSection<any>> =
  Object.fromEntries(dashboardSections.map(s => [ s.id, s ]))

export const defaultSectionId = dashboardSections[0].id

/**
 * Resolve a section by id, falling back to the default when the id is unknown.
 * @param { string | null | undefined } id - Section id from the URL.
 * @returns { DashboardSection } The matching section, or the default section.
 */
export function resolveSection(id: string | null | undefined): DashboardSection<any> {
  if (id && dashboardSectionMap[id]) return dashboardSectionMap[id]
  return dashboardSectionMap[defaultSectionId]
}
