import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { postMonitoringWellController } from './monitoring-wells.controller'


/**
 * Monitoring wells feature route module.
 * All routes require authentication via the requireAuth middleware.
 */

/** Base path prefix for all monitoring well routes. */
const basePath = '/api/monitoring-wells' as const

/** Express router with monitoring well endpoint definitions. */
const router = Router()

/** POST / - Create a new monitoring well (authenticated) */
router.route('/')
  .post(requireAuth, postMonitoringWellController)

export const monitoringWellsRoute = { basePath, router }