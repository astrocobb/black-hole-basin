import * as argon2 from 'argon2'
import * as crypto from 'crypto'
import pkg from 'jsonwebtoken'
import { ForbiddenError } from './errors'
const { sign } = pkg


/**
 * Generates a signed JWT with one hour expiry containing the given payload.
 * @param { object } payload - Data to embed in the JWT (e.g. user id, email, role).
 * @param { string } signature - Per-session secret used as the signing key.
 * @returns { string } The signed JWT string.
 */
export function generateJWT(payload: object, signature: string): string {
  return sign({ auth: payload }, signature, { expiresIn: '1h' })
}

/**
 * Hashes a plaintext password using Argon2.
 * @param { string } password - The plaintext password to hash.
 * @returns { Promise<string> } The resulting Argon2 hash string.
 */
export async function hashPassword(password: string): Promise<string> {
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
export function generateActivationToken(): string {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Verifies a plaintext password against an Argon2 hash.
 * @param { string } hash - The stored Argon2 hash to verify against.
 * @param { string } password - The plaintext password to check.
 * @returns { Promise<boolean> } True if the password matches the hash.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return await argon2.verify(hash, password)
}

/**
 * Asserts that the user making the request owns the resource.
 * @param { string | undefined } sessionUserId - The user ID from the session.
 * @param { string } resourceUserId - The user ID of the resource to check.
 * @throws { ForbiddenError } If the user IDs do not match.
 * @returns { void }
 */
export function assertOwnership(sessionUserId: string | undefined, resourceUserId: string): void {
  if (!sessionUserId || sessionUserId !== resourceUserId) {
    throw new ForbiddenError('You are not authorized to access this resource.')
  }
}