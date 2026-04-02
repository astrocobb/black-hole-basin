import type  { NextFunction, Request, Response } from 'express'
import type { Status } from '../interfaces/Status'
import type { User } from '../../features/users/user.model'
import { serverErrorResponse } from '../response.utils'
import pkg from 'jsonwebtoken'
const { verify } = pkg


export function isSignedInController(request: Request, response: Response, next: NextFunction): void {

  const status: Status = {
    status: 401,
    data: null,
    message: 'Unauthorized. Please sign in.'
  }

  try {

    const user: User | undefined = request.session?.user

    const signature: string | undefined = request.session?.signature ?? ''

    const unverifiedJwtToken: string | undefined = request.headers?.authorization

    if (user === undefined || signature === undefined || unverifiedJwtToken === undefined) {
      response.status(401).json(status)
      return
    }

    verify(unverifiedJwtToken, signature)

    next()

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}