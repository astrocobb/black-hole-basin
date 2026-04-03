import { sql } from '../../lib/db'
import { type User, UserSchema } from './users.schema'


/**
 * Inserts a new user row into the database.
 * Validates the user object against UserSchema before inserting.
 * @param { User } user - The user object to insert.
 * @returns { Promise<string> }  A success confirmation message.
 */
export async function insertUser(user: User): Promise<string> {

  UserSchema.parse(user)

  const { id, email, hash, name, role } = user

  await sql `
    INSERT INTO users (
      id,
      email,
      hash,
      name,
      role
    )
    VALUES (
      ${ id },
      ${ email },
      ${ hash },
      ${ name },
      ${ role }
    )
  `
  return 'User successfully created!'
}

/**
 * Updates an existing user row in the database by ID.
 * @param { User } user - The user object with updated fields.
 * @returns { Promise<string> } A success confirmation message.
 */
export async function updateUser(user: User): Promise<string> {

  const { id, email, hash, name, role } = user

  await sql `
    UPDATE users
    SET 
      email = ${ email },
      hash = ${ hash },
      name = ${ name },
      role = ${ role }
    WHERE id = ${ id }
  `
  return 'User successfully updated!'
}

/**
 * Selects a single user by their unique ID.
 * @param { string } id - The UUID v7 of the user to find.
 * @returns { Promise<User | null> } The matching user, or null if not found.
 */
export async function selectUserById(id: string): Promise<User | null> {

  const rowList = await sql `
    SELECT
      id,
      email,
      hash,
      name,
      role
    FROM users
    WHERE id = ${ id }
  `

  // Parse and validate the query result, expecting at most one row
  const result = UserSchema.array().max(1).parse(rowList)

  return result[0] ?? null
}

/**
 * Selects a single user by their email address.
 * Used during sign-in to look up the user's credentials.
 * @param { string } email - The email address to search for.
 * @returns { Promise<User | null> } The matching user, or null if not found.
 */
export async function selectUserByEmail(email: string): Promise<User | null> {

  const rowList = await sql `
    SELECT
      id,
      email,
      hash,
      name,
      role
    FROM users
    WHERE email = ${ email }
  `

  const result = UserSchema.array().max(1).parse(rowList)

  return result[0] ?? null
}