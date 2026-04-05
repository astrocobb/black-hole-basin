import { App } from './App'
import { createRedisClient } from './lib/redis'
import type { User } from './features/users/users.schema'


/**
 * Augments the express-session module to include custom session data
 * used for authentication and authorization throughout the app.
 */
declare module 'express-session' {

  /** Extended session data for storing auth state. */
  export interface SessionData {
    user: User | undefined
    authorization: string | undefined
    signature: string | undefined
  }
}

/**
 * Bootstraps the application by connecting to Redis and starting the Express server.
 * @returns {Promise<void>} Resolves when the server is listening.
 */
async function main(): Promise<void> {
  const redisClient = await createRedisClient()
  const app = new App(redisClient)
  app.listen()
}

main().catch(error => {
  console.error(error)
})