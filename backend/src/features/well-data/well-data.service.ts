import type { WellData, WellDataInput } from './well-data.schema'
import { selectUserById } from '../users/users.repository'
import { ConflictError, ForbiddenError, NotFoundError } from '../../lib/errors'
import { deleteWellData, insertWellData, selectWellDataById, updateWellData } from './well-data.repository'


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

/**
 * Service function to retrieve a well data record by ID.
 * @param { string } id - The well data ID to retrieve.
 * @returns { WellData } The well data object if found, or throws an error.
 */
export async function getWellDataByIdService(id: string): Promise<WellData> {

  const existingWellData = await selectWellDataById(id)
  if (!existingWellData) throw new NotFoundError('Well data not found.')

  return existingWellData
}

/**
 * Service function to update an existing well data record.
 * @param { WellDataInput } data - The well data to update.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the well data is successfully updated.
 */
export async function putWellDataService(data: WellDataInput, sessionUserId: string): Promise<void> {

  const existingWellData = await selectWellDataById(data.id)
  if (!existingWellData) throw new NotFoundError('Well data not found.')

  const sessionUser = await selectUserById(sessionUserId)
  if (sessionUser?.role !== 'admin') throw new ForbiddenError('Update well data failed. Admin role required.')

  await updateWellData(data)
}

/**
 * Service function to delete a well data record by ID.
 * @param { string } id - The well data ID to delete.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the well data is successfully deleted.
 */
export async function deleteWellDataService(id: string, sessionUserId: string): Promise<void> {

  const existingWellData = await selectWellDataById(id)
  if (!existingWellData) throw new NotFoundError('Well data not found.')

  const sessionUser = await selectUserById(sessionUserId)
  if (sessionUser?.role !== 'admin') throw new ForbiddenError('Delete well data failed. Admin role required.')

  await deleteWellData(id)
}