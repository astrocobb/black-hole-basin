import type { MonitoringWell, MonitoringWellInput } from './monitoring-wells.schema'
import { selectUserById } from '../users/users.repository'
import { ConflictError, ForbiddenError, NotFoundError } from '../../lib/errors'
import {
  deleteMonitoringWell,
  insertMonitoringWell,
  selectMonitoringWellById,
  updateMonitoringWell
} from './monitoring-wells.repository'


/**
 * Service function to create a new monitoring well record.
 * @param { MonitoringWellInput } data - The monitoring well data to insert.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the well is successfully inserted.
 */
export async function postMonitoringWellService(data: MonitoringWellInput, sessionUserId: string): Promise<void> {

  const sessionUser = await selectUserById(sessionUserId)
  if (sessionUser?.role !== 'admin') throw new ForbiddenError('Create monitoring well failed. Admin role required.')

  const existingWell = await selectMonitoringWellById(data.id)
  if (existingWell) throw new ConflictError('Create monitoring well failed. Monitoring well already exists.')

  await insertMonitoringWell(data)
}

/**
 * Service function to retrieve a monitoring well record by ID.
 * @param { string } id - The monitoring well ID to retrieve.
 * @returns { MonitoringWell } The monitoring well object if found, or throws an error.
 */
export async function getMonitoringWellByIdService(id: string): Promise<MonitoringWell> {

  const existingMonitoringWell = await selectMonitoringWellById(id)
  if (!existingMonitoringWell) throw new NotFoundError('Monitoring well not found.')

  return existingMonitoringWell
}

/**
 * Service function to update an existing monitoring well record.
 * @param { MonitoringWellInput } data - The monitoring well data to update.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the well is successfully updated.
 */
export async function putMonitoringWellService(data: MonitoringWellInput, sessionUserId: string): Promise<void> {

  const existingMonitoringWell = await selectMonitoringWellById(data.id)
  if (!existingMonitoringWell) throw new NotFoundError('Monitoring well not found.')

  const sessionUser = await selectUserById(sessionUserId)
  if (sessionUser?.role !== 'admin') throw new ForbiddenError('Update monitoring well failed. Admin role required.')

  await updateMonitoringWell(data)
}

/**
 * Service function to delete a monitoring well record by ID.
 * @param { string } id - The monitoring well ID to delete.
 * @param { string } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the well is successfully deleted.
 */
export async function deleteMonitoringWellService(id: string, sessionUserId: string): Promise<void> {

  const existingMonitoringWell = await selectMonitoringWellById(id)
  if (!existingMonitoringWell) throw new NotFoundError('Monitoring well not found.')

  const sessionUser = await selectUserById(sessionUserId)
  if (sessionUser?.role !== 'admin') throw new ForbiddenError('Delete monitoring well failed. Admin role required.')

  await deleteMonitoringWell(id)
}