import type { NextFunction, Request, Response } from 'express'
import { zodErrorResponse } from '../../lib/responses'
import { MonitoringWellInputSchema, MonitoringWellSchema } from './monitoring-wells.schema'
import {
  deleteMonitoringWellService,
  getMonitoringWellByIdService,
  postMonitoringWellService,
  putMonitoringWellService
} from './monitoring-wells.service'


/**
 * Handles the creation of a new monitoring well record.
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

/**
 * Handles the get request of a monitoring well record.
 * @param { Request } request - Express request containing monitoring well data in the params.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function getMonitoringWellByIdController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = MonitoringWellSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const id = parsed.data.id
    const monitoringWell = await getMonitoringWellByIdService(id)

    response.status(200).json({
      status: 200,
      data: monitoringWell,
      message: 'Successfully retrieved monitoring well.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles the update of an existing monitoring well record.
 * @param { Request } request - Express request containing monitoring well data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function putMonitoringWellController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsedParams = MonitoringWellInputSchema.pick({ id: true }).safeParse(request.params)
    if (!parsedParams.success) {
      zodErrorResponse(response, parsedParams.error)
      return
    }

    const parsedBody = MonitoringWellInputSchema.safeParse(request.body)
    if (!parsedBody.success) {
      zodErrorResponse(response, parsedBody.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const data = { ...parsedBody.data, id: parsedParams.data.id }
    await putMonitoringWellService(data, sessionUserId)

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully updated monitoring well.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles the deletion of a monitoring well record.
 * @param { Request } request - Express request containing monitoring well data in the params.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function deleteMonitoringWellController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = MonitoringWellSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const id = parsed.data.id
    await deleteMonitoringWellService(id, sessionUserId)

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully deleted monitoring well.'
    })

  } catch (error) {
    next(error)
  }
}