import type { Response } from 'express'
import type { Status } from '../types/Status'
import type { ZodError } from 'zod/v4'


/**
 * Creates a standardized status object for API responses.
 * @param { number } status - HTTP status code.
 * @param { unknown } data - Response payload to send back to the client.
 * @param { string | null } message - Human-readable message describing the result.
 * @returns { Status } A formatted status object with { status, data, message }.
 */
export function createStatus(status: number, data: unknown, message: string | null): Status {
  return { status, data, message }
}

/**
 * Sends a 400 response for Zod validation errors.
 * Extracts the first issue message from the ZodError for a user-friendly response.
 * @param { Response } response - The Express response object.
 * @param { ZodError } error - The Zod validation error containing issue details.
 * @returns { Response<Status> } The error response sent to the client.
 */
export function zodErrorResponse(response: Response, error: ZodError): Response<Status> {

  // Default message, overridden by the first validation issue if available
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
 * Sends an error response with the given status code and message.
 * @param { Response } response - The Express response object.
 * @param { Status } status - The status object containing code, data, and message.
 * @returns { Response<Status> } The error response sent to the client.
 */
export function errorResponse(response: Response, status: Status): Response<Status> {
  return response.status(status.status).json(status)
}

/**
 * Sends a generic 500 internal server error response.
 * Used as a catch-all for unexpected errors in controller try/catch blocks.
 * @param { Response } response - The Express response object.
 * @param { unknown } defaultValue - Optional fallback data to include in the response (defaults to null).
 * @returns { Response<Status> } The 500 error response sent to the client.
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
