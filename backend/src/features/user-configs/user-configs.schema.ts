import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for a UserConfig entity.
 * Stores pricing and specification default for well drilling estimates.
 */
export const UserConfigSchema = z.object({
  id: z
    .uuidv7({ error: 'Please provide a valid uuid for id.' }),
  userId: z
    .uuidv7({ error: 'Please provide a valid uuid for user id.' }),
  name: z
    .string({ error: 'Please provide a valid name.' }),
  costPerFoot: z
    .record(z.string(), z.number({ error: 'Casing price must be a number.' }),
      { error: 'Please provide a valid casing prices object.' }),
  mobilizationFee: z
    .number({ error: 'Please provide a valid number for mobilization fee.' })
    .nonnegative({ error: 'Mobilization fee must be zero or positive.' }),
  casingPrices: z
    .record(z.string(), z.number({ error: 'Casing price must be a number.' }),
      { error: 'Please provide a valid casing prices object.' }),
  screenPrices: z
    .record(z.string(), z.number({ error: 'Screen price must be a number.' }),
      { error: 'Please provide a valid screen prices object.' }),
  slotSize: z
    .number({ error: 'Please provide a valid number for slot size.' })
    .positive({ error: 'Slot size must be a positive number.' }),
  gravelPackPrices: z
    .record(z.string(), z.number({ error: 'Gravel pack price must be a number.' }),
      { error: 'Please provide a valid gravel pack prices object.' }),
  createdAt: z
    .coerce.date({ error: 'Please provide a valid date for created at.' }),
  updatedAt: z
    .coerce.date({ error: 'Please provide a valid date for updated at.' })
})

/** TypeScript type inferred from the UserConfigSchema. */
export type UserConfig = z.infer<typeof UserConfigSchema>

/**
 * Zod schema defining the shape and validation rules for a UserConfigInput entity.
 */
export const UserConfigInputSchema = UserConfigSchema
  .omit({
    createdAt: true,
    updatedAt: true
  })

/** TypeScript type inferred from the UserConfigInputSchema. */
export type UserConfigInput = z.infer<typeof UserConfigInputSchema>