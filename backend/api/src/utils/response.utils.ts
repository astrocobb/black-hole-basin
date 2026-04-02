import type { Response } from 'express'
import type { Status } from './interfaces/Status'
import type { ZodError } from 'zod/v4'


/**
 * Factory function that creates a status object to send back to the client
 * @param status is an integer representing the status code
 * @param data to send back to the client
 * @param message info about the status
 */
export function createStatus(status: number, data: unknown, message: string | null): Status {
  return { status, data, message }
}

/**
 * Helper function that sends an error response when a zod validation error occurs
 * @param response an object modeling the response that will be sent to the client.
 * @param error an object containing the errors from zod validation
 */
export function zodErrorResponse(response: Response, error: ZodError) {

  let message = 'validation error occurred'
  if (error.issues[0]) {
    message = error.issues[0].message
  }

  return errorResponse(
    response,
    createStatus(
      400,
      null,
      message
    )
  )
}

/**
 * Helper function that sends an error response when an error occurs
 * @param response
 * @param status
 */
export function errorResponse(response: Response, status: Status): Response<Status> {
  return response.status(status.status).json(status)
}

/**
 * Helper function that sends an error response when a server error occurs
 * @param response an object modeling the response that will be sent to the client
 * @param defaultValue default value to send back to the client to help with rendering when an error occurs
 */
export function serverErrorResponse(response: Response, defaultValue: unknown = null): Response<Status> {
  return errorResponse(
    response,
    createStatus(
      500,
      defaultValue,
      'An internal server error occurred. Please try again.'
    )
  )
}