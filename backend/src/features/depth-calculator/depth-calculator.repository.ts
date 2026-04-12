import { sql } from '../../lib/db'
import { type MonitoringWell, MonitoringWellSchema } from '../monitoring-wells/monitoring-wells.schema'
import { type WellData, WellDataSchema } from '../well-data/well-data.schema'
import { NotFoundError } from '../../lib/errors'


/**
 * Selects the nearest monitoring well to the given coordinates via PostGIS
 * geography distance. Read-only — the depth calculator never writes.
 * @param { number } lat - The latitude of the coordinates.
 * @param { number } lon - The longitude of the coordinates.
 * @returns { Promise<MonitoringWell> } The nearest monitoring well.
 * @throws { NotFoundError } When no monitoring wells exist.
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
 * Selects the latest well-data reading for a given monitoring well.
 * @param { string } monitoringWellId - The ID of the monitoring well.
 * @returns { Promise<WellData> } The latest well-data row.
 * @throws { NotFoundError } When the well has no recorded data.
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
