import { App } from './App'
import { type RedisClientType, createClient } from 'redis'
import type { User } from './features/users/user.model'
import 'dotenv/config'


declare module 'express-session' {

  export interface SessionData {
    user: User | undefined
    jwt: string | undefined
    signature: string | undefined
  }
}

// Initialize the redis client
let redisClient: RedisClientType | undefined

// Start the server
async function main(): Promise<void> {

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