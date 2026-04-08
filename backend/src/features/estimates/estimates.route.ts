import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { getEstimateByIdController, postEstimateController } from './estimates.controller'


/**
 * Estimates feature route module.
 */

/** Base path prefix for all estimates routes. */
const basePath = '/api/estimates' as const

/** Express router with estimates endpoint definitions. */
const router = Router()

/** @POST / - Create a new estimate */
router.route('/')
  .post(requireAuth, postEstimateController)

/** @GET /:id - Get an estimate by ID */
router.route('/:id')
  .get(requireAuth, getEstimateByIdController)

export const estimatesRoute = { basePath, router }