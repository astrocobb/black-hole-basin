import type { NextFunction, Request, Response } from 'express'
import { zodErrorResponse } from '../../lib/responses'
import { MonitoringWellInputSchema } from './monitoring-wells.schema'
import { postMonitoringWellService } from './monitoring-wells.service'


/**
 * Handles the creation of a new monitoring well record.
 * Requires the requesting user to have the "admin" role and to own the resource.
 * Checks for duplicate wells before inserting.
 * @param { Request } request - Express request containing monitoring well data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 201 on success, or 400/401/403/409 on failure.
 */
export async function postMonitoringWellController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = MonitoringWellInputSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const data = parsed.data
    await postMonitoringWellService(data, sessionUserId)

    response.status(201).json({
      status: 201,
      data: null,
      message: 'Successfully created monitoring well.'
    })

  } catch (error) {
    next(error)
  }
}
