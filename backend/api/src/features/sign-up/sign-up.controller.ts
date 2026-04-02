import type { Request, Response } from 'express'
import type { Status } from '../../utils/interfaces/Status'
import { Resend } from 'resend'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { SignUpUserSchema } from './sign-up.model'
import { setActivationToken, setHash } from '../../utils/auth.utils'
import { type User, insertUser } from '../users/user.model'


export async function signUpController(request: Request, response: Response) {
  try {

    const validationResult = SignUpUserSchema.safeParse(request.body)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { id, email, password, name, role } = validationResult.data
    const hash = await setHash(password)
    const activationToken = setActivationToken()
    const user: User = {
      id,
      activationToken,
      email,
      hash,
      name,
      role
    }

    await insertUser(user)

    let emailSent = false
    try {
      const resend = new Resend(process.env.RESEND_API_KEY as string)
      const basePath: string = `${ request.protocol }://${ request.hostname }:8080${ request.originalUrl }/activation/${ activationToken }`
      const html = `
        <h2>Welcome to Black Hole Basin!</h2>
        <p>You must confirm your account.</p>
        <p><a href="${ basePath }">${ basePath }</a></p>`
      await resend.emails.send({
        from: `Black Hole Basin <${ process.env.RESEND_FROM_EMAIL as string }>`,
        to: email,
        subject: 'Please confirm your Black Hole Basin account -- Account Activation',
        html
      })
      emailSent = true
    } catch (mailError: any) {
      console.error('Resend error:', mailError.message)
      console.log('User created but activation email could not be sent.')
    }

    const status: Status = {
      status: 200,
      message: emailSent
        ? 'User successfully created! Please check your email.'
        : 'User successfully created! (Note: Activation email could not be sent. Please contact support.)',
      data: null
    }

    response.status(200).json(status)

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}