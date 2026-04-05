import { type Request, type Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../lib/responses'
import { MonitoringWellSchema } from './monitoring-wells.schema'
import { postMonitoringWell } from './monitoring-wells.service'
import { AppError } from '../../lib/errors'


/**
 * Handles the creation of a new monitoring well record.
 * Requires the requesting user to have the "admin" role and to own the resource.
 * Checks for duplicate wells before inserting.
 * @param { Request } request - Express request containing monitoring well data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @returns { Promise<void> } Responds with 201 on success, or 400/401/403/409 on failure.
 */
export async function postMonitoringWellController(request: Request, response: Response): Promise<void> {

  try {

    // Validate the request body against the monitoring well schema
    const parsed = MonitoringWellSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user?.id
    const data = parsed.data
    await postMonitoringWell(data, sessionUserId)

    response.status(201).json({
      status: 201,
      data: null,
      message: 'Successfully created monitoring well.'
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