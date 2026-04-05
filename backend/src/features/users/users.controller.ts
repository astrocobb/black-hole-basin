import { type Request, type Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../lib/responses'
import { UserSchema } from './users.schema'
import { getUserById } from './users.service'
import { AppError } from '../../lib/errors'


/**
 * Retrieves a user by their ID. Requires that the requesting user
 * owns the resource (enforced via validUser). Strips sensitive fields
 * (hash, activationToken) before returning user data.
 * @param { Request } request - Express request with the user ID in params.
 * @param { Response } response - Express response for sending the user data or errors.
 * @returns { Promise<void> } Responds with 200 and user data, or 404 if not found.
 */
export async function getUserByIdController(request: Request, response: Response): Promise<void> {

  try {

    // Validate the ID param is a valid UUID v7
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

  } catch (error: any) {
    console.error(error)
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: error.statusCode,
        data: null,
        message: error.message
      })
      return
    }
    serverErrorResponse(response, error.message)
  }
}