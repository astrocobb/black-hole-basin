import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { type Response } from 'express'
import { insertMonitoringWell, type MonitoringWell, MonitoringWellModel } from './monitoring-well.model'


export async function postMonitoringWell(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = MonitoringWellModel.safeParse(request.body)
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

    // if (!(await validateSessionUser(request, response, newMonitoringWell.client))) return

    // const existingMonitoringWell = await selectMonitoringWellById(newMonitoringWell.id)

    // if (existingMonitoringWell) {
    //   response.status(409).json({
    //     status: 409,
    //     data: null,
    //     message: 'Post monitoring well failed. Monitoring well already exists.'
    //   })
    // }

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