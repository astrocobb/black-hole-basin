import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { type Request, type Response } from 'express'
import {
  type MonitoringWell,
  MonitoringWellSchema,
  insertMonitoringWell,
  selectMonitoringWellById
} from './monitoring-well.model'
import { validateUser } from '../../utils/auth.utils'
import { selectUserById, type User } from '../users/user.model'


export async function postMonitoringWellController(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = MonitoringWellSchema.safeParse(request.body)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const newMonitoringWell: MonitoringWell = validationResult.data

    // ADD ROLE CHECKER
    const userId: string = newMonitoringWell.userId
    const user: User | null = await selectUserById(userId)

    if (!user) {
      response.status(401).json({
        status: 401,
        data: null,
        message: 'Post monitoring well failed. Please sign in.'
      })
      return
    }

    if (user.role !== 'admin') {
      response.status(403).json({
        status: 403,
        data: null,
        message: 'Post monitoring well failed. You do not have authority to add monitoring wells.'
      })
      return
    }

    if (!newMonitoringWell) {
      response.status(400).json({
        status: 400,
        data: null,
        message: 'Post monitoring well failed. Monitoring well data is missing.'
      })
      return
    }

    if (!(await validateUser(request, newMonitoringWell.userId))) {
      response.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden: You do not have permission to create a monitoring well for this user.'
      })
      return
    }

    const existingMonitoringWell = await selectMonitoringWellById(newMonitoringWell.id)

    if (existingMonitoringWell) {
      response.status(409).json({
        status: 409,
        data: null,
        message: 'Post monitoring well failed. Monitoring well already exists.'
      })
      return
    }

    const message = await insertMonitoringWell(newMonitoringWell)

    response.json({
      status: 200,
      data: null,
      message: message
    })

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}