import type { MonitoringWellInput } from './monitoring-wells.schema'
import { selectUserById } from '../users/users.repository'
import { ConflictError, ForbiddenError, UnauthorizedError } from '../../lib/errors'
import { assertOwnership } from '../../lib/auth'
import { insertMonitoringWell, selectMonitoringWellById } from './monitoring-wells.repository'


/**
 * Service function to create a new monitoring well record.
 * @param { MonitoringWellInput } data - The monitoring well data to insert.
 * @param { string | undefined } sessionUserId - The ID of the user making the request.
 * @returns { Promise<void> } Resolves when the well is successfully inserted.
 */
export async function postMonitoringWell(data: MonitoringWellInput, sessionUserId: string | undefined): Promise<void> {

  const resourceUser = await selectUserById(data.userId)
  if (!resourceUser) throw new UnauthorizedError('Create monitoring well failed. Please sign in.')

  assertOwnership(sessionUserId, resourceUser.id)

  if (resourceUser.role !== 'admin') throw new ForbiddenError('Create monitoring well failed. Admin role required.')

  const existingWell = await selectMonitoringWellById(data.id)
  if (existingWell) throw new ConflictError('Create monitoring well failed. Monitoring well already exists.')

  await insertMonitoringWell(data)
}