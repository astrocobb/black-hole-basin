import type { NextFunction, Request, Response } from 'express'
import { zodErrorResponse } from '../../lib/responses'
import { UserSchema } from './users.schema'
import { getUserById } from './users.service'


/**
 * Retrieves a user by their ID. Requires that the requesting user
 * owns the resource (enforced via assertOwnership). Strips sensitive fields
 * (hash) before returning user data.
 * @param { Request } request - Express request with the user ID in params.
 * @param { Response } response - Express response for sending the user data or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 and user data, or 404 if not found.
 */
export async function getUserByIdController(request: Request, response: Response, next: NextFunction): Promise<void> {
try {

    const parsed = UserSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user?.id
    const userId = parsed.data.id
    const user = await getUserById(userId, sessionUserId)

    response.status(200).json({
      status: 200,
      data: user,
      message: 'Successfully retrieved user.'
    })

  } catch (error) {
    next(error)
  }
}
