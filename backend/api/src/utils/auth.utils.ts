import * as argon2 from 'argon2'
import * as crypto from 'node:crypto'


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