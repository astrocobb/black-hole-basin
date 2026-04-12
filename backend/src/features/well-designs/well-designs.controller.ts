import type { NextFunction, Request, Response } from 'express'
import { WellDesignInputSchema, WellDesignSchema } from './well-designs.schema'
import { zodErrorResponse } from '../../lib/responses'
import {
  deleteWellDesignService,
  getWellDesignByIdService,
  getWellDesignsByUserIdService,
  postWellDesignService
} from './well-designs.service'


/**
 * Handles the creation of a new well design.
 * @param { Request } request - Express request containing well-design input in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 201 on success, or 400/401/403 on failure.
 */
export async function postWellDesignController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = WellDesignInputSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const wellDesign = await postWellDesignService(parsed.data, sessionUserId)

    response.status(201).json({
      status: 201,
      data: wellDesign,
      message: 'Successfully created well design.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles retrieval of a single well design by ID.
 * @param { Request } request - Express request containing the well-design id in the params.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function getWellDesignByIdController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = WellDesignSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const wellDesign = await getWellDesignByIdService(parsed.data.id, sessionUserId)

    response.status(200).json({
      status: 200,
      data: wellDesign,
      message: 'Successfully retrieved well design.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles retrieval of all well designs for the session user.
 * @param { Request } request - Express request.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 401 on failure.
 */
export async function getWellDesignsByUserIdController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const sessionUserId = request.session.user!.id
    const wellDesigns = await getWellDesignsByUserIdService(sessionUserId)

    response.status(200).json({
      status: 200,
      data: wellDesigns,
      message: 'Successfully retrieved well designs.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles deletion of an existing well design.
 * @param { Request } request - Express request containing the well-design id in the params.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 204 on success, or 400/401/403 on failure.
 */
export async function deleteWellDesignController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = WellDesignSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    await deleteWellDesignService(parsed.data.id, sessionUserId)

    response.status(204).end()

  } catch (error) {
    next(error)
  }
}
