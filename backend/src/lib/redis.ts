import { createClient, type RedisClientType } from 'redis'
import { config } from '../config'


export async function createRedisClient(): Promise<RedisClientType> {
  const client = createClient({ socket: { host: config.redis.host } })
  await client.connect()
  return client as RedisClientType
}