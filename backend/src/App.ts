import express, { type Application } from 'express'
import morgan from 'morgan'
import session from 'express-session'
import cors from 'cors'
import type { RedisClientType } from 'redis'
import { RedisStore } from 'connect-redis'
import { config } from './config'
// Route imports
import { errorHandler } from './middleware/error-handler'
import { authRoute } from './features/auth/auth.route'
import { usersRoute } from './features/users/users.route'
import { monitoringWellsRoute } from './features/monitoring-wells/monitoring-wells.route'
import { wellDataRoute } from './features/well-data/well-data.route'
import { userConfigsRoute } from './features/user-configs/user-configs.route'
import { estimatesRoute } from './features/estimates/estimates.route'


/**
 * Core application class that configures and starts the Express server.
 * Handles middleware setup, session management, and route registration.
 */
export class App {

  // The underlying Express application instance.
  app: Application

  // Redis-backed session store for persisting user sessions.
  redisStore: RedisStore

  /**
   * Creates a new App instance with a connected Redis client.
   * @param { RedisClientType } redisClient - Active Redis client used for session storage.
   */
  constructor(redisClient: RedisClientType) {
    this.redisStore = new RedisStore({ client: redisClient })
    this.app = express()
    this.app.locals.redisClient = redisClient
    this.middlewares()
    this.routes()
    this.app.use(errorHandler)
  }

  /**
   * Registers all middleware in the correct order:
   * CORS, logging, JSON parsing, session management, and session touch.
   */
  private middlewares(): void {

    // CORS must come first, so preflight requests are handled before other middleware
    this.app.use(cors({
      origin: config.frontendUrl,
      credentials: true,                    // Required for session cookies to be sent cross-origin
      exposedHeaders: ['authorization']      // Allow the browser to read the JWT from the response header
    }))

    // HTTP request logger for development
    this.app.use(morgan('dev'))

    // Parse incoming JSON request bodies
    this.app.use(express.json())

    // Session configuration with Redis store and automatic timeout
    this.app.use(session({
      store: this.redisStore,
      saveUninitialized: false,
      secret: config.session.secret,
      resave: false,
      cookie: {
        maxAge: 2 * 60 * 60 * 1000,  // 2-hour session expiry
        httpOnly: true,              // Prevents client-side JavaScript access
        secure: config.nodeEnv === 'production',
        sameSite: 'lax'              // CSRF protection
      }
    }))

    // Reset the session expiry timer on every request to keep active sessions alive
    this.app.use((req, res, next) => {
      if (req.session) {
        req.session.touch()
      }
      next()
    })
  }

  /**
   * Mounts all feature route modules onto the Express app.
   * Each route module provides its own base path and router.
   */
  private routes(): void {
    this.app.use(authRoute.basePath, authRoute.router)
    this.app.use(usersRoute.basePath, usersRoute.router)
    this.app.use(userConfigsRoute.basePath, userConfigsRoute.router)
    this.app.use(monitoringWellsRoute.basePath, monitoringWellsRoute.router)
    this.app.use(wellDataRoute.basePath, wellDataRoute.router)
    this.app.use(estimatesRoute.basePath, estimatesRoute.router)
  }

  /**
   * Starts the Express server on the port defined by the PORT environment variable.
   */
  public listen(): void  {
    const port = config.port ?? 4200
    this.app.listen(port)
    console.log(`Express application listening on port ${ port }`)
  }
}