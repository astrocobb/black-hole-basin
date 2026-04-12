import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import {
  deleteWellDesignController,
  getWellDesignByIdController,
  getWellDesignsByUserIdController,
  postWellDesignController
} from './well-designs.controller'


/**
 * Well-designs feature route module.
 */

/** Base path prefix for all well-designs routes. */
const basePath = '/api/well-designs' as const

/** Express router with well-designs endpoint definitions. */
const router = Router()

/** @POST / - Create a new well design */
/** @GET / - Get all well designs for the session user */
router.route('/')
  .post(requireAuth, postWellDesignController)
  .get(requireAuth, getWellDesignsByUserIdController)

/** @GET /:id - Get a well design by ID */
/** @DELETE /:id - Delete a well design by ID */
router.route('/:id')
  .get(requireAuth, getWellDesignByIdController)
  .delete(requireAuth, deleteWellDesignController)

export const wellDesignsRoute = { basePath, router }
