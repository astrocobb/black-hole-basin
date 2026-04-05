import { z } from 'zod/v4'


/**
 * Zod schema for validating sign-up request bodies.
 * Includes a refinement to ensure both password fields match.
 */
export const SignUpSchema = z
  .object({
    id: z
      .uuidv7({ error: 'Please provide a valid uuid for id.' }),
    email: z
      .email({ error: 'Please provide a valid email address.' })
      .max(128, { error: 'Email address must be less than 128 characters.' }),
    name: z
      .string({ error: 'Please provide a valid name.' })
      .min(1, { error: 'Name must be at least 1 character.' })
      .max(64, { error: 'Name must be less than 64 characters.' }),
    role: z
      .enum([ 'admin', 'user' ])
      .default('user'),
    password: z
      .string({ error: 'Password is required.' })
      .min(8, { error: 'Password cannot be less than 8 characters long.' })
      .max(32, { error: 'Password cannot be over 32 characters long.' }),
    passwordConfirm: z
      .string({ error: 'Password confirmation is required.' })
      .min(8, { error: 'Password cannot be less than 8 characters long.' })
      .max(32, { error: 'Password cannot be over 32 characters long.' })
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
    userId: z
      .uuidv7({ error: 'Please provide a valid user id.' }),
    token: z
      .string({ error: 'Please provide a valid token.' })
      .length(32, { error: 'Token must be 32 characters.' }),
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
    token: z
      .string({ error: 'Activation token is required.' })
      .length(32, { error: 'Please provide a valid activation token.' })
  })

/** TypeScript type inferred from the ActivationRequestSchema. */
export type ActivationRequest = z.infer<typeof ActivationRequestSchema>

/**
 * Zod schema for validating sign-in request bodies.
 */
export const SignInSchema = z
  .object({
    email: z
      .email({ error: 'Please provide a valid email address.' })
      .max(128, { error: 'Email address must be less than 128 characters.' }),
    password: z
      .string({ error: 'Please provide a valid password.' })
      .min(1, { error: 'Password is required.' })
      .max(32, { error: 'Password must be less than 32 characters.' })
  })

/** TypeScript type inferred from the SignInSchema. */
export type SignIn = z.infer<typeof SignInSchema>
