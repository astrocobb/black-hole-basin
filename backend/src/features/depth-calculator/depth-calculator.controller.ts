import type { NextFunction, Request, Response } from 'express'
import { DepthCalculatorInputSchema } from './depth-calculator.schema'
import { zodErrorResponse } from '../../lib/responses'
import { calculateDepthService } from './depth-calculator.service'


/**
 * Handles an ephemeral depth-calculation request.
 * @param { Request } request - Express request containing lat/lon in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401 on failure.
 */
export async function postDepthCalculatorController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = DepthCalculatorInputSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const result = await calculateDepthService(parsed.data)

    response.status(200).json({
      status: 200,
      data: result,
      message: 'Successfully calculated depth.'
    })

  } catch (error) {
    next(error)
  }
}
