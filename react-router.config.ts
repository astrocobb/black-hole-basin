import type { Config } from '@react-router/dev/config'


/**
 * React Router configuration.
 * Points the app directory to the frontend source and enables server-side rendering.
 */
export default {
  appDirectory: 'frontend/src/app',
  ssr: true
} satisfies Config
