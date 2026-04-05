import { sql } from '../../lib/db'
import {
  type MonitoringWell,
  type MonitoringWellInput,
  MonitoringWellSchema,
  MonitoringWellInputSchema
} from './monitoring-wells.schema'


/**
 * Inserts a new monitoring well row into the database.
 * Validates the monitoring well object against MonitoringWellInputSchema before inserting.
 * @param { MonitoringWellInput } data - The monitoring well object to insert.
 * @returns { Promise<void> }
 */
export async function insertMonitoringWell(data: MonitoringWellInput): Promise<void> {

  MonitoringWellInputSchema.parse(data)

  const {
    id,
    userId,
    locationId,
    locationName,
    geom,
    stateCode,
    countyName,
    altitude,
    holeDepth,
    wellDepth,
    dateDrilled
  } = data

  await sql`
    INSERT into monitoring_wells (
      id,
      user_id,
      location_id,
      location_name,
      geom,
      state_code,
      county_name,
      altitude,
      hole_depth,
      well_depth,
      date_drilled
    )
    values (
      ${ id },
      ${ userId },
      ${ locationId },
      ${ locationName },
      ST_GeomFromGeoJSON(${ JSON.stringify(geom) }),
      ${ stateCode },
      ${ countyName },
      ${ altitude },
      ${ holeDepth },
      ${ wellDepth },
      ${ dateDrilled ?? null }
    )
  `
}

/**
 * Selects a single monitoring well by its unique ID.
 * @param { string } id - The UUID v7 of the monitoring well to find.
 * @returns { Promise<MonitoringWell | null> } The matching monitoring well, or null if not found.
 */
export async function selectMonitoringWellById(id: string): Promise<MonitoringWell | null> {

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
    WHERE
      id = ${ id }
  `

  // Parse and validate the query result, expecting at most one row
  const result = MonitoringWellSchema.array().max(1).parse(rowList)

  return result[0] ?? null
}