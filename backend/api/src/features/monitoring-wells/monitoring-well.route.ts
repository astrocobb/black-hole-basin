import { Router } from 'express'
import { postMonitoringWell } from './monitoring-well.controller'


const basePath = '/api/monitoringWell' as const
const router = Router()

router.route('/')
  .post(isLoggedInController, postMonitoringWell)

export const monitoringWell = { basePath, router }