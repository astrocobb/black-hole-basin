import { apiClient } from '../../../lib/api-client'

export interface WellDesign {
  id: string
  userId: string
  userConfigId: string
  nearestMonitoringWellId: string | null
  inputLat: number | null
  inputLon: number | null
  waterDemandGpm: number
  estimatedDepth: number
  altitudeDifference: number | null
  depthToWater: number | null
  casingDiameter: number
  screenLength: number
  slotSize: number
  drillingCost: number
  casingCost: number
  screenCost: number
  gravelPackCost: number
  mobilizationCost: number
  totalCost: number
  createdAt: string
}

interface WellDesignsResponse {
  status: number
  data: WellDesign[]
  message: string
}

export async function fetchWellDesigns(): Promise<WellDesignsResponse> {
  const res = await apiClient('/api/well-designs')
  return res.json()
}
