import { sql } from '../../lib/db'
import { type MonitoringWell, MonitoringWellSchema } from './monitoring-wells.schema'


/**
 * Inserts a new monitoring well row into the database.
 * Validates the monitoring well object against MonitoringWellSchema before inserting.
 * @param { MonitoringWell } monitoringWell - The monitoring well object to insert.
 * @returns { Promise<string> } A success confirmation message.
 */
export async function insertMonitoringWell(monitoringWell: MonitoringWell): Promise<string> {

  MonitoringWellSchema.parse(monitoringWell)

  const {
    id,
    userId,
    locationId,
    locationName,
    geom,
    stateCode,
    countyCode,
    altitude,
    holeDepth,
    wellDepth,
    dateDrilled,
    createdAt,
    updatedAt
  } = monitoringWell

  await sql`
    INSERT into monitoring_wells (
      id,
      user_id,
      location_id,
      location_name,
      geom,
      state_code,
      county_code,
      altitude,
      hole_depth,
      well_depth,
      date_drilled,
      created_at,
      updated_at
    )
    values (
      ${ id },
      ${ userId },
      ${ locationId },
      ${ locationName },
      ST_GeomFromGeoJSON(${ JSON.stringify(geom) }),
      ${ stateCode },
      ${ countyCode },
      ${ altitude },
      ${ holeDepth },
      ${ wellDepth },
      ${ dateDrilled },
      ${ createdAt },
      ${ updatedAt }
    )
  `

  return 'Monitoring Well successfully added to the database!'
}

/**
 * Selects a single monitoring well by its unique ID.
 *  { string } id - The UUID v7 of the monitoring well to find.
 *  { Promise<MonitoringWell | null> } The matching monitoring well, or null if not found.
 */
export async function selectMonitoringWellById(id: string): Promise<MonitoringWell | null> {

  const rowList = await sql`
    SELECT
      id,
      user_id,
      location_id,
      location_name,
      geom,
      state_code,
      county_code,
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