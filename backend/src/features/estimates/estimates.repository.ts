import { type Estimate, EstimateSchema } from './estimates.schema'
import { sql } from '../../lib/db'
import { type MonitoringWell, MonitoringWellSchema } from '../monitoring-wells/monitoring-wells.schema'
import { NotFoundError } from '../../lib/errors'
import { type WellData, WellDataSchema } from '../well-data/well-data.schema'


/**
 * Inserts a new estimate into the database.
 * @param { Estimate } data - The estimate to insert.
 * @returns { void }
 */
export async function insertEstimate(data: Estimate): Promise<void> {

  EstimateSchema.parse(data)

  const {
    id,
    userId,
    userConfigId,
    nearestMonitoringWellId,
    inputLat,
    inputLon,
    waterDemandGpm,
    estimatedDepth,
    altitudeDifference,
    depthToWater,
    casingDiameter,
    screenLength,
    slotSize,
    drillingCost,
    casingCost,
    screenCost,
    gravelPackCost,
    mobilizationCost,
    totalCost
  } = data

  await sql`
    INSERT INTO estimates (
      id,
      user_id,
      user_config_id,
      nearest_monitoring_well_id,
      input_lat,
      input_lon,
      water_demand_gpm,
      estimated_depth,
      altitude_difference,
      depth_to_water,
      casing_diameter,
      screen_length,
      slot_size,
      drilling_cost,
      casing_cost,
      screen_cost,
      gravel_pack_cost,
      mobilization_cost,
      total_cost
    )
    VALUES (
      ${ id },
      ${ userId },
      ${ userConfigId },
      ${ nearestMonitoringWellId },
      ${ inputLat },
      ${ inputLon },
      ${ waterDemandGpm },
      ${ estimatedDepth },
      ${ altitudeDifference },
      ${ depthToWater },
      ${ casingDiameter },
      ${ screenLength },
      ${ slotSize },
      ${ drillingCost },
      ${ casingCost },
      ${ screenCost },
      ${ gravelPackCost },
      ${ mobilizationCost },
      ${ totalCost }
    )
  `
}

/**
 * Selects the nearest monitoring well to the given coordinates.
 * @param { number } lat - The latitude of the coordinates.
 * @param { number }lon - The longitude of the coordinates.
 * @returns { MonitoringWell } The nearest monitoring well.
 */
export async function selectNearestMonitoringWell(lat: number, lon: number): Promise<MonitoringWell> {

  const rowList = await sql`
    SELECT
      id,
      user_id,
      location_id,
      location_name,
      ST_AsGeoJSON(geom)::json AS geom,
      state_code,
      county_name,
      altitude,
      hole_depth,
      well_depth,
      date_drilled,
      created_at,
      updated_at
    FROM
      monitoring_wells
    ORDER BY
      geom::geography <-> ST_SetSRID(ST_MakePoint(${ lon }, ${ lat }), 4326)::geography
    LIMIT 1
  `

  const result = MonitoringWellSchema.array().max(1).parse(rowList)

  if (!result[0]) throw new NotFoundError('No monitoring wells found.')

  return result[0]
}

/**
 * Selects the latest well data for a given monitoring well.
 * @param { string } monitoringWellId - The ID of the monitoring well.
 * @returns { WellData } The latest well data.
 */
export async function selectLatestWellData(monitoringWellId: string): Promise<WellData> {
  const rowList = await sql`
    SELECT
      id,
      monitoring_well_id,
      date_measured,
      depth_to_water,
      created_at
    FROM
      well_data
    WHERE
      monitoring_well_id = ${ monitoringWellId }
    ORDER BY
      date_measured DESC
    LIMIT 1
  `

  const result = WellDataSchema.array().max(1).parse(rowList)
  if (!result[0]) throw new NotFoundError('No well data found for this monitoring well.')
  return result[0]
}

/**
 * Selects an estimate by its ID.
 * @param { string } id - The ID of the estimate to select.
 * @returns { Estimate } The estimate.
 */
export async function selectEstimateById(id: string): Promise<Estimate> {

  const rowList = await sql`
    SELECT
      id,
      user_id,
      user_config_id,
      nearest_monitoring_well_id,
      input_lat,
      input_lon,
      water_demand_gpm,
      estimated_depth,
      altitude_difference,
      depth_to_water,
      casing_diameter,
      screen_length,
      slot_size,
      drilling_cost,
      casing_cost,
      screen_cost,
      gravel_pack_cost,
      mobilization_cost,
      total_cost,
      created_at
    FROM
      estimates
    WHERE
      id = ${ id }`

  const result = EstimateSchema.array().max(1).parse(rowList)

  if (!result[0]) throw new NotFoundError('No estimate found.')

  return result[0]
}

/**
 * Selects all estimates for a given user.
 * @param { string } userId - The ID of the user.
 * @returns { Estimate[] } An array of estimates.
 */
export async function selectEstimatesByUserId(userId: string): Promise<Estimate[]> {

  const rowListArray = await sql`
    SELECT
      id,
      user_id,
      user_config_id,
      nearest_monitoring_well_id,
      input_lat,
      input_lon,
      water_demand_gpm,
      estimated_depth,
      altitude_difference,
      depth_to_water,
      casing_diameter,
      screen_length,
      slot_size,
      drilling_cost,
      casing_cost,
      screen_cost,
      gravel_pack_cost,
      mobilization_cost,
      total_cost,
      created_at
    FROM
      estimates
    WHERE
      user_id = ${ userId }
    ORDER BY
      created_at DESC
  `

  return EstimateSchema.array().parse(rowListArray)
}

/**
 * Deletes an estimate in the database.
 * @param { string } id - The id of the estimate to be deleted.
 * @returns { void }
 */
export async function deleteEstimate(id: string): Promise<void> {
  await sql`
    DELETE
    FROM
      estimates
    WHERE
      id = ${ id }
  `
}