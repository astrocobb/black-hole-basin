import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { type Request, type Response } from 'express'
import {
  type MonitoringWell,
  MonitoringWellSchema,
  insertMonitoringWell,
  selectMonitoringWellById
} from './monitoring-well.model'
import { validUser } from '../../utils/auth.utils'
import { selectUserById, type User } from '../users/user.model'


export async function postMonitoringWellController(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = MonitoringWellSchema.safeParse(request.body)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const newMonitoringWell: MonitoringWell = validationResult.data

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

    if (user.role !== 'admin') {
      response.status(403).json({
        status: 403,
        data: null,
        message: 'Create monitoring well failed. Admin role required.'
      })
      return
    }

    if (!newMonitoringWell) {
      response.status(400).json({
        status: 400,
        data: null,
        message: 'Create monitoring well failed. Request body is missing.'
      })
      return
    }

    if (!validUser(request, response, newMonitoringWell.userId)) return

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