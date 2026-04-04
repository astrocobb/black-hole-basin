import type { SignIn, SignUp } from './auth.schemas'
import { generateJwt, setActivationToken, setHash, validPassword } from '../../lib/auth'
import type { User } from '../users/users.schema'
import { insertUser, selectUserByEmail } from '../users/users.repository'
import { deleteUserActivation, insertUserActivation, selectUserActivationByToken } from './auth.repository'
import { Resend } from 'resend'
import { config } from '../../config'
import { BadRequestError, UnauthorizedError } from '../../lib/errors'
import { v7 as uuid } from 'uuid'


/**
 * Service function to sign up a new user.
 * @param { SignUp } data - The user data including email, password, and name.
 * @returns { emailSent: boolean } - Indicates whether an activation email was sent.
 */
export async function signUp(data: SignUp): Promise<{ emailSent: boolean }> {

  const { id, email, password, name, role } = data

  const hash = await setHash(password)

  const user: User = { id, email, hash, name, role }

  await insertUser(user)

  const activationToken = setActivationToken()
  await insertUserActivation(user.id, activationToken)

  let emailSent = false
  try {
    const resend = new Resend(config.resend.apiKey)
    const activateUrl = `${ config.frontendUrl }/activate?token=${ activationToken }`
    const html = `
        <h2>Welcome to Black Hole Basin!</h2>
        <p>You must confirm your account.</p>
        <p><a href="${ activateUrl }">Activate your account</a></p>`

    const emailResult = await resend.emails.send({
      from: `Black Hole Basin <${ config.resend.fromEmail }>`,
      to: data.email,
      subject: 'Please confirm your Black Hole Basin account -- Account Activation',
      html
    })
    console.log('Resend result:', emailResult)
    emailSent = !emailResult.error
  } catch (mailError: any) {
    console.error('Resend error:', mailError)
  }

  return { emailSent }
}

/**
 * Service function to activate a user account.
 * @param { string } token - The activation token.
 * @returns { void } - No return value.
 */
export async function activateUser(token: string): Promise<void> {

  const userActivation = await selectUserActivationByToken(token)

  if (userActivation === null) {
    throw new BadRequestError('Activation failed. Invalid or already used activation token.')
  }

  await deleteUserActivation(userActivation.userId)
}

/**
 * Service function to sign in a user.
 * @param { SignIn } data - The user credentials including email and password.
 * @returns { user: User, authorization: string, signature: string } - The authenticated user and JWT.
 */
export async function signIn(data: SignIn): Promise<{ user: User, authorization: string, signature: string }> {

  const { email, password } = data

  const user = await selectUserByEmail(email)

  if (user === null) {
    throw new UnauthorizedError('Sign in failed. Email or password is incorrect.')
  }

  const isPasswordValid = await validPassword(user.hash, password)

  if (!isPasswordValid) {
    throw new UnauthorizedError('Sign in failed. Email or password is incorrect.')
  }

  const signature = uuid()
  const authorization = generateJwt({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }, signature)

  return { user, authorization, signature }
}