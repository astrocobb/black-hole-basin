import { apiClient } from '../../../lib/api-client'
import type { Estimate } from './fetch-estimates'

interface CreateEstimateInput {
  userConfigId: string
  inputLat: number
  inputLon: number
  waterDemandGpm: number
}

interface CreateEstimateResponse {
  status: number
  data: Estimate
  message: string
}

export async function createEstimate(input: CreateEstimateInput): Promise<CreateEstimateResponse> {
  const res = await apiClient('/api/estimates', {
    method: 'POST',
    body: JSON.stringify(input)
  })
  return res.json()
}
