import type { NextFunction, Request, Response } from 'express'
import { WellDataInputSchema } from './well-data.schema'
import { zodErrorResponse } from '../../lib/responses'
import { postWellDataService } from './well-data.service'


/**
 * Handles the creation of a new well data record.
 * @param { Request } request - Express request containing well data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 201 on success, or 400/401/403 on failure.
 */
export async function postWellDataController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = WellDataInputSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user?.id
    const data = parsed.data
    await postWellDataService(data, sessionUserId)

    response.status(201).json({
      status: 201,
      data: null,
      message: 'Successfully created well data.'
    })

  } catch (error) {
    next(error)
  }
}