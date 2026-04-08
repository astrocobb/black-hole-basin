import type { Estimate, EstimateInput } from './estimates.schema'
import { NotFoundError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'
import {
  insertEstimate,
  selectEstimateById,
  selectLatestWellData,
  selectNearestMonitoringWell
} from './estimates.repository'
import { selectUserConfigById } from '../user-configs/user-configs.repository'
import { v7 as uuid } from 'uuid'
import { fetchElevation } from '../../lib/elevation'


/**
 * Runs the estimate pipeline: finds the nearest monitoring well, computes specs, calculates costs, and persists results.
 * @param { EstimateInput } data - The user-provided estimate input.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Estimate } The persisted estimate.
 */
export async function postEstimateService(data: EstimateInput, sessionUserId: string): Promise<Estimate> {

  // 1. Find the nearest monitoring well
  const nearestWell = await selectNearestMonitoringWell(data.inputLat, data.inputLon)

  // 2. Get the most recent depth to water for that well
  const latestWellData = await selectLatestWellData(nearestWell.id)

  // 3. Get uer config for pricing
  const userConfig = await selectUserConfigById(data.userConfigId)
  if (!userConfig) throw new NotFoundError('User config not found.')

  // 4. Calculate estimates
  const inputAltitude = await fetchElevation(data.inputLat, data.inputLon)
  const altitudeDifference = inputAltitude - nearestWell.altitude
  const depthToWater = latestWellData.depthToWater
  const estimatedDepth = depthToWater + altitudeDifference + 200
  const casingDiameter = calculateCasingDiameter(data.waterDemandGpm)
  const screenLength = calculateScreenLength(data.waterDemandGpm, estimatedDepth)

  // 5. Calculate costs
  const casingKey = String(casingDiameter)

  const drillingCost = estimatedDepth * (userConfig.costPerFoot[casingKey] ?? 0)
  const casingCost = estimatedDepth * (userConfig.casingPrices[casingKey] ?? 0)
  const screenCost = screenLength * (userConfig.screenPrices[casingKey] ?? 0)

  const gravelPackKey = String(userConfig.slotSize)
  const gravelPackCost = screenLength * (userConfig.gravelPackPrices[gravelPackKey] ?? 0)

  const mobilizationCost = userConfig.mobilizationFee

  const totalCost = drillingCost + casingCost + screenCost + gravelPackCost + mobilizationCost

  // 6. Build and persist
  const estimate: Estimate = {
    id: uuid(),
    userId: sessionUserId,
    userConfigId: data.userConfigId,
    nearestMonitoringWellId: nearestWell.id,
    inputLon: data.inputLon,
    inputLat: data.inputLat,
    waterDemandGpm: data.waterDemandGpm,
    estimatedDepth,
    altitudeDifference,
    depthToWater,
    casingDiameter,
    screenLength,
    slotSize: userConfig.slotSize,
    drillingCost,
    casingCost,
    screenCost,
    gravelPackCost,
    mobilizationCost,
    totalCost,
    createdAt: new Date()
  }

  await insertEstimate(estimate)

  return estimate
}

/**
 * Service function to retrieve an estimate by ID.
 * @param { string } id - The estimate ID to retrieve.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Estimate } The estimate object if found, or throws an error.
 */
export async function getEstimateByIdService(id: string, sessionUserId: string): Promise<Estimate> {

  const existingEstimate = await selectEstimateById(id)
  if (!existingEstimate) throw new NotFoundError('Estimate not found.')

  assertOwnership(sessionUserId, existingEstimate.userId)

  return existingEstimate
}

/**
 * GPM-to-casing-diameter lookup.
 * @param { number } waterDemandGpm - Requested water demand in gallons per minute.
 * @returns { number } Casing diameter in inches.
 */
function calculateCasingDiameter(waterDemandGpm: number): number {
  if (waterDemandGpm <= 10) return 4
  if (waterDemandGpm <= 50) return 5
  if (waterDemandGpm <= 100) return 6
  if (waterDemandGpm <= 250) return 8
  if (waterDemandGpm <= 500) return 10
  if (waterDemandGpm <= 1000) return 12
  if (waterDemandGpm <= 1800) return 14
  if (waterDemandGpm <= 3000) return 16
  if (waterDemandGpm <= 3800) return 20
  return 24
}

/**
 * Calculates screen length based on water demand and estimated depth.
 * @param { number } waterDemandGpm - Requested water demand in gallons per minute.
 * @param { number } estimatedDepth - Estimated well depth in feet.
 * @returns { number } Screen length in feet.
 */
// function calculateScreenLength(waterDemandGpm: number, estimatedDepth: number): number {
//   // Screen length is typically 10-20% of well depth, scaled by water demand.
//   const baseRation = 0.15
//   return Math.round(estimatedDepth * baseRation * (waterDemandGpm / 50))
// }
function calculateScreenLength(waterDemandGpm: number, estimatedDepth: number): number {
  if (waterDemandGpm <= 10) return 20
  if (waterDemandGpm <= 50) return 30
  if (waterDemandGpm <= 100) return 40
  if (waterDemandGpm <= 250) return 50
  if (waterDemandGpm <= 500) return 60
  if (waterDemandGpm <= 1000) return 80
  return 100
}