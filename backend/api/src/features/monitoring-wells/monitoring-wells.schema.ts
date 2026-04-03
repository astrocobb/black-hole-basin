import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for a MonitoringWell entity.
 * Serves as both the runtime validator and the TypeScript type source.
 */
export const MonitoringWellSchema = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  userId: z.uuidv7('Please provide a valid uuid for user id.'),
  dateMeasured: z.iso.datetime({ offset: true }),
  depthToWater: z.coerce.number('Please provide a valid number for depth to water.'),
  siteNo: z.coerce.number('Please provide a valid number for site no.'),
  waterLevel: z.coerce.number('Please provide a valid number for water level.')
})

/** TypeScript type inferred from the MonitoringWellSchema. */
export type MonitoringWell = z.infer<typeof MonitoringWellSchema>