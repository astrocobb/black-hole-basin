import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { postDepthCalculatorController } from './depth-calculator.controller'


/**
 * Depth calculator feature route module.
 */

/** Base path prefix for all depth-calculator routes. */
const basePath = '/api/depth-calculator' as const

/** Express router with depth-calculator endpoint definitions. */
const router = Router()

/** @POST / - Calculate an ephemeral well-depth estimate for a location */
router.route('/')
  .post(requireAuth, postDepthCalculatorController)

export const depthCalculatorRoute = { basePath, router }
