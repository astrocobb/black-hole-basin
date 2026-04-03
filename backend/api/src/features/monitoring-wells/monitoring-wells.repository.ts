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

  const { id, userId, dateMeasured, depthToWater, siteNo, waterLevel } = monitoringWell

  await sql `
    INSERT INTO monitoring_wells (
      id,
      user_id,
      date_measured,
      depth_to_water,
      site_no,
      water_level
    )
    VALUES (
      ${ id },
      ${ userId },
      ${ dateMeasured },
      ${ depthToWater },
      ${ siteNo },
      ${ waterLevel }
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

  const rowList = await sql `
    SELECT
      id,
      user_id,
      date_measured,
      depth_to_water,
      site_no,
      water_level
    FROM monitoring_wells
    WHERE id = ${ id }
  `

  // Parse and validate the query result, expecting at most one row
  const result = MonitoringWellSchema.array().max(1).parse(rowList)

  return result[0] ?? null
}