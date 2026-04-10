import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import {
  getUserConfigsByUserIdController,
  postUserConfigController,
  getUserConfigByIdController,
  putUserConfigController,
  deleteUserConfigController
} from './user-configs.controller'


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

/** @GET /userId/:userId - Get all user configs for a user */
router.route('/userId/:userId')
  .get(requireAuth, getUserConfigsByUserIdController)

/** @GET /:id - Get a user config record by ID (authenticated) */
/** @PUT /:id - Update an existing user config record (authenticated) */
/** @DELETE /:id - Delete a user config record by ID (authenticated) */
router.route('/:id')
  .get(requireAuth, getUserConfigByIdController)
  .put(requireAuth, putUserConfigController)
  .delete(requireAuth, deleteUserConfigController)

export const userConfigsRoute = { basePath, router }