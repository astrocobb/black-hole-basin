import 'dotenv'


export const config = {
  port: Number(process.env.PORT ?? 4200),
  frontendUrl: process.env.FRONTEND_URL,
  session: {
    secret: process.env.SESSION_SECRET
  },
  redis: {
    host: process.env.REDIS_HOST
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL
  }
} as const