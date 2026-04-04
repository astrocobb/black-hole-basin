import { Router } from 'express'
import { requireAuth } from '../../middleware/require-auth'
import { getUserByIdController } from './users.controller'


/**
 * Users feature route module.
 * All routes require authentication via the requireAuth middleware.
 */

/** Base path prefix for all user routes. */
const basePath = '/api/users' as const

/** Express router with user endpoint definitions. */
const router = Router()

// GET /api/users/:id - Retrieve a user by their ID (authenticated, owner-only)
router.route('/:id')
  .get(requireAuth, getUserByIdController)

export const usersRoute = { basePath, router }