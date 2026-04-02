import type { Request, Response } from 'express'
import { z } from 'zod/v4'
import { type User, UserSchema, selectUserByEmail } from '../users/user.model'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import type { Status } from '../../utils/interfaces/Status'
import { v7 as uuid } from 'uuid'
import { generateJwt, validatePassword } from '../../utils/auth.utils'


export async function signInController(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = UserSchema.pick({ email: true }).extend({
      password: z.string('Enter your password.')
    }).safeParse(request.body)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { email, password } = validationResult.data

    const user: User | null = await selectUserByEmail(email)

    const signInFailedStatus: Status = {
      status: 400,
      message: 'Email or password is incorrect. Try again.',
      data: null
    }

    if (user === null) {
      response.json(signInFailedStatus)
      return
    }

    const isPasswordValid = await validatePassword(user.hash, password)

    if (!isPasswordValid) {
      response.json(signInFailedStatus)
      return
    }

    const { id, name, role } = user

    const signature = uuid()

    const authorization = generateJwt({
      id,
      email,
      name,
      role
    }, signature)

    request.session.user = user
    request.session.jwt = authorization
    request.session.signature = signature

    response.header({
      authorization
    })

    response.json({
      status: 200,
      message: 'Sign In successful!',
      data: null
    })
    return

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}