import { z } from 'zod/v4'


/**
 * Zod schema defining the shape and validation rules for a User entity.
 * Serves as both the runtime validator and the TypeScript type source.
 */
export const UserSchema = z.object({
  id: z
    .uuidv7({ error: 'Please provide a valid uuid for id.' }),
  email: z
    .email({ error: 'Please provide a valid email address.' })
    .max(128, { error: 'Email address must be less than 128 characters.' }),
  hash: z
    .string({ error: 'Please provide a valid hash.' })
    .length(97, { error: 'Hash must be 97 characters (argon2).' }),
  name: z
    .string({ error: 'Please provide a valid name.' })
    .min(1, { error: 'Name must be at least 1 character.' })
    .max(64, { error: 'Name must be less than 64 characters.' }),
  role: z
    .enum([ 'admin', 'user' ])
    .default('user')
})

/** TypeScript type inferred from the UserSchema. */
export type User = z.infer<typeof UserSchema>

/** TypeScript type for a User without the hash field. */
export type SafeUser = Omit<User, 'hash'>

export type UserSignUp = Omit<User, 'role'>