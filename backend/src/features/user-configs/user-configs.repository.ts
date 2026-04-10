import { type UserConfigInput, type UserConfig, UserConfigInputSchema, UserConfigSchema } from './user-configs.schema'
import { sql } from '../../lib/db'


/**
 * Inserts a new user config row into the database.
 * @param { UserConfigInput } data - The user config object to insert.
 * @returns { void }
 */
export async function insertUserConfig(data: UserConfigInput): Promise<void> {

  UserConfigInputSchema.parse(data)

  const {
    id,
    userId,
    name,
    costPerFoot,
    mobilizationFee,
    casingPrices,
    screenPrices,
    slotSize,
    gravelPackPrices
  } = data

  await sql`
    INSERT into user_configs (
      id,
      user_id,
      name,
      cost_per_foot,
      mobilization_fee,
      casing_prices,
      screen_prices,
      slot_size,
      gravel_pack_prices
    )
    VALUES (
      ${ id },
      ${ userId },
      ${ name },
      ${ sql.json(costPerFoot) },
      ${ mobilizationFee },
      ${ sql.json(casingPrices) },
      ${ sql.json(screenPrices) },
      ${ slotSize },
      ${ sql.json(gravelPackPrices) }
    )
  `
}

/**
 * Selects all user configs belonging to a specific user.
 * @param { string } userId - The UUID of the user whose configs to retrieve.
 * @returns { UserConfig[] } The list of user configs, ordered by creation date descending.
 */
export async function selectUserConfigsByUserId(userId: string): Promise<UserConfig[]> {

  const rowList = await sql`
    SELECT
      id,
      user_id,
      name,
      cost_per_foot,
      mobilization_fee,
      casing_prices,
      screen_prices,
      slot_size,
      gravel_pack_prices,
      created_at,
      updated_at
    FROM
      user_configs
    WHERE
      user_id = ${ userId }
    ORDER BY
      created_at DESC
  `

  return UserConfigSchema.array().parse(rowList)
}

/**
 * Selects a single user config by its unique ID.
 * @param { string } id - The UUID of the user config to find.
 * @returns { Promise<UserConfig | null> } The matching user config, or null if not found.
 */
export async function selectUserConfigById(id: string): Promise<UserConfig | null> {

  const rowList = await sql`
    SELECT
      id,
      user_id,
      name,
      cost_per_foot,
      mobilization_fee,
      casing_prices,
      screen_prices,
      slot_size,
      gravel_pack_prices,
      created_at,
      updated_at
    FROM
      user_configs
    WHERE
      id = ${ id }
  `

  // Parse and validate the query result, expecting at most one row
  const result = UserConfigSchema.array().max(1).parse(rowList)

  return result[0] ?? null
}

/**
 * Updates an existing user config row in the database.
 * @param { UserConfigInput } data - The user config object with updated fields.
 * @returns { void }
 */
export async function updateUserConfig(data: UserConfigInput): Promise<void> {

  UserConfigInputSchema.parse(data)

  const {
    id,
    name,
    costPerFoot,
    mobilizationFee,
    casingPrices,
    screenPrices,
    slotSize,
    gravelPackPrices
  } = data

  await sql`
    UPDATE user_configs
    SET
      name               = ${ name },
      cost_per_foot      = ${ sql.json(costPerFoot) },
      mobilization_fee   = ${ mobilizationFee },
      casing_prices      = ${ sql.json(casingPrices) },
      screen_prices      = ${ sql.json(screenPrices) },
      slot_size          = ${ slotSize },
      gravel_pack_prices = ${ sql.json(gravelPackPrices) }
    WHERE
      id = ${ id }
  `
}

/**
 * Deletes a user config row from the database.
 * @param { string } id - The UUID of the user config to delete.
 * @returns { void }
 */
export async function deleteUserConfig(id: string): Promise<void> {
  await sql`
    DELETE
    FROM
      user_configs
    WHERE
      id = ${ id }
  `
}