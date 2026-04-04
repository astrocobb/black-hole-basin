import { z } from 'zod/v4'


/**
 * Zod schema for validating sign-up request bodies.
 * Extends the base UserSchema by replacing `hash` and `activationToken`
 * (server-generated) with `password` and `passwordConfirm` (user-provided).
 * Includes a refinement to ensure both password fields match.
 */
export const SignUpSchema = z
  .object({
    id: z.uuidv7('Please provide a valid uuid for id.'),
    email: z.string('Please provide a valid email address.')
      .max(128, 'Email address must be less than 128 characters.'),
    name: z.string('Please provide a valid name.')
      .min(1, 'Name must be at least 1 character.')
      .max(64, 'Name must be less than 64 characters.'),
    role: z.enum([ 'admin', 'user' ]).default('user'),
    password: z.string('Password confirmation is required')
      .min(8, 'User password cannot be less than 8 characters long.')
      .max(32, 'User password cannot be over than 32 characters long.'),
    passwordConfirm: z.string('Password confirmation is required.')
      .min(8, 'Password cannot be less than 8 characters long.')
      .max(32, 'Password cannot be over than 32 characters long.')
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords do not match!'
  })

/** TypeScript type inferred from the SignUpSchema. */
export type SignUp = z.infer<typeof SignUpSchema>

/**
 * Zod schema for validating user activation tokens.
 */
export const UserActivationSchema = z
  .object({
    userId: z.string('Please provide a valid token.'),
    token: z.string('Please provide a valid token.')
      .length(32, 'Token must be 32 characters.'),
    expiresAt: z.coerce.date(),
    createdAt: z.coerce.date()
  })

/** TypeScript type inferred from the UserActivationSchema. */
export type UserActivation = z.infer<typeof UserActivationSchema>

/**
 * Zod schema for validating activation request bodies.
 */
export const ActivationRequestSchema = z
  .object({
    token: z.string('Activation token is required.')
      .length(32, 'Please provide a valid activation token.')
  })

/** TypeScript type inferred from the ActivationRequestSchema. */
export type ActivationRequest = z.infer<typeof ActivationRequestSchema>

/**
 * Zod schema for validating sign-in request bodies.
 * Extracts only the email and password fields from the SignUpSchema.
 */
export const SignInSchema = z
  .object({
    email: z.string('Please provide a valid email address.')
      .max(128, 'Email address must be less than 128 characters.'),
    password: z.string('Please provide a valid password.')
      .max(32, 'Password must be less than 32 characters.')
  })

/** TypeScript type inferred from the SignInSchema. */
export type SignIn = z.infer<typeof SignInSchema>