import { apiClient } from '../../../lib/api-client'


export interface DepthCalculatorResult {
  nearestMonitoringWellId: string
  estimatedDepth: number
  altitudeDifference: number
  depthToWater: number
  inputAltitude: number
}

interface CalculateDepthInput {
  inputLat: number
  inputLon: number
}

interface CalculateDepthResponse {
  status: number
  data: DepthCalculatorResult
  message: string
}

export async function calculateDepth(input: CalculateDepthInput): Promise<CalculateDepthResponse> {
  const res = await apiClient('/api/depth-calculator', {
    method: 'POST',
    body: JSON.stringify(input)
  })
  return res.json()
}
