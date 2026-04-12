import { type WellDesign, WellDesignSchema } from './well-designs.schema'
import { sql } from '../../lib/db'
import { NotFoundError } from '../../lib/errors'


/**
 * Inserts a new well-design row.
 * @param { WellDesign } data - The well design to insert.
 * @returns { Promise<void> }
 */
export async function insertWellDesign(data: WellDesign): Promise<void> {

  WellDesignSchema.parse(data)

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
    INSERT INTO well_designs (
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
 * Selects a well design by its ID.
 * @param { string } id - The ID of the well design to select.
 * @returns { Promise<WellDesign> } The well design.
 * @throws { NotFoundError } When no well design matches the ID.
 */
export async function selectWellDesignById(id: string): Promise<WellDesign> {

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
      well_designs
    WHERE
      id = ${ id }`

  const result = WellDesignSchema.array().max(1).parse(rowList)

  if (!result[0]) throw new NotFoundError('No well design found.')

  return result[0]
}

/**
 * Selects all well designs for a given user, newest first.
 * @param { string } userId - The ID of the user.
 * @returns { Promise<WellDesign[]> } An array of well designs.
 */
export async function selectWellDesignsByUserId(userId: string): Promise<WellDesign[]> {

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
      well_designs
    WHERE
      user_id = ${ userId }
    ORDER BY
      created_at DESC
  `

  return WellDesignSchema.array().parse(rowListArray)
}

/**
 * Deletes a well design by its ID.
 * @param { string } id - The id of the well design to be deleted.
 * @returns { Promise<void> }
 */
export async function deleteWellDesign(id: string): Promise<void> {
  await sql`
    DELETE
    FROM
      well_designs
    WHERE
      id = ${ id }
  `
}
