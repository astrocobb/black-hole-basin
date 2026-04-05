import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for estimate request input.
 * Contains the user-provided location and water demand data.
 */
export const EstimateInputSchema = z.object({
  clientConfigId: z
    .uuidv7({ error: 'Please provide a valid uuid for client config id.' }),
  lat: z
    .number({ error: 'Please provide a valid number for latitude.' })
    .min(-90, { error: 'Latitude must be between -90 and 90.' })
    .max(90, { error: 'Latitude must be between -90 and 90.' }),
  lon: z
    .number({ error: 'Please provide a valid number for longitude.' })
    .min(-180, { error: 'Longitude must be between -180 and 180.' })
    .max(180, { error: 'Longitude must be between -180 and 180.' }),
  waterDemandGpm: z
    .number({ error: 'Please provide a valid number for water demand.' })
    .positive({ error: 'Water demand must be a positive number.' })
})

/** TypeScript type inferred from the EstimateInputSchema. */
export type EstimateInput = z.infer<typeof EstimateInputSchema>

/**
 * Zod schema defining the shape and validation rules for estimate calculation results.
 * Contains the computed well specifications and cost breakdown.
 */
export const EstimateResultSchema = z.object({
  nearestMonitoringWellId: z
    .uuidv7({ error: 'Please provide a valid uuid for nearest monitoring well id.' }),
  estimatedDepth: z
    .number({ error: 'Please provide a valid number for estimated depth.' }),
  altitudeDifference: z
    .number({ error: 'Please provide a valid number for altitude difference.' }),
  depthToWater: z
    .number({ error: 'Please provide a valid number for depth to water.' }),
  casingDiameter: z
    .number({ error: 'Please provide a valid number for casing diameter.' }),
  screenLength: z
    .number({ error: 'Please provide a valid number for screen length.' }),
  slotSize: z
    .number({ error: 'Please provide a valid number for slot size.' }),
  drillingCost: z
    .number({ error: 'Please provide a valid number for drilling cost.' }),
  screenCost: z
    .number({ error: 'Please provide a valid number for screen cost.' }),
  gravelPackCost: z
    .number({ error: 'Please provide a valid number for gravel pack cost.' }),
  mobilizationCost: z
    .number({ error: 'Please provide a valid number for mobilization cost.' }),
  totalCost: z
    .number({ error: 'Please provide a valid number for total cost.' })
})

/** TypeScript type inferred from the EstimateResultSchema. */
export type EstimateResult = z.infer<typeof EstimateResultSchema>

/**
 * Zod schema defining the shape and validation rules for a persisted Estimate entity.
 * Combines input, result, and metadata fields.
 */
export const EstimateSchema = EstimateInputSchema
  .extend(EstimateResultSchema.shape)
  .extend({
    id: z
      .uuidv7({ error: 'Please provide a valid uuid for id.' }),
    userId: z
      .uuidv7({ error: 'Please provide a valid uuid for user id.' }),
    createdAt: z
      .coerce.date({ error: 'Please provide a valid date for created at.' })
  })

/** TypeScript type inferred from the EstimateSchema. */
export type Estimate = z.infer<typeof EstimateSchema>