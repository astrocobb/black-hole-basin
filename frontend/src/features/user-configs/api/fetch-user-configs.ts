import { apiClient } from '../../../lib/api-client'

export interface UserConfig {
  id: string
  userId: string
  name: string
  costPerFoot: Record<string, number>
  mobilizationFee: number
  casingPrices: Record<string, number>
  screenPrices: Record<string, number>
  slotSize: number
  gravelPackPrices: Record<string, number>
  createdAt: string
  updatedAt: string
}

interface UserConfigsResponse {
  status: number
  data: UserConfig[]
  message: string
}

export async function fetchUserConfigs(userId: string): Promise<UserConfigsResponse> {
  const res = await apiClient(`/api/user-configs/userId/${userId}`)
  return res.json()
}
