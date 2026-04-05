import { createClient, type RedisClientType } from 'redis'
import { config } from '../config'


export async function createRedisClient(): Promise<RedisClientType> {
  const client = createClient({ socket: { host: config.redis.host } })
  try {
    await client.connect()
  } catch (error) {
    throw new Error(`Failed to connect to Redis at ${config.redis.host}: ${error}`)
  }
  return client as RedisClientType
}