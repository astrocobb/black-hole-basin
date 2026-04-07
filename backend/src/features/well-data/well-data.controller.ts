import type { NextFunction, Request, Response } from 'express'
import { WellDataInputSchema, WellDataSchema } from './well-data.schema'
import { zodErrorResponse } from '../../lib/responses'
import {
  deleteWellDataService,
  getWellDataByIdService,
  postWellDataService,
  putWellDataService
} from './well-data.service'


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

    const sessionUserId = request.session.user!.id
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

/**
 * Handles the get request of a well data record.
 * @param { Request } request - Express request containing well data in the params.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function getWellDataByIdController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = WellDataSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const id = parsed.data.id
    const wellData = await getWellDataByIdService(id)

    response.status(200).json({
      status: 200,
      data: wellData,
      message: 'Successfully got well data.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles the update of an existing well data record.
 * @param { Request } request - Express request containing well data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function putWellDataController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsedParams = WellDataInputSchema.pick({ id: true }).safeParse(request.params)
    if (!parsedParams.success) {
      zodErrorResponse(response, parsedParams.error)
      return
    }

    const parsedBody = WellDataInputSchema.safeParse(request.body)
    if (!parsedBody.success) {
      zodErrorResponse(response, parsedBody.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const data = { ...parsedBody.data, id: parsedParams.data.id }
    await putWellDataService(data, sessionUserId)

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully updated well data.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles the deletion of a well data record.
 * @param { Request } request - Express request containing well data in the params.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function deleteWellDataController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = WellDataSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user!.id
    const id = parsed.data.id
    await deleteWellDataService(id, sessionUserId)

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully deleted well data.'
    })

  } catch (error) {
    next(error)
  }
}