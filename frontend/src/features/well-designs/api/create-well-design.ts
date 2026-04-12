import { apiClient } from '../../../lib/api-client'
import type { WellDesign } from './fetch-well-designs'

export interface CreateWellDesignInput {
  userConfigId: string
  waterDemandGpm: number
  inputLat?: number
  inputLon?: number
  estimatedDepth?: number
}

interface CreateWellDesignResponse {
  status: number
  data: WellDesign
  message: string
}

export async function createWellDesign(input: CreateWellDesignInput): Promise<CreateWellDesignResponse> {
  const res = await apiClient('/api/well-designs', {
    method: 'POST',
    body: JSON.stringify(input)
  })
  return res.json()
}
