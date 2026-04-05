import 'dotenv/config'
import { z } from 'zod/v4'


const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4200),
  FRONTEND_URL: z.string('FRONTEND_URL is required'),
  SESSION_SECRET: z.string('SESSION_SECRET is required'),
  REDIS_HOST: z.string('REDIS_HOST is required'),
  POSTGRES_HOST: z.string('POSTGRES_HOST is required'),
  POSTGRES_DB: z.string('POSTGRES_DB is required'),
  POSTGRES_USER: z.string('POSTGRES_USER is required'),
  POSTGRES_PASSWORD: z.string('POSTGRES_PASSWORD is required'),
  RESEND_API_KEY: z.string('RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string('RESEND_FROM_EMAIL is required'),
})

const env = EnvSchema.parse(process.env)

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  frontendUrl: env.FRONTEND_URL,
  session: {
    secret: env.SESSION_SECRET,
  },
  redis: {
    host: env.REDIS_HOST,
  },
  postgres: {
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
  },
  resend: {
    apiKey: env.RESEND_API_KEY,
    fromEmail: env.RESEND_FROM_EMAIL,
  },
} as const
