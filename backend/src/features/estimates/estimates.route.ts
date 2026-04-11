import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import {
  deleteEstimateController,
  getEstimateByIdController,
  getEstimatesByUserIdController,
  postEstimateController
} from './estimates.controller'


/**
 * Estimates feature route module.
 */

/** Base path prefix for all estimates routes. */
const basePath = '/api/estimates' as const

/** Express router with estimates endpoint definitions. */
const router = Router()

/** @POST / - Create a new estimate */
/** @GET / - Get all estimates for the session user */
router.route('/')
  .post(requireAuth, postEstimateController)
  .get(requireAuth, getEstimatesByUserIdController)

/** @GET /:id - Get an estimate by ID */
/** @DELETE /:id - Delete an estimate by ID */
router.route('/:id')
  .get(requireAuth, getEstimateByIdController)
  .delete(requireAuth, deleteEstimateController)

export const estimatesRoute = { basePath, router }