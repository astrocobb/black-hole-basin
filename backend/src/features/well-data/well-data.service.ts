import type { WellDataInput } from './well-data.schema'
import { selectUserById } from '../users/users.repository'
import { ConflictError, ForbiddenError } from '../../lib/errors'
import { insertWellData, selectWellDataById } from './well-data.repository'


/**
 * Service function to create a new well data record.
 * @param { WellDataInput } data - The well data to insert.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the well data is successfully inserted.
 */
export async function postWellDataService(data: WellDataInput, sessionUserId: string): Promise<void> {

  const sessionUser = await selectUserById(sessionUserId)
  if (sessionUser?.role !== 'admin') throw new ForbiddenError('Create well data failed. Admin role required.')

  const existingWellData = await selectWellDataById(data.id)
  if (existingWellData) throw new ConflictError('Create well data failed. Well data already exists.')

  await insertWellData(data)
}