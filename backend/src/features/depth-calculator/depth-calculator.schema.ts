import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for depth calculator input.
 * The calculator is ephemeral — it accepts only a location and returns a computed
 * depth estimate without persisting anything.
 */
export const DepthCalculatorInputSchema = z.object({
  inputLat: z
    .coerce
    .number({ error: 'Please provide a valid number for latitude.' })
    .min(-90, { error: 'Latitude must be between -90 and 90.' })
    .max(90, { error: 'Latitude must be between -90 and 90.' }),
  inputLon: z
    .coerce
    .number({ error: 'Please provide a valid number for longitude.' })
    .min(-180, { error: 'Longitude must be between -180 and 180.' })
    .max(180, { error: 'Longitude must be between -180 and 180.' })
})

/** TypeScript type inferred from the DepthCalculatorInputSchema. */
export type DepthCalculatorInput = z.infer<typeof DepthCalculatorInputSchema>

/**
 * Zod schema defining the shape and validation rules for depth calculator output.
 * Contains the estimated depth plus the intermediate values a well-design flow
 * needs when the calculator was used to derive the depth.
 */
export const DepthCalculatorResultSchema = z.object({
  nearestMonitoringWellId: z
    .uuidv7({ error: 'Please provide a valid uuid for nearest monitoring well id.' }),
  estimatedDepth: z
    .coerce
    .number({ error: 'Please provide a valid number for estimated depth.' }),
  altitudeDifference: z
    .coerce
    .number({ error: 'Please provide a valid number for altitude difference.' }),
  depthToWater: z
    .coerce
    .number({ error: 'Please provide a valid number for depth to water.' }),
  inputAltitude: z
    .coerce
    .number({ error: 'Please provide a valid number for input altitude.' })
})

/** TypeScript type inferred from the DepthCalculatorResultSchema. */
export type DepthCalculatorResult = z.infer<typeof DepthCalculatorResultSchema>
