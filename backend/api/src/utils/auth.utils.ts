import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import { type Request, type Response } from 'express'
import pkg from 'jsonwebtoken'
import type { User } from '../features/users/user.model.ts'
const { sign } = pkg


export function generateJwt(payload: object, signature: string): string {

  const setExpire = (currentTimestamp: number): number => {
    const oneHourInMilliseconds: number = 3600000
    const futureTimestamp: number = Math.round(currentTimestamp) + oneHourInMilliseconds
    const futureTimestampInSeconds: number = futureTimestamp / 1000
    return Math.round(futureTimestampInSeconds)
  }

  const iat = new Date().getTime()
  const exp = setExpire(iat)
  return sign({ exp, auth: payload, iat }, signature)
}

export async function setHash(password: string): Promise<string> {
  return await argon2.hash(
    password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      hashLength: 32
    }
  )
}

export function setActivationToken(): string {
  return crypto.randomBytes(16).toString('hex')
}

export async function validatePassword(hash: string, password: string): Promise<boolean> {
  return await argon2.verify(hash, password)
}

// validate the session user
export async function validateSessionUser(request: Request, response: e.Response, userId: string | undefined): Promise<boolean> {

  // if the user id is undefined or null, send a 403 and return false
  if (!userId) {
    response.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden: You do not have access to this resource.'
    })
    return false
  }

  // get the user id from the session
  const sessionUser: User | undefined = request.session?.user

  // if the user id from the session is undefined, send a 401 and return false
  if (!sessionUser) {
    response.status(401).json({
      status: 401,
      data: null,
      message: 'Unauthorized: You must be signed in to access this resource.'
    })
    return false
  }

  // get the user id from the session
  const sessionUserId = sessionUser?.id

  // check if the user id from the request body matches the user id from the session
  if (userId !== sessionUserId) {
    response.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden: You do not own this resource.'
    })
    return false
  }

  return true
}