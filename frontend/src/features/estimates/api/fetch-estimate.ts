import { apiClient } from '../../../lib/api-client'
import type { Estimate } from './fetch-estimates'

interface EstimateResponse {
  status: number
  data: Estimate
  message: string
}

export async function fetchEstimate(id: string): Promise<EstimateResponse> {
  const res = await apiClient(`/api/estimates/id/${id}`)
  return res.json()
}
