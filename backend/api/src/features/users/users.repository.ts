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

  const { id, activationToken, email, hash, name, role } = user

  await sql `
    INSERT INTO users (
      id,
      activation_token,
      email,
      hash,
      name,
      role
    )
    VALUES (
      ${ id },
      ${ activationToken },
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
 *  { User} user - The user object with updated fields.
 *  { Promise<string>} A success confirmation message.
 */
export async function updateUser(user: User): Promise<string> {

  const { id, activationToken, email, hash, name, role } = user

  await sql `
    UPDATE users
    SET activation_token = ${ activationToken },
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
      activation_token,
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
 * Selects a single user by their activation token.
 * Used during the account activation flow to look up the pending user.
 * @param { string } activationToken - The 32-character hex activation token.
 * @returns { Promise<User | null> } The matching user, or null if the token is invalid.
 */
export async function selectUserByActivationToken(activationToken: string): Promise<User | null> {

  const rowList = await sql `
    SELECT
      id,
      activation_token,
      email,
      hash,
      name,
      role
    FROM users
    WHERE activation_token = ${ activationToken }
  `

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
      activation_token,
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