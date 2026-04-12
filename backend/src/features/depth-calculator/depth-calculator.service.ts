import type { DepthCalculatorInput, DepthCalculatorResult } from './depth-calculator.schema'
import { selectLatestWellData, selectNearestMonitoringWell } from './depth-calculator.repository'
import { fetchElevation } from '../../lib/elevation'


/**
 * Runs the depth-estimation pipeline for a given location. Finds the nearest
 * monitoring well, pulls its most recent depth-to-water reading, compares
 * altitudes, and returns an estimated drilling depth with a standard 200 ft
 * safety buffer. No persistence.
 * @param { DepthCalculatorInput } data - The latitude/longitude to evaluate.
 * @returns { Promise<DepthCalculatorResult> } The computed depth estimate and its inputs.
 */
export async function calculateDepthService(data: DepthCalculatorInput): Promise<DepthCalculatorResult> {

  const nearestWell = await selectNearestMonitoringWell(data.inputLat, data.inputLon)
  const latestWellData = await selectLatestWellData(nearestWell.id)

  const inputAltitude = await fetchElevation(data.inputLat, data.inputLon)
  const altitudeDifference = inputAltitude - nearestWell.altitude
  const depthToWater = latestWellData.depthToWater
  const estimatedDepth = depthToWater + altitudeDifference + 200

  return {
    nearestMonitoringWellId: nearestWell.id,
    estimatedDepth,
    altitudeDifference,
    depthToWater,
    inputAltitude
  }
}
