import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for a well-design request.
 * A caller must supply either a precomputed `estimatedDepth` OR a location
 * (`inputLat` + `inputLon`). The service uses the depth calculator internally
 * when a location is supplied.
 */
export const WellDesignInputSchema = z.object({
  userConfigId: z
    .uuidv7({ error: 'Please provide a valid uuid for user config id.' }),
  inputLat: z
    .coerce
    .number({ error: 'Please provide a valid number for latitude.' })
    .min(-90, { error: 'Latitude must be between -90 and 90.' })
    .max(90, { error: 'Latitude must be between -90 and 90.' })
    .optional(),
  inputLon: z
    .coerce
    .number({ error: 'Please provide a valid number for longitude.' })
    .min(-180, { error: 'Longitude must be between -180 and 180.' })
    .max(180, { error: 'Longitude must be between -180 and 180.' })
    .optional(),
  estimatedDepth: z
    .coerce
    .number({ error: 'Please provide a valid number for estimated depth.' })
    .positive({ error: 'Estimated depth must be a positive number.' })
    .optional(),
  waterDemandGpm: z
    .coerce
    .number({ error: 'Please provide a valid number for water demand.' })
    .positive({ error: 'Water demand must be a positive number.' })
}).superRefine((data, ctx) => {
  const hasCoords = data.inputLat != null && data.inputLon != null
  const hasDepth = data.estimatedDepth != null

  if (hasCoords && hasDepth) {
    ctx.addIssue({
      code: 'custom',
      message: 'Provide either a location or an estimated depth, not both.',
      path: [ 'estimatedDepth' ]
    })
  }
  if (!hasCoords && !hasDepth) {
    ctx.addIssue({
      code: 'custom',
      message: 'Provide either a location (inputLat + inputLon) or an estimated depth.',
      path: [ 'estimatedDepth' ]
    })
  }
  if ((data.inputLat == null) !== (data.inputLon == null)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Both latitude and longitude must be provided together.',
      path: [ 'inputLon' ]
    })
  }
})

/** TypeScript type inferred from the WellDesignInputSchema. */
export type WellDesignInput = z.infer<typeof WellDesignInputSchema>

/**
 * Zod schema defining the shape and validation rules for well-design results.
 * Contains the computed well specifications and cost breakdown. Fields tied
 * to the depth-calculation path (`nearestMonitoringWellId`, `altitudeDifference`,
 * `depthToWater`) are nullable because a caller may have supplied a
 * precomputed depth without invoking the calculator.
 */
export const WellDesignResultSchema = z.object({
  nearestMonitoringWellId: z
    .uuidv7({ error: 'Please provide a valid uuid for nearest monitoring well id.' })
    .nullable(),
  estimatedDepth: z
    .coerce
    .number({ error: 'Please provide a valid number for estimated depth.' }),
  altitudeDifference: z
    .coerce
    .number({ error: 'Please provide a valid number for altitude difference.' })
    .nullable(),
  depthToWater: z
    .coerce
    .number({ error: 'Please provide a valid number for depth to water.' })
    .nullable(),
  casingDiameter: z
    .coerce
    .number({ error: 'Please provide a valid number for casing diameter.' }),
  screenLength: z
    .coerce
    .number({ error: 'Please provide a valid number for screen length.' }),
  slotSize: z
    .coerce
    .number({ error: 'Please provide a valid number for slot size.' }),
  drillingCost: z
    .coerce
    .number({ error: 'Please provide a valid number for drilling cost.' }),
  casingCost: z
    .coerce
    .number({ error: 'Please provide a valid number for casing cost.' }),
  screenCost: z
    .coerce
    .number({ error: 'Please provide a valid number for screen cost.' }),
  gravelPackCost: z
    .coerce
    .number({ error: 'Please provide a valid number for gravel pack cost.' }),
  mobilizationCost: z
    .coerce
    .number({ error: 'Please provide a valid number for mobilization cost.' }),
  totalCost: z
    .coerce
    .number({ error: 'Please provide a valid number for total cost.' })
})

/** TypeScript type inferred from the WellDesignResultSchema. */
export type WellDesignResult = z.infer<typeof WellDesignResultSchema>

/**
 * Zod schema defining the shape of a persisted well-design entity.
 * Combines the optional input fields, the result fields, and metadata.
 */
export const WellDesignSchema = z.object({
  id: z
    .uuidv7({ error: 'Please provide a valid uuid for id.' }),
  userId: z
    .uuidv7({ error: 'Please provide a valid uuid for user id.' }),
  userConfigId: z
    .uuidv7({ error: 'Please provide a valid uuid for user config id.' }),
  nearestMonitoringWellId: z
    .uuidv7({ error: 'Please provide a valid uuid for nearest monitoring well id.' })
    .nullable(),
  inputLat: z
    .coerce
    .number({ error: 'Please provide a valid number for latitude.' })
    .nullable(),
  inputLon: z
    .coerce
    .number({ error: 'Please provide a valid number for longitude.' })
    .nullable(),
  waterDemandGpm: z
    .coerce
    .number({ error: 'Please provide a valid number for water demand.' }),
  estimatedDepth: z
    .coerce
    .number({ error: 'Please provide a valid number for estimated depth.' }),
  altitudeDifference: z
    .coerce
    .number({ error: 'Please provide a valid number for altitude difference.' })
    .nullable(),
  depthToWater: z
    .coerce
    .number({ error: 'Please provide a valid number for depth to water.' })
    .nullable(),
  casingDiameter: z
    .coerce
    .number({ error: 'Please provide a valid number for casing diameter.' }),
  screenLength: z
    .coerce
    .number({ error: 'Please provide a valid number for screen length.' }),
  slotSize: z
    .coerce
    .number({ error: 'Please provide a valid number for slot size.' }),
  drillingCost: z
    .coerce
    .number({ error: 'Please provide a valid number for drilling cost.' }),
  casingCost: z
    .coerce
    .number({ error: 'Please provide a valid number for casing cost.' }),
  screenCost: z
    .coerce
    .number({ error: 'Please provide a valid number for screen cost.' }),
  gravelPackCost: z
    .coerce
    .number({ error: 'Please provide a valid number for gravel pack cost.' }),
  mobilizationCost: z
    .coerce
    .number({ error: 'Please provide a valid number for mobilization cost.' }),
  totalCost: z
    .coerce
    .number({ error: 'Please provide a valid number for total cost.' }),
  createdAt: z
    .coerce
    .date({ error: 'Please provide a valid date for created at.' })
})

/** TypeScript type inferred from the WellDesignSchema. */
export type WellDesign = z.infer<typeof WellDesignSchema>
