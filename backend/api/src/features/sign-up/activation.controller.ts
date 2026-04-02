import type { Request, Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { z } from 'zod/v4'
import { selectUserByUserActivationToken, updateUser } from '../users/user.model'


export async function activationController(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = z.object({
      activation: z.string('Activation is required.').length(32, 'Please provide a valid activation token.')
    }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { activation } = validationResult.data
    const user = await selectUserByUserActivationToken(activation)

    if (user === null) {
      response.json({
        status: 400,
        data: null,
        message: 'Account activation has failed. Have you already activated this account?'
      })
      return
    }

    user.activationToken = null
    await updateUser(user)

    response.json({
      status: 200,
      data: null,
      message: 'Account activation was successful!'
    })

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}