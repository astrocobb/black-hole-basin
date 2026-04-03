import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for a User entity.
 * Serves as both the runtime validator and the TypeScript type source.
 */
export const UserSchema = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  activationToken: z.string('Please provide a valid activation token.')
    .length(32, 'User activation token must be 32 characters.')
    .nullable(),
  email: z.string('Please provide a valid email address.')
    .max(128, 'Email address must be less than 128 characters.'),
  hash: z.string('Please provide a valid hash.')
    .length(97, 'Hash address must be 97 characters (argon2).'),
  name: z.string('Please provide a valid name.')
    .min(1, 'Name must be at least 1 character.')
    .max(32, 'Name must be less than 32 characters.'),
  role: z.string('Please provide a valid role.')
    .min(1, 'Role must be at least 1 character.')
    .max(16, 'Role must be less than 16 characters.')
})

/** TypeScript type inferred from the UserSchema. */
export type User = z.infer<typeof UserSchema>