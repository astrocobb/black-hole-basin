import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import { type Request, type Response } from 'express'
import pkg from 'jsonwebtoken'
const { sign } = pkg


/**
 * Generates a signed JWT with a 1-hour expiry containing the given payload.
 * @param { object } payload - Data to embed in the JWT (e.g. user id, email, role).
 * @param { string } signature - Per-session secret used as the signing key.
 * @returns { string } The signed JWT string.
 */
export function generateJwt(payload: object, signature: string): string {

  /**
   * Calculates the JWT expiration timestamp (1 hour from now).
   * @param { number } currentTimestamp - Current time in milliseconds.
   * @returns { number } Expiration time in seconds (Unix epoch).
   */
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

/**
 * Hashes a plaintext password using Argon2.
 * @param { string } password - The plaintext password to hash.
 * @returns { Promise<string> } The resulting Argon2 hash string.
 */
export async function setHash(password: string): Promise<string> {
  return await argon2.hash(
    password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,  // 64 MB memory cost
      hashLength: 32         // 32-byte output hash
    }
  )
}

/**
 * Generates a cryptographically random 32-character hex activation token.
 * @returns { string } A 16-byte random value encoded as a hex string.
 */
export function setActivationToken(): string {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Verifies a plaintext password against an Argon2 hash.
 * @param { string } hash - The stored Argon2 hash to verify against.
 * @param { string } password - The plaintext password to check.
 * @returns { Promise<boolean> } True if the password matches the hash.
 */
export async function validPassword(hash: string, password: string): Promise<boolean> {
  return await argon2.verify(hash, password)
}

/**
 * Validates that the session user matches the resource owner.
 * Sends a 403 response and returns false if the check fails.
 * @param { Request } request - The Express request with session data.
 * @param { Response } response - The Express response for sending errors.
 * @param { string | undefined } userId - The resource owner's user ID to validate.
 * @returns { boolean } True if the session user owns the resource.
 */
export function validUser(request: Request, response: Response, userId: string | undefined): boolean {

  // Reject if no user ID was provided
  if (!userId) {
    response.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden: You do not have access to this resource.'
    })
    return false
  }

  // Reject if the session user does not match the resource owner
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
