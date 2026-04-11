import { apiClient } from '../../../lib/api-client'

export interface Estimate {
  id: string
  userId: string
  userConfigId: string
  nearestMonitoringWellId: string
  inputLat: number
  inputLon: number
  waterDemandGpm: number
  estimatedDepth: number
  altitudeDifference: number
  depthToWater: number
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

interface EstimatesResponse {
  status: number
  data: Estimate[]
  message: string
}

export async function fetchEstimates(): Promise<EstimatesResponse> {
  const res = await apiClient(`/api/estimates`)
  return res.json()
}