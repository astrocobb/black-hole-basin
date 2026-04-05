import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for a MonitoringWell entity.
 */
export const MonitoringWellSchema = z.object({
  id: z
    .uuidv7({ error: 'Please provide a valid uuid for id.' }),
  userId: z
    .uuidv7({ error: 'Please provide a valid uuid for user id.' }),
  locationId: z
    .string({ error: 'Please provide a valid location id.' }),
  locationName: z
    .string({ error: 'Please provide a valid location name.' }),
  geom: z
    .object({
      type: z.literal('Point', { error: 'Geometry type must be Point.' }),
      coordinates: z.tuple([
        z.number({ error: 'Please provide a valid longitude.' }),
        z.number({ error: 'Please provide a valid latitude.' })
      ])
    }),
  stateCode: z
    .string({ error: 'Please provide a valid state code.' }),
  countyName: z
    .string({ error: 'Please provide a valid county name.' }),
  altitude: z
    .coerce
    .number({ error: 'Please provide a valid number for altitude.' }),
  holeDepth: z
    .coerce
    .number({ error: 'Please provide a valid number for hole depth.' }),
  wellDepth: z
    .coerce
    .number({ error: 'Please provide a valid number for well depth.' }),
  dateDrilled: z
    .coerce
    .date({
      error: 'Please provide a valid ISO datetime for date drilled.'
    })
    .optional(),
  createdAt: z
    .coerce
    .date({
      error: 'Please provide a valid date for created at.'
    }),
  updatedAt: z
    .coerce
    .date({
      error: 'Please provide a valid date for updated at.'
    })
})

/** TypeScript type inferred from the MonitoringWellSchema. */
export type MonitoringWell = z.infer<typeof MonitoringWellSchema>

/**
 * Zod schema defining the shape and validation rules for a MonitoringWellInput entity.
 */
export const MonitoringWellInputSchema = MonitoringWellSchema
  .omit({
    createdAt: true,
    updatedAt: true
  })

/** TypeScript type inferred from the MonitoringWellInputSchema. */
export type MonitoringWellInput = z.infer<typeof MonitoringWellInputSchema>