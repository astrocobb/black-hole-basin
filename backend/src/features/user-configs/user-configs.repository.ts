import { type UserConfig, type UserConfigInput, UserConfigInputSchema, UserConfigSchema } from './user-configs.schema'
import { sql } from '../../lib/db'


/**
 * Inserts a new user config row into the database.
 * @param { UserConfigInput } data - The user config object to insert.
 * @returns { void }
 */
export async function insertUserConfigs(data: UserConfigInput): Promise<void> {

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
    gravelPackPrices,
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