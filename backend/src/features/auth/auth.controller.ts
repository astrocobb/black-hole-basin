import type { Request, Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../lib/responses'
import { AppError } from '../../lib/errors'
import { ActivationRequestSchema, SignInSchema, SignUpSchema } from './auth.schemas'
import { activateUser, signIn, signUp } from './auth.service'


/**
 * Handles a new user registration by validating input, hashing the password,
 * creating the user record, and sending an activation email via Resend.
 * @param { Request } request - Express request containing sign-up fields in the body.
 * @param { Response } response - Express response for sending the registration result.
 * @returns { Promise<void> } Responds with 201 on success.
 */
export async function signUpController(request: Request, response: Response): Promise<void> {
  try {

    // Validate sign-up fields including password confirmation match
    const parsed = SignUpSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const { emailSent } = await signUp(parsed.data)

    response.status(201).json({
      status: 201,
      data: null,
      message: emailSent
        ? 'Successfully sent activation email. Please check your inbox.'
        : 'Sign up failed. Please try again.'
    })

  } catch (error: any) {
    console.error(error)
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: error.statusCode,
        data: null,
        message: error.message
      })
      return
    }
    serverErrorResponse(response, error.message)
  }
}

/**
 * Handles account activation by validating the activation token,
 * looking up the user, and clearing their activation token to mark the account as active.
 * @param { Request } request - Express request containing { activation } token in the body.
 * @param { Response } response - Express response for sending the activation result.
 * @returns { Promise<void> } Responds with 200 on success.
 */
export async function activationController(request: Request, response: Response): Promise<void> {

  try {

    // Validate that the activation token is present and the correct length
    const parsed = ActivationRequestSchema.safeParse(request.body)

    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    await activateUser(parsed.data.token)

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully activated account.'
    })

  } catch (error: any) {
    console.error(error)
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: error.statusCode,
        data: null,
        message: error.message
      })
      return
    }
    serverErrorResponse(response, error.message)
  }
}

/**
 * Handles user sign-in by validating credentials, verifying the password,
 * generating a JWT, and establishing a session.
 * @param { Request } request - Express request containing { email, password } in the body.
 * @param { Response } response - Express response for sending an auth result or errors.
 * @returns { Promise<void> } Responds with 200 on success.
 */
export async function signInController(request: Request, response: Response): Promise<void> {

  try {

    // Validate that email and password are present and well-formed
    const parsed = SignInSchema.safeParse(request.body)

    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const { user, authorization, signature } = await signIn(parsed.data)

    request.session.user = user
    request.session.jwt = authorization
    request.session.signature = signature

    response.header({ authorization })

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully signed in.'
    })

  } catch (error: any) {
    console.error(error)
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: error.statusCode,
        data: null,
        message: error.message
      })
      return
    }
    serverErrorResponse(response, error.message)
  }
}