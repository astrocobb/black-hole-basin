import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { type Request, type Response } from 'express'
import {
  type MonitoringWell,
  MonitoringWellSchema,
  insertMonitoringWell,
  selectMonitoringWellById
} from './monitoring-well.model'
import { validateSessionUser } from '../../utils/auth.utils'


export async function postMonitoringWellController(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = MonitoringWellSchema.safeParse(request.body)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const newMonitoringWell: MonitoringWell = validationResult.data

    if (!newMonitoringWell) {
      response.status(400).json({
        status: 400,
        data: null,
        message: 'Post monitoring well failed. Monitoring well data is missing.'
      })
      return
    }

    if (!(await validateSessionUser(request, response, newMonitoringWell.userId))) return

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