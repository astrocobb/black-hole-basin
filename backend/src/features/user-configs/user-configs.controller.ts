import type { NextFunction, Request, Response } from 'express'
import { UserConfigInputSchema } from './user-configs.schema'
import { zodErrorResponse } from '../../lib/responses'
import { postUserConfig } from './user-configs.service'


/**
 * Handles the creation of a new user config record.
 * @param { Request } request - Express request containing user config data in the body.
 * @param { Request } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 201 on success, or 400/401/403 on failure.
 */
export async function postUserConfigController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = UserConfigInputSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user?.id
    const data = parsed.data
    await postUserConfig(data, sessionUserId)

    response.status(201).json({
      status: 201,
      data: null,
      message: 'Successfully created user config.'
    })

  } catch (error) {
    next(error)
  }
}