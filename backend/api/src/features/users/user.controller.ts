import { type Request, type Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { selectUserById, type User, UserSchema } from './user.model'
import { validateUser } from '../../utils/auth.utils'


export async function getUserByIdController(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = UserSchema.pick({ id: true }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { id } = validationResult.data

    if (!validateUser(request, response, id)) return

    const user: User | null = await selectUserById(id)
    if (!user) {
      response.status(404).json({
        status: 404,
        data: null,
        message: 'Get user failed. User not found.'
      })
      return
    }

    response.status(200).json({
      status: 200,
      data: user,
      message: 'Successfully retrieved user.'
    })

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}