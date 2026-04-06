import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { postWellDataController } from './well-data.controller'


/**
 * Well data feature route module.
 * All routes require authentication via the requireAuth middleware.
 */

/** Base path prefix for all well data routes. */
const basePath = '/api/well-data' as const

/** Express router with well data endpoint definitions. */
const router = Router()

/** @POST / - Create a new well data record (authenticated) */
router.route('/')
  .post(requireAuth, postWellDataController)

export const wellDataRoute = { basePath, router }