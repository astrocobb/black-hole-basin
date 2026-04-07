import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import {
  postWellDataController,
  getWellDataByIdController,
  putWellDataController,
  deleteWellDataController
} from './well-data.controller'


/**
 * Well data feature route module.
 */

/** Base path prefix for all well data routes. */
const basePath = '/api/well-data' as const

/** Express router with well data endpoint definitions. */
const router = Router()

/** @POST / - Create a new well data record (authenticated) */
router.route('/')
  .post(requireAuth, postWellDataController)

/** @GET /:id - Get a well data record by ID */
/** @PUT /:id - Update an existing well data record (authenticated) */
/** @DELETE /:id - Delete a well data record (authenticated) */
router.route('/:id')
  .get(requireAuth, getWellDataByIdController)
  .put(requireAuth, putWellDataController)
  .delete(requireAuth, deleteWellDataController)

export const wellDataRoute = { basePath, router }