import type { UserConfig, UserConfigInput } from './user-configs.schema'
import { ConflictError, NotFoundError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'
import {
  insertUserConfig,
  selectUserConfigById,
  selectUserConfigsByUserId,
  updateUserConfig,
  deleteUserConfig
} from './user-configs.repository'


/**
 * Service function to retrieve all user configs for a user.
 * @param { string } userId - The user ID whose configs to retrieve.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Promise<UserConfig[]> } The list of user configs.
 * @throws { ForbiddenError } When the session user does not own the resource.
 */
export async function getUserConfigsByUserIdService(userId: string, sessionUserId: string): Promise<UserConfig[]> {

  assertOwnership(sessionUserId, userId)

  return selectUserConfigsByUserId(userId)
}

/**
 * Service function to create a new user configs record.
 * @param { UserConfigInput } data - The user configs data to insert.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the user config is successfully inserted.
 */
export async function postUserConfigService(data: UserConfigInput, sessionUserId: string): Promise<void> {

  assertOwnership(sessionUserId, data.userId)

  const existingUserConfig = await selectUserConfigById(data.id)
  if (existingUserConfig) throw new ConflictError('Create user config failed. User config already exists.')

  await insertUserConfig(data)
}

/**
 * Service function to retrieve a user configs record by ID.
 * @param { string } id - The user configs ID to retrieve.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { Promise<UserConfig> } The user configs object if found, or throws an error.
 */
export async function getUserConfigByIdService(id: string, sessionUserId: string): Promise<UserConfig> {

  const existingUserConfig = await selectUserConfigById(id)
  if (!existingUserConfig) throw new NotFoundError('User config not found.')

  assertOwnership(sessionUserId, existingUserConfig.userId)

  return existingUserConfig
}

/**
 * Service function to update an existing user configs record.
 * @param { UserConfigInput } data - The user configs data to update.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the user config is successfully updated.
 */
export async function putUserConfigService(data: UserConfigInput, sessionUserId: string): Promise<void> {

  const existingUserConfig = await selectUserConfigById(data.id)
  if (!existingUserConfig) throw new NotFoundError('User config not found.')

  assertOwnership(sessionUserId, existingUserConfig.userId)

  await updateUserConfig(data)
}

/**
 * Service function to delete a user configs record by ID.
 * @param { string } id - The user configs ID to delete.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the user config is successfully deleted.
 */
export async function deleteUserConfigService(id: string, sessionUserId: string): Promise<void> {

  const existingUserConfig = await selectUserConfigById(id)
  if (!existingUserConfig) throw new NotFoundError('User config not found.')

  assertOwnership(sessionUserId, existingUserConfig.userId)

  await deleteUserConfig(id)
}