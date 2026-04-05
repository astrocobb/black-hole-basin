import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors'


/**
 * Express error-handling middleware.
 * Catches AppError instances and returns their status code and message.
 * Falls through to a generic 500 for unexpected errors.
 */
export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction): void {

  console.error(error)

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      status: error.statusCode,
      data: null,
      message: error.message
    })
    return
  }

  response.status(500).json({
    status: 500,
    data: null,
    message: 'An internal server error occurred. Please try again.'
  })
}
