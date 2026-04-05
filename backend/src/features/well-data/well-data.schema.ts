import { z } from 'zod/v4'

/** Zod schema defining the shape and validation rules for a WellData entity. */
export const WellDataSchema = z.object({
  id: z
    .uuidv7({ error: 'Please provide a valid uuid for id.' }),
  monitoringWellId: z
    .uuidv7({ error: 'Please provide a valid uuid for monitoring well id.' }),
  depthToWater: z
    .number({ error: 'Please provide a valid number for depth to water.' }),
  dateMeasured: z
    .iso.datetime({
      offset: true,
      error: 'Please provide a valid ISO datetime for date measured.'
    }),
  createdAt: z
    .coerce.date({
      error: 'Please provide a valid date for created at.'
    })
})

/** TypeScript type inferred from the WellDataSchema. */
export type WellData = z.infer<typeof WellDataSchema>

/** Zod schema defining the shape and validation rules for a WellDataInput entity. */
export const WellDataInputSchema = WellDataSchema.omit({ createdAt: true })

/** TypeScript type inferred from the WellDataInputSchema. */
export type WellDataInput = z.infer<typeof WellDataInputSchema>