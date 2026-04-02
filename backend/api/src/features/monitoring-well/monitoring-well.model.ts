import { z } from 'zod/v4'
import { sql } from '../../utils/database.utils'


export const MonitoringWellSchema = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  depthToWater: z.number('Please provide a valid number for depth to water.')
    .max(32, 'Please provide a valid number for depth to water (max 32 digits).'),
  siteNo: z.number('Please provide a valid number for site no.')
    .max(32, 'Please provide a valid number for site number (max 128 digits).'),
  time: z.date('Please provide a valid date and time for time.'),
  waterLevel: z.number('Please provide a valid number for water level.')
    .max(32, 'Please provide a valid number for water level (max 32 digits).')
})

export type MonitoringWell = z.infer<typeof MonitoringWellSchema>

/**
 *
 * @param monitoringWell to be inserted
 * @returns { Promise<string> } Monitoring Well successfully added to the database!
 */
export async function insertMonitoringWell(monitoringWell: MonitoringWell): Promise<string> {

  MonitoringWellSchema.parse(monitoringWell)

  const { id, depthToWater, siteNo, time, waterLevel } = monitoringWell

  await sql `
    INSERT INTO monitoring_wells (
      id, 
      site_no, 
      time, 
      depth_to_water, 
      water_level
    ) 
    VALUES (
      ${ id },
      ${ depthToWater },
      ${ siteNo },
      ${ time },
      ${ waterLevel }
    ) 
  `

  return 'Monitoring Well successfully added to the database!'
}