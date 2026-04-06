import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { postUserConfigController } from './user-configs.controller'


/**
 * User configs feature route module.
 */

/** Base path prefix for all user configs routes. */
const basePath = '/api/user-configs' as const

/** Express router with user configs endpoint definitions. */
const router = Router()

/** @POST / - Create a new user config record (authenticated) */
router.route('/')
  .post(requireAuth, postUserConfigController)

export const userConfigsRoute = { basePath, router }