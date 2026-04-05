import type { User } from './users.schema'
import { selectUserById } from './users.repository'
import { NotFoundError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'


/**
 * User service function to retrieve a user by ID.
 * @param { string } id - The user ID to retrieve.
 * @param { sessionUserId } sessionUserId - The ID of the currently authenticated user.
 * @returns { user: User } The user object if found, or throws an error.
 */
export async function getUserById(id: string, sessionUserId: string | undefined): Promise<Omit<User, 'hash'>> {

  const user = await selectUserById(id)

  if (!user) throw new NotFoundError('User not found.')

  assertOwnership(sessionUserId, user.id)

  const { hash, ...safeUser } = user

  return safeUser
}