import express, { type Application } from 'express'
import morgan from 'morgan'
import session from 'express-session'
import cors from 'cors'
import type { RedisClientType } from 'redis'
import { RedisStore } from 'connect-redis'
// routes


// app class that extends the express application
export class App {

  // properties for the app, settings, middlewares, and routes
  app: Application
  redisStore: RedisStore

  // constructor that takes in a redis client and sets up the app, settings, middlewares, and routes
  constructor(redisClient: RedisClientType) {
    this.redisStore = new RedisStore({ client: redisClient })
    this.app = express()
    this.app.locals.redisClient = redisClient
    this.settings()
    this.middlewares()
    this.routes()
  }

  // private method that sets the port for the sever, to one from index.route.ts, and external .env.production.development file or defaults to 3000
  public settings(): void {}

  // private method to setting up the middleware to handle JSON responses, one for dev and one for prod
  private middlewares(): void {

    // Add CORS first - allows the frontend to communicate with the backend
    this.app.use(cors({
      origin: 'http://localhost:5173', // Change this to match your React dev server port
      credentials: true // CRITICAL: allows session cookies to be sent
    }))

    this.app.use(morgan('dev'))
    this.app.use(express.json())

    // Session configuration with automatic timeout
    this.app.use(session({
      store: this.redisStore,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      cookie: {
        maxAge: 2 * 60 * 60 * 1000, // Session expires after 1 hour of inactivity
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax' // Helps protect against CSRF attacks
      }
    }))

    // Middleware to reset the session timeout on each request
    this.app.use((req, res, next) => {
      if (req.session) {
        req.session.touch() // Resets the maxAge timer
      }
      next()
    })
  }

  // private method for setting up routes in their basic sense
  private routes(): void {}

  // starts the server and tells the terminal to post a message that the server is running and on what port
  public listen(): void  {
    this.app.listen(4200)
    console.log('Express application built successfully')
  }
}