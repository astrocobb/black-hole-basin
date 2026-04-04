import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for a MonitoringWell entity.
 * Serves as both the runtime validator and the TypeScript type source.
 */
export const MonitoringWellSchema = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  userId: z.uuidv7('Please provide a valid uuid for user id.'),
  locationId: z.string('Please provide a valid location id.'),
  locationName: z.string('Please provide a valid location name.'),
  geom: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()])
  }),
  stateCode: z.string('Please provide a valid state code.'),
  countyCode: z.string('Please provide a valid county code.'),
  altitude: z.number('Please provide a valid number for altitude.'),
  holeDepth: z.number('Please provide a valid number for hole depth.'),
  wellDepth: z.number('Please provide a valid number for well depth.'),
  dateDrilled: z.coerce.date('Please provide a valid date for date drilled.'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

/** TypeScript type inferred from the MonitoringWellSchema. */
export type MonitoringWell = z.infer<typeof MonitoringWellSchema>