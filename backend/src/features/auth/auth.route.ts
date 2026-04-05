import { Router } from 'express'
import { signInController, signUpController, activationController } from './auth.controller'


/**
 * Auth feature route module.
 * Handles sign-in, sign-up, and account activation endpoints.
 * All routes are public (no auth middleware required).
 */

/** Base path prefix for all auth routes. */
const basePath = '/api/auth' as const

/** Express router with auth endpoint definitions. */
const router = Router()

/** POST /sign-in - User sign-in (public) */
router.route('/sign-in')
  .post(signInController)

/** POST /sign-up - User sign-up (public) */
router.route('/sign-up')
  .post(signUpController)

/** POST /activation - Account activation (public) */
router.route('/activation')
  .post(activationController)

export const authRoute = { basePath, router }