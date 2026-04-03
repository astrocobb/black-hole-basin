import postgres from 'postgres'


/**
 * Shared PostgreSQL client configured from environment variables.
 * Applies automatic camelCase transformation so database column names
 * (snake_case) map to JavaScript property names (camelCase) transparently.
 */
export const sql = postgres({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  transform: {
    column: {
      from: postgres.toCamel, // snake_case DB columns -> camelCase JS properties
      to: postgres.fromCamel  // camelCase JS properties -> snake_case DB columns
    }
  }
})