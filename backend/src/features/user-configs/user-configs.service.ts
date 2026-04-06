import type { UserConfigInput } from './user-configs.schema'
import { selectUserById } from '../users/users.repository'
import { ConflictError, UnauthorizedError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'
import { insertUserConfigs, selectUserConfigById } from './user-configs.repository'


/**
 * Service function to create a new user configs record.
 * @param { UserConfigInput } data - The user configs data to insert.
 * @param { string | undefined } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the user config is successfully inserted.
 */
export async function postUserConfig(data: UserConfigInput, sessionUserId: string | undefined): Promise<void> {

  const resourceUser = await selectUserById(data.userId)
  if (!resourceUser) throw new UnauthorizedError('Create user configs failed. Please sign in.')

  assertOwnership(sessionUserId, resourceUser.id)

  const existingUserConfigs = await selectUserConfigById(data.id)
  if (existingUserConfigs) throw new ConflictError('Create user configs failed. User configs already exists.')

  await insertUserConfigs(data)
}