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
      const activateUrl: string = `${ request.protocol }://${ request.hostname }:5173/activate?token=${ activationToken }`
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