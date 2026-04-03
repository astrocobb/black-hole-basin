import { Router } from 'express'
import { signUpController } from './sign-up.controller'
import { activationController } from './activation.controller'


const basePath = '/api/sign-up'

const router = Router()

router.route('/')
  .post(signUpController)

router.route('/activation')
  .post(activationController)

export const signUpRoute = { basePath, router }