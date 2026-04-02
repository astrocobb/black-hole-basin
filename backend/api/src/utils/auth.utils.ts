import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import { type Request, type Response } from 'express'
import pkg from 'jsonwebtoken'
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

export async function validPassword(hash: string, password: string): Promise<boolean> {
  return await argon2.verify(hash, password)
}

// validate the session user matches the resource owner
export function validUser(request: Request, response: Response, userId: string | undefined): boolean {

  if (!userId) {
    response.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden: You do not have access to this resource.'
    })
    return false
  }

  if (userId !== request.session?.user?.id) {
    response.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden: You do not own this resource.'
    })
    return false
  }

  return true
}