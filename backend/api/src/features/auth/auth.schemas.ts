import { z } from 'zod/v4'
import { UserSchema } from '../users/users.schema'


/**
 * Zod schema for validating sign-up request bodies.
 * Extends the base UserSchema by replacing `hash` and `activationToken`
 * (server-generated) with `password` and `passwordConfirm` (user-provided).
 * Includes a refinement to ensure both password fields match.
 */
export const SignUpSchema = UserSchema
  .omit({ hash: true })
  .extend({
    password: z.string('password confirmation is required')
      .min(8, 'User password cannot be less than 8 characters long.')
      .max(32, 'User password cannot be over than 32 characters long.'),
    passwordConfirm: z.string('Password confirmation is required.')
      .min(8, 'Password cannot be less than 8 characters long.')
      .max(32, 'Password cannot be over than 32 characters long.')
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords do not match!'
  })

export const UserActivationSchema = z.object({
  userId: z.string('Please provide a valid token.'),
  token: z.string('Please provide a valid token.')
    .length(32, 'Token must be 32 characters.'),
  expiresAt: z.iso.datetime({ offset: true }),
  createdAt: z.iso.datetime({ offset: true })
})

export type UserActivation = z.infer<typeof UserActivationSchema>