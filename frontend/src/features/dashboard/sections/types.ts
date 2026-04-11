import type { ComponentType } from 'react'


/**
 * Contract for a dashboard section. Each section owns its data fetching
 * and rendering, allowing new sections to be slotted into the dashboard
 * by adding an entry to the section registry.
 */
export interface DashboardSection<T = unknown> {
  id: string
  label: string
  load: (userId: string) => Promise<T>
  Component: ComponentType<{ data: T }>
}
