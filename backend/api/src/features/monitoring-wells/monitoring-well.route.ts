import { Router } from 'express'
import { postMonitoringWellController } from './monitoring-well.controller'
import { isSignedInController } from '../../utils/controllers/is-signed-in.controller'


const basePath = '/api/monitoring-wells' as const
const router = Router()

router.route('/')
  .post(isSignedInController, postMonitoringWellController)

export const monitoringWell = { basePath, router }