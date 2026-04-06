import type { WellDataInput } from './well-data.schema'
import { selectUserById } from '../users/users.repository'
import { selectMonitoringWellById } from '../monitoring-wells/monitoring-wells.repository'
import { ConflictError, ForbiddenError, NotFoundError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'
import { insertWellData, selectWellDataById } from './well-data.repository'


/**
 * Service function to create a new well data record.
 * @param { WellDataInput } data - The well data to insert.
 * @param { string | undefined } sessionUserId - The ID of the user making the request.
 * @returns { void } Resolves when the well data is successfully inserted.
 */
export async function postWellData(data: WellDataInput, sessionUserId: string | undefined): Promise<void> {

  const monitoringWell = await selectMonitoringWellById(data.monitoringWellId)
  if (!monitoringWell) throw new NotFoundError('Monitoring well not found.')

  const resourceUser = await selectUserById(monitoringWell.userId)
  if (!resourceUser) throw new NotFoundError('User not found.')

  assertOwnership(sessionUserId, resourceUser.id)

  if (resourceUser.role !== 'admin') throw new ForbiddenError('Create well data failed. Admin role required.')

  const existingWellData = await selectWellDataById(data.id)
  if (existingWellData) throw new ConflictError('Create well data failed. Well data already exists.')

  await insertWellData(data)
}