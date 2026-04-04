import postgres from 'postgres'
import { config } from '../config'


/**
 * Shared PostgreSQL client configured from config
 * Applies automatic camelCase transformation so database column names
 * (snake_case) map to JavaScript property names (camelCase) transparently.
 */
export const sql = postgres({
  user: config.postgres.user,
  host: config.postgres.host,
  database: config.postgres.database,
  password: config.postgres.password,
  transform: {
    column: {
      from: postgres.toCamel, // snake_case DB columns -> camelCase JS properties
      to: postgres.fromCamel  // camelCase JS properties -> snake_case DB columns
    }
  }
})