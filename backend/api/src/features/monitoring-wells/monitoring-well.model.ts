import { z } from 'zod/v4'
import { sql } from '../../utils/database.utils'


export const MonitoringWellModel = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  userId: z.uuidv7('Please provide a valid uuid for user id.'),
  siteNo: z.number('Please provide a valid number for site no.')
    .max(32, 'Please provide a valid number for site number (max 128 digits).'),
  dateMeasured: z.date('Please provide a valid date and time for time.'),
  depthToWater: z.number('Please provide a valid number for depth to water.')
    .max(32, 'Please provide a valid number for depth to water (max 32 digits).'),
  waterLevel: z.number('Please provide a valid number for water level.')
    .max(32, 'Please provide a valid number for water level (max 32 digits).')
})

export type MonitoringWell = z.infer<typeof MonitoringWellModel>

/**
 *
 * @param monitoringWell to be inserted
 * @returns { Promise<string> } Monitoring Well successfully added to the database!
 */
export async function insertMonitoringWell(monitoringWell: MonitoringWell): Promise<string> {

  MonitoringWellModel.parse(monitoringWell)

  const { id, userId, siteNo, dateMeasured, waterLevel, depthToWater } = monitoringWell

  await sql `
    INSERT INTO monitoring_wells (
      id,
      user_id,
      site_no, 
      date_measured,
      water_level,
      depth_to_water
    )
    VALUES (
      ${ id },
      ${ userId },
      ${ siteNo },
      ${ dateMeasured },
      ${ depthToWater },
      ${ waterLevel }
    )
  `

  return 'Monitoring Well successfully added to the database!'
}