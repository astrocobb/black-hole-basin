import { type WellData, type WellDataInput, WellDataInputSchema, WellDataSchema } from './well-data.schema'
import { sql } from '../../lib/db'


/**
 * Inserts a new well data record into the database.
 * Validates the well data object against WellDataInputSchema before inserting.
 * @param { WellDataInput } data - The well data object to insert.
 * @returns { Promise<void> }
 */
export async function insertWellData(data: WellDataInput): Promise<void> {

  WellDataInputSchema.parse(data)

  const { id, monitoringWellId, dateMeasured, depthToWater } = data

  await sql`
    INSERT into public.monitoring_well_data (
      id,
      monitoring_well_id,
      date_measured,
      depth_to_water
    )
    values (
      ${ id },
      ${ monitoringWellId },
      ${ dateMeasured },
      ${ depthToWater }
    )
  `
}

/**
 * Selects a single well data record by its unique ID.
 * @param { string } id - The UUID v7 of the well data record to find.
 * @returns { Promise<WellData | null> } The matching well data record, or null if not found.
 */
export async function selectWellDataById(id: string): Promise<WellData | null> {

  const rowList = await sql`
    SELECT
      id,
      monitoring_well_id,
      date_measured,
      depth_to_water,
      created_at
    FROM
      monitoring_well_data
    WHERE
      id = ${ id }
  `

  const result = WellDataSchema.array().max(1).parse(rowList)


  return result[0] ?? null
}