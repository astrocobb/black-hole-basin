import { type Request, type Response } from 'express'
import { validUser } from '../../lib/auth'
import { serverErrorResponse, zodErrorResponse } from '../../lib/response'
import { type User, UserSchema } from './users.schema'
import { selectUserById } from './users.repository'


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
    const validationResult = UserSchema.pick({ id: true }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { id } = validationResult.data

    // Ensure the requesting user owns this resource
    if (!validUser(request, response, id)) return

    const user: User | null = await selectUserById(id)
    if (!user) {
      response.status(404).json({
        status: 404,
        data: null,
        message: 'Get user failed. User not found.'
      })
      return
    }

    // Strip sensitive fields before sending to the client
    const { hash, ...safeUser } = user

    response.status(200).json({
      status: 200,
      data: safeUser,
      message: 'Successfully retrieved user.'
    })

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}