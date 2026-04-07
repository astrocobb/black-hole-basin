import { sql } from '../../lib/db'
import { type UserActivation, UserActivationSchema } from './auth.schema'


/**
 * Inserts a new user activation record into the database.
 * @param { string } userId - The UUID of the user to activate.
 * @param { string } token - The activation token to store.
 * @returns { void }
 */
export async function insertUserActivation(userId: string, token: string): Promise<void> {
  await sql`
    INSERT INTO user_activations (
      user_id,
      token                            
    ) VALUES (
      ${ userId },
      ${ token }        
    )
  `
}

/**
 * Selects a user activation record by its token.
 * @param { string } token - The activation token to search for.
 * @returns { Promise<UserActivation | null> } The matching activation record, or null if not found or expired.
 */
export async function selectUserActivationByToken(token: string): Promise<UserActivation | null> {
  const rowList = await sql`
    SELECT
      user_id,
      token,
      expires_at,
      created_at
    FROM user_activations
    WHERE token = ${ token } AND expires_at > now()
  `

  // Parse and validate the query result, expecting at most one row
  const result = UserActivationSchema.array().max(1).parse(rowList)

  return result[0] ?? null
}

/**
 * Deletes a user activation record by its user ID.
 * @param { string } userId - The UUID of the user whose activation record to delete.
 * @returns { void } Resolves when the deletion is complete.
 */
export async function deleteUserActivation(userId: string): Promise<void> {
  await sql`
    DELETE FROM user_activations
    WHERE user_id = ${ userId }
  `
}