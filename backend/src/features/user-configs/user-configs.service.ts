import type { UserConfig, UserConfigInput } from './user-configs.schema'
import { ConflictError, NotFoundError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'
import { insertUserConfigs, selectUserConfigById, updateUserConfig } from './user-configs.repository'


/**
 * Service function to create a new user configs record.
 * @param { UserConfigInput } data - The user configs data to insert.
 * @param { string | undefined } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the user config is successfully inserted.
 */
export async function postUserConfig(data: UserConfigInput, sessionUserId: string | undefined): Promise<void> {

  assertOwnership(sessionUserId, data.userId)

  const existingUserConfig = await selectUserConfigById(data.id)
  if (existingUserConfig) throw new ConflictError('Create user config failed. User config already exists.')

  await insertUserConfigs(data)
}

/**
 * Service function to update an existing user configs record.
 * @param { UserConfigInput } data - The user configs data to update.
 * @param { string | undefined } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the user config is successfully updated.
 */
export async function putUserConfig(data: UserConfigInput, sessionUserId: string | undefined): Promise<void> {

  const existingUserConfig = await selectUserConfigById(data.id)
  if (!existingUserConfig) throw new NotFoundError('User config not found.')

  assertOwnership(sessionUserId, existingUserConfig.userId)

  await updateUserConfig(data)
}

/**
 * Service function to retrieve a user configs record by ID.
 * @param { string } id - The user configs ID to retrieve.
 * @param { string | undefined } sessionUserId - The ID of the user making the request.
 * @returns { Promise<UserConfig> } The user configs object if found, or throws an error.
 */
export async function getUserConfigById(id: string, sessionUserId: string | undefined): Promise<UserConfig> {

  const userConfig = await selectUserConfigById(id)

  if (!userConfig) throw new NotFoundError('User config not found.')

  assertOwnership(sessionUserId, userConfig.userId)

  return userConfig
}