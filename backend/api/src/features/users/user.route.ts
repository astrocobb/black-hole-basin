import { Router } from 'express'
import { isSignedInController } from '../../utils/controllers/is-signed-in.controller'
import { getUserByIdController } from './user.controller'


const basePath = '/api/user' as const
const router = Router()

router.route('/id/:id')
  .get(isSignedInController, getUserByIdController)

export const userRoute = { basePath, router }