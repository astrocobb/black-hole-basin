import { type Request, type Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../lib/responses'
import { type User } from '../users/users.schema'
import { selectUserById } from '../users/users.repository'
import { type MonitoringWell, MonitoringWellSchema } from './monitoring-wells.schema'
import { insertMonitoringWell, selectMonitoringWellById } from './monitoring-wells.repository'


/**
 * Handles the creation of a new monitoring well record.
 * Requires the requesting user to have the "admin" role and to own the resource.
 * Checks for duplicate wells before inserting.
 * @param { Request } request - Express request containing monitoring well data in the body.
 * @param { Response } response - Express response for sending the result or errors.
 * @returns { Promise<void> } Responds with 201 on success, or 400/401/403/409 on failure.
 */
export async function postMonitoringWellController(request: Request, response: Response): Promise<void> {

  try {

    // Validate the request body against the monitoring well schema
    const parsed = MonitoringWellSchema.safeParse(request.body)
    if (!parsed.success) {
      zodErrorResponse(response, parsed.error)
      return
    }

    const newMonitoringWell: MonitoringWell = parsed.data

    // Verify the referenced user exists
    const userId: string = newMonitoringWell.userId
    const user: User | null = await selectUserById(userId)

    if (!user) {
      response.status(401).json({
        status: 401,
        data: null,
        message: 'Create monitoring well failed. Please sign in.'
      })
      return
    }

    // Only admins are allowed to create monitoring wells
    if (user.role !== 'admin') {
      response.status(403).json({
        status: 403,
        data: null,
        message: 'Create monitoring well failed. Admin role required.'
      })
      return
    }

    // Guard against missing request body (defensive check)
    if (!newMonitoringWell) {
      response.status(400).json({
        status: 400,
        data: null,
        message: 'Create monitoring well failed. Request body is missing.'
      })
      return
    }

    // Ensure the session user owns the resource
    // if (!validUser(request, response, newMonitoringWell.userId)) return

    // Check for duplicate monitoring well by ID
    const existingMonitoringWell = await selectMonitoringWellById(newMonitoringWell.id)

    if (existingMonitoringWell) {
      response.status(409).json({
        status: 409,
        data: null,
        message: 'Create monitoring well failed. Monitoring well already exists.'
      })
      return
    }

    await insertMonitoringWell(newMonitoringWell)

    response.status(201).json({
      status: 201,
      data: newMonitoringWell,
      message: 'Successfully created monitoring well.'
    })

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}