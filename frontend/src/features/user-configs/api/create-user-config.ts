import { apiClient } from '../../../lib/api-client'

export interface CreateUserConfigInput {
  id: string
  userId: string
  name: string
  costPerFoot: Record<string, number>
  mobilizationFee: number
  casingPrices: Record<string, number>
  screenPrices: Record<string, number>
  slotSize: number
  gravelPackPrices: Record<string, number>
}

interface CreateUserConfigResponse {
  status: number
  data: null
  message: string
}

export async function createUserConfig(input: CreateUserConfigInput): Promise<CreateUserConfigResponse> {
  const res = await apiClient('/api/user-configs', {
    method: 'POST',
    body: JSON.stringify(input)
  })
  return res.json()
}
