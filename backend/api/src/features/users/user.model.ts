import { z } from 'zod/v4'
import { sql } from '../../utils/database.utils'


export const UserSchema = z.object({
  id: z.uuidv7('Please provide a valid uuid for id.'),
  activationToken: z.string('Please provide a valid activation token.')
    .length(32, 'User activation token must be 32 characters.')
    .nullable(),
  email: z.string('Please provide a valid email address.')
    .max(128, 'Email address must be less than 128 characters.'),
  hash: z.string('Please provide a valid hash.')
    .length(97, 'Hash address must be 97 characters (argon2).'),
  name: z.string('Please provide a valid name.')
    .min(1, 'Name must be at least 1 character.')
    .max(32, 'Name must be less than 32 characters.'),
  role: z.string('Please provide a valid role.')
    .min(1, 'Role must be at least 1 character.')
    .max(16, 'Role must be less than 16 characters.')
})

export type User = z.infer<typeof UserSchema>

/**
 * Inserts a new user into the database
 * @param user that will be put in the database
 * @returns { Promise<string> } 'User successfully created!'
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
 * Updates a user in the database.
 * @param user that will be updated.
 * returns { Promise<string> } 'User successfully updated!'
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