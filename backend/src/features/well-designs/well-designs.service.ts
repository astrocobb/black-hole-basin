import type { WellDesign, WellDesignInput } from './well-designs.schema'
import { NotFoundError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'
import {
  deleteWellDesign,
  insertWellDesign,
  selectWellDesignById,
  selectWellDesignsByUserId
} from './well-designs.repository'
import { selectUserConfigById } from '../user-configs/user-configs.repository'
import { calculateDepthService } from '../depth-calculator/depth-calculator.service'
import { v7 as uuid } from 'uuid'


/**
 * Runs the well-design pipeline: resolves the depth (either from the caller
 * or via the depth calculator), computes casing/screen specs and a cost
 * breakdown, then persists the result.
 * @param { WellDesignInput } data - The user-provided well-design input.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Promise<WellDesign> } The persisted well design.
 */
export async function postWellDesignService(data: WellDesignInput, sessionUserId: string): Promise<WellDesign> {

  // 1. Resolve depth — either call the depth calculator or use the supplied value
  let nearestMonitoringWellId: string | null = null
  let altitudeDifference: number | null = null
  let depthToWater: number | null = null
  let estimatedDepth: number

  if (data.estimatedDepth != null) {
    estimatedDepth = data.estimatedDepth
  } else {
    const depthResult = await calculateDepthService({
      inputLat: data.inputLat!,
      inputLon: data.inputLon!
    })
    estimatedDepth = depthResult.estimatedDepth
    nearestMonitoringWellId = depthResult.nearestMonitoringWellId
    altitudeDifference = depthResult.altitudeDifference
    depthToWater = depthResult.depthToWater
  }

  // 2. Get user config for pricing
  const userConfig = await selectUserConfigById(data.userConfigId)
  if (!userConfig) throw new NotFoundError('User config not found.')

  // 3. Derive well specifications
  const casingDiameter = calculateCasingDiameter(data.waterDemandGpm)
  const screenLength = calculateScreenLength(data.waterDemandGpm, estimatedDepth)

  // 4. Compute cost breakdown
  const casingKey = String(casingDiameter)
  const drillingCost = estimatedDepth * (userConfig.costPerFoot[casingKey] ?? 0)
  const casingCost = estimatedDepth * (userConfig.casingPrices[casingKey] ?? 0)
  const screenCost = screenLength * (userConfig.screenPrices[casingKey] ?? 0)

  const gravelPackKey = String(userConfig.slotSize)
  const gravelPackCost = screenLength * (userConfig.gravelPackPrices[gravelPackKey] ?? 0)

  const mobilizationCost = userConfig.mobilizationFee
  const totalCost = drillingCost + casingCost + screenCost + gravelPackCost + mobilizationCost

  // 5. Build and persist
  const wellDesign: WellDesign = {
    id: uuid(),
    userId: sessionUserId,
    userConfigId: data.userConfigId,
    nearestMonitoringWellId,
    inputLat: data.inputLat ?? null,
    inputLon: data.inputLon ?? null,
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

  await insertWellDesign(wellDesign)

  return wellDesign
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
 * Screen length is typically 10-20% of well depth, scaled by water demand.
 * @param { number } waterDemandGpm - Requested water demand in gallons per minute.
 * @param { number } estimatedDepth - Estimated well depth in feet.
 * @returns { number } Screen length in feet.
 */
function calculateScreenLength(waterDemandGpm: number, estimatedDepth: number): number {
  const baseRatio = 0.15
  return Math.round(estimatedDepth * baseRatio * (waterDemandGpm / 50))
}

/**
 * Retrieves a well design by ID, asserting the caller owns it.
 * @param { string } id - The well-design ID to retrieve.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Promise<WellDesign> } The well-design object if found.
 * @throws { NotFoundError } When the well design does not exist.
 */
export async function getWellDesignByIdService(id: string, sessionUserId: string): Promise<WellDesign> {

  const existing = await selectWellDesignById(id)
  if (!existing) throw new NotFoundError('Well design not found.')

  assertOwnership(sessionUserId, existing.userId)

  return existing
}

/**
 * Retrieves all well designs for the session user.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Promise<WellDesign[]> } An array of well designs.
 */
export async function getWellDesignsByUserIdService(sessionUserId: string): Promise<WellDesign[]> {
  return selectWellDesignsByUserId(sessionUserId)
}

/**
 * Deletes a well design by ID after an ownership check.
 * @param { string } id - The ID of the well design to delete.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Promise<void> }
 * @throws { NotFoundError } When the well design does not exist.
 */
export async function deleteWellDesignService(id: string, sessionUserId: string): Promise<void> {

  const existing = await selectWellDesignById(id)
  if (!existing) throw new NotFoundError('Well design not found.')

  assertOwnership(sessionUserId, existing.userId)

  await deleteWellDesign(id)
}
