import { apiClient } from '../../../lib/api-client'
import type { WellDesign } from './fetch-well-designs'

interface WellDesignResponse {
  status: number
  data: WellDesign
  message: string
}

export async function fetchWellDesign(id: string): Promise<WellDesignResponse> {
  const res = await apiClient(`/api/well-designs/${ id }`)
  return res.json()
}
