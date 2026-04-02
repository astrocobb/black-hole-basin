import { z } from 'zod/v4'
import { sql } from '../../utils/database.utils'
import { UserSchema } from '../users/user.model'


export const MonitoringWellSchema = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  userId: z.uuidv7('Please provide a valid uuid for user id.'),
  dateMeasured: z.iso.datetime({ offset: true }),
  depthToWater: z.coerce.number('Please provide a valid number for depth to water.'),
  siteNo: z.coerce.number('Please provide a valid number for site no.'),
  waterLevel: z.coerce.number('Please provide a valid number for water level.')
})

export type MonitoringWell = z.infer<typeof MonitoringWellSchema>

/**
 *
 * @param monitoringWell to be inserted
 * @returns { Promise<string> } Monitoring Well successfully added to the database!
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

  const result = MonitoringWellSchema.array().max(1).parse(rowList)

  return result[0] ?? null
}