import type { NextFunction, Request, Response } from 'express'
import type { Status } from '../types/Status'
import type { User } from '../features/users/users.schema'
import pkg from 'jsonwebtoken'
const { verify } = pkg


/**
 * Express middleware that protects routes by requiring a valid session and JWT.
 * Checks for a session user, signature, and a matching JWT in the Authorization header.
 * Calls next() on success, or responds with 401/500 on failure.
 * @param { Request } request - The incoming Express request.
 * @param { Response } response - The Express response for sending auth errors.
 * @param { NextFunction } next - The next middleware function in the stack.
 */
export function requireAuth(request: Request, response: Response, next: NextFunction): void {

  const status: Status = {
    status: 401,
    data: null,
    message: 'Unauthorized. Please sign in.'
  }

  try {

    const user: User | undefined = request.session?.user

    const signature: string | undefined = request.session?.signature

    // JWT is expected in the Authorization header (without Bearer prefix)
    const authorization: string | undefined = request.headers?.authorization

    // All three must be present for a valid authenticated request
    if (!user || !signature || !authorization) {
      response.status(401).json(status)
      return
    }

    // Verify the JWT signature matches the session signature
    verify(authorization, signature)

    next()

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      response.status(401).json(status)
      return
    }
    next(error)
  }
}
