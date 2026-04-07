import type { NextFunction, Request, Response } from 'express'
import { UserConfigInputSchema, UserConfigSchema } from './user-configs.schema'
import { zodErrorResponse } from '../../lib/responses'
import { getUserConfigById, postUserConfig, putUserConfig } from './user-configs.service'


/**
 * Handles the creation of a new user config record.
 * @param { Request } request - Express request containing user config data in the body.
 * @param { Response } response - Express response for sending the result or errors.
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

/**
 * Handles the update of an existing user config record.
 * @param { Request } request - Express request containing user config data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function putUserConfigController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsedParams = UserConfigInputSchema.pick({ id: true }).safeParse(request.params)
    if (!parsedParams.success) {
      zodErrorResponse(response, parsedParams.error)
      return
    }

    const parsedBody = UserConfigInputSchema.safeParse(request.body)
    if (!parsedBody.success) {
      zodErrorResponse(response, parsedBody.error)
      return
    }

    const sessionUserId = request.session.user?.id
    const data = { ...parsedBody.data, id: parsedParams.data.id }
    await putUserConfig(data, sessionUserId)

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully updated user config.'
    })

  } catch (error) {
    next(error)
  }
}

/**
 * Handles the get request of a user config record.
 * @param { Request } request - Express request containing user config data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @param { NextFunction } next - Express next function for error handling.
 * @returns { void } Responds with 200 on success, or 400/401/403 on failure.
 */
export async function getUserConfigByIdController(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {

    const parsed = UserConfigSchema.pick({ id: true }).safeParse(request.params)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const sessionUserId = request.session.user?.id
    const id = parsed.data.id

    const userConfig = await getUserConfigById(id, sessionUserId)

    response.status(200).json({
      status: 200,
      data: userConfig,
      message: 'Successfully got user config.'
    })

  } catch (error) {
    next(error)
  }
}