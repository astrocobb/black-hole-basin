import type { Request, Response } from 'express'
import { z } from 'zod/v4'
import { serverErrorResponse, zodErrorResponse } from '../../lib/response'
import { v7 as uuid } from 'uuid'
import { Resend } from 'resend'
import { type User, UserSchema } from '../users/users.schema'
import { insertUser, selectUserByEmail } from '../users/users.repository'
import type { Status } from '../../types/Status'
import { generateJwt, validPassword, setHash, setActivationToken } from '../../lib/auth'
import { SignUpSchema, type UserActivation } from './auth.schemas'
import { deleteUserActivation, insertUserActivation, selectUserActivationByToken } from './auth.repository'


/**
 * Handles user sign-in by validating credentials, verifying the password,
 * generating a JWT, and establishing a session.
 * @param { Request } request - Express request containing { email, password } in the body.
 * @param { Response } response - Express response for sending auth result or errors.
 * @returns { Promise<void> } Responds with 200 on success, 401 on invalid credentials.
 */
export async function signInController(request: Request, response: Response): Promise<void> {

  try {

    // Validate that email and password are present and well-formed
    const validationResult = UserSchema.pick({ email: true }).extend({
      password: z.string('Enter your password.')
    }).safeParse(request.body)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { email, password } = validationResult.data

    // Look up the user by email
    const user: User | null = await selectUserByEmail(email)

    // Generic failure message to avoid leaking whether the email exists
    const signInFailedStatus: Status = {
      status: 401,
      data: null,
      message: 'Sign in failed. Email or password is incorrect.'
    }

    if (user === null) {
      response.status(401).json(signInFailedStatus)
      return
    }

    // Verify the provided password against the stored hash
    const isPasswordValid = await validPassword(user.hash, password)

    if (!isPasswordValid) {
      response.status(401).json(signInFailedStatus)
      return
    }

    const { id, name, role } = user

    // Generate a unique per-session signature used to sign/verify the JWT
    const signature = uuid()

    // Create a JWT containing user identity claims
    const authorization = generateJwt({
      id,
      email,
      name,
      role
    }, signature)

    // Store auth state in the server-side session
    request.session.user = user
    request.session.jwt = authorization
    request.session.signature = signature

    // Send the JWT in the response header for client-side storage
    response.header({
      authorization
    })

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully signed in.'
    })
    return

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}

/**
 * Handles new user registration by validating input, hashing the password,
 * creating the user record, and sending an activation email via Resend.
 * @param { Request } request - Express request containing sign-up fields in the body.
 * @param { Response } response - Express response for sending the registration result.
 * @returns { Promise<void> } Responds with 201 on success.
 */
export async function signUpController(request: Request, response: Response): Promise<void> {
  try {

    // Validate sign-up fields including password confirmation match
    const validationResult = SignUpSchema.safeParse(request.body)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { id, email, password, name, role } = validationResult.data

    // Hash the plaintext password for secure storage
    const hash = await setHash(password)

    const user: User = {
      id,
      email,
      hash,
      name,
      role
    }

    // Insert the new user into the database
    await insertUser(user)

    // Generate a random activation token for email verification
    const activationToken = setActivationToken()

    // Store the activation token in the database
    await insertUserActivation(id, activationToken)

    // Attempt to send the activation email (non-blocking failure)
    let emailSent = false
    try {

      const resend = new Resend(process.env.RESEND_API_KEY as string)

      // Build the activation URL pointing to the frontend activation page
      const activateUrl: string = `${ process.env.FRONTEND_URL }/activate?token=${ activationToken }`
      const html = `
        <h2>Welcome to Black Hole Basin!</h2>
        <p>You must confirm your account.</p>
        <p><a href="${ activateUrl }">Activate your account</a></p>`

      const emailResult = await resend.emails.send({
        from: `Black Hole Basin <${ process.env.RESEND_FROM_EMAIL as string }>`,
        to: email,
        subject: 'Please confirm your Black Hole Basin account -- Account Activation',
        html
      })
      console.log('Resend result:', emailResult)
      emailSent = !emailResult.error
    } catch (mailError: any) {
      console.error('Resend error:', mailError)
      console.log('User created but activation email could not be sent.')
    }

    // Respond with an appropriate message based on whether the email was sent
    const status: Status = {
      status: 201,
      data: null,
      message: emailSent
        ? 'Successfully signed up. Please check your email to activate your account.'
        : 'Successfully signed up. Activation email could not be sent. Please contact support.'
    }

    response.status(201).json(status)

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}

/**
 * Handles account activation by validating the activation token,
 * looking up the user, and clearing their activation token to mark the account as active.
 * @param { Request } request - Express request containing { activation } token in the body.
 * @param { Response } response - Express response for sending the activation result.
 * @returns { Promise<void> } Responds with 200 on success, 400 on invalid token.
 */
export async function activationController(request: Request, response: Response): Promise<void> {

  try {

    // Validate that the activation token is present and the correct length
    const validationResult = z.object({
      token: z.string('Activation is required.').length(32, 'Please provide a valid activation token.')
    }).safeParse(request.body)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { token } = validationResult.data

    // Find the user associated with this activation token
    const userActivation: UserActivation | null = await selectUserActivationByToken(token)

    if (userActivation === null) {
      response.status(400).json({
        status: 400,
        data: null,
        message: 'Activation failed. Invalid or already used activation token.'
      })
      return
    }

    // Delete the User Activation row from the database to mark the account as active
    await deleteUserActivation(userActivation.userId)

    response.status(200).json({
      status: 200,
      data: null,
      message: 'Successfully activated account.'
    })

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}