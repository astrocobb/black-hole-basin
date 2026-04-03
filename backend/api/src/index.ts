import 'dotenv/config'
import { App } from './App'
import { type RedisClientType, createClient } from 'redis'
import type { User } from './features/users/users.schema'


/**
 * Augments the express-session module to include custom session data
 * used for authentication and authorization throughout the app.
 */
declare module 'express-session' {

  /** Extended session data for storing auth state. */
  export interface SessionData {
    user: User | undefined
    jwt: string | undefined
    signature: string | undefined
  }
}

// Holds the singleton Redis client instance for the application lifetime
let redisClient: RedisClientType | undefined

/**
 * Bootstraps the application by connecting to Redis and starting the Express server.
 * @returns { Promise<void> } Resolves when the server is listening.
 */
async function main(): Promise<void> {

  // Create and connect the Redis client if one doesn't already exist
  if (redisClient === undefined) {
    redisClient = createClient({ socket: { host: process.env.REDIS_HOST } })
    redisClient.connect().catch(console.error)
  }

  try {
    const app = new App(redisClient)
    app.listen()
  } catch (error: any) {
    console.error(error)
  }
}

main().catch(error => {
  console.error(error)
})