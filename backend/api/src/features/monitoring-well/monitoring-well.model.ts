import { z } from 'zod/v4'


export const MonitoringWellSchema = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  depthToWater: z.number('Please provide a valid number for depth to water.')
    .max(32, 'Please provide a valid number for depth to water (max 32 digits).'),
  siteNo: z.number('Please provide a valid number for site no.'),
  time: z.date('Please provide a valid date and time for time.')
})