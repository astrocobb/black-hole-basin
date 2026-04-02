import { type Request, type Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils'
import { type User, UserSchema } from './user.model'
import { validateUser } from '../../utils/auth.utils'


export async function getUserByIdController(request: Request, response: Response): Promise<void> {

  try {

    const validationResult = UserSchema.pick({ id: true }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { id } = validationResult.data

    if (!(await validateUser(request, id))) {
      response.status(403).json({
        status: 403,
        data: null,
        message: 'Get user by id failed. You do not have authority to access another account.'
      })
      return
    }

    const user: User | null = await selectUserById(id)
    if (!user) {
      response.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.'
      })
      return
    }

    response.status(200).json({
      status: 201,
      data: user,
      message: 'Ger user successful.',
    })

  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, error.message)
  }
}