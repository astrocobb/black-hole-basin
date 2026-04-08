import type { NextFunction, Request, Response } from 'express'
import { EstimateInputSchema, EstimateSchema } from './estimates.schema'
import { zodErrorResponse } from '../../lib/responses'
import { getEstimateByIdService, postEstimateService } from './estimates.service'


/**
 * Handles the creation of a new estimate record.
 * @param { Request } request - Express request containing estimate data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 201 on success, or 400/401/403 on failure.
 */
export async function postEstimateController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = EstimateInputSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const data = parsed.data
    const estimate = await postEstimateService(data, sessionUserId)

    response.status(201).json({
      status: 201,
      data: estimate,
      message: 'Successfully created estimate.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles the get request of an estimate record.
 * @param { Request } request - Express request containing estimate id in the params.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function getEstimateByIdController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = EstimateSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const id = parsed.data.id
    const estimate = await getEstimateByIdService(id, sessionUserId)

    response.status(200).json({
      status: 200,
      data: estimate,
      message: 'Successfully got estimate.'
    })

  } catch (error) {
    next(error)
  }
}