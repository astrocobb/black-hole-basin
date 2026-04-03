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

// POST /api/auth/sign-in - Authenticate a user and create a session
router.route('/sign-in')
  .post(signInController)

// POST /api/auth/sign-up - Register a new user account
router.route('/sign-up')
  .post(signUpController)

// POST /api/auth/activation - Activate a user account via token
router.route('/activation')
  .post(activationController)

export const authRoute = { basePath, router }