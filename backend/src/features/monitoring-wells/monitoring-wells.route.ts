import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import {
  postMonitoringWellController,
  getMonitoringWellByIdController,
  putMonitoringWellController,
  deleteMonitoringWellController,
} from './monitoring-wells.controller'


/**
 * Monitoring wells feature route module.
 */

/** Base path prefix for all monitoring well routes. */
const basePath = '/api/monitoring-wells' as const

/** Express router with monitoring well endpoint definitions. */
const router = Router()

/** @POST / - Create a new monitoring well (authenticated) */
router.route('/')
  .post(requireAuth, postMonitoringWellController)

/** @GET /:id - Get a monitoring well by ID */
/** @PUT /:id - Update an existing monitoring well (authenticated) */
/** @DELETE /:id - Delete a monitoring well (authenticated) */
router.route('/:id')
  .get(requireAuth, getMonitoringWellByIdController)
  .put(requireAuth, putMonitoringWellController)
  .delete(requireAuth, deleteMonitoringWellController)

export const monitoringWellsRoute = { basePath, router }