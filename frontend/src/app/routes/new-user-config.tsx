import { useActionState, useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router'
import { v7 as uuid } from 'uuid'
import type { Route } from './+types/new-user-config'
import { AUTH_TOKEN_KEY } from '../../lib/api-client'
import { createUserConfig } from '../../features/user-configs/api/create-user-config'


/**
 * Client loader that gates the new-user-config route behind a valid JWT.
 * Extracts the session user id from the token for later use when submitting.
 * @param { Route.ClientLoaderArgs } _args - React Router client loader args (unused).
 * @returns { Promise<{ userId: string }> } The signed-in user's id.
 */
export async function clientLoader(_args: Route.ClientLoaderArgs) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) throw redirect('/sign-in')

  const payload = token.split('.')[1]
  const decoded = payload ? JSON.parse(atob(payload)) : null
  const userId = decoded?.auth?.id
  if (!userId) throw redirect('/sign-in')

  return { userId }
}

interface PriceRow {
  key: string
  value: string
}

const emptyRow = (): PriceRow => ({ key: '', value: '' })

function rowsToRecord(rows: PriceRow[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const row of rows) {
    const key = row.key.trim()
    if (!key) continue
    const num = Number(row.value)
    if (Number.isNaN(num)) continue
    out[key] = num
  }
  return out
}

export default function NewUserConfig({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData
  const navigate = useNavigate()

  const [ costPerFoot, setCostPerFoot ] = useState<PriceRow[]>([ emptyRow() ])
  const [ casingPrices, setCasingPrices ] = useState<PriceRow[]>([ emptyRow() ])
  const [ screenPrices, setScreenPrices ] = useState<PriceRow[]>([ emptyRow() ])
  const [ gravelPackPrices, setGravelPackPrices ] = useState<PriceRow[]>([ emptyRow() ])

  const [ error, submitAction, isPending ] = useActionState(
    async (_prev: string, formData: FormData) => {
      const name = (formData.get('name') as string).trim()
      const mobilizationFee = Number(formData.get('mobilizationFee'))
      const slotSize = Number(formData.get('slotSize'))

      if (!name) return 'Please provide a config name.'

      try {
        const response = await createUserConfig({
          id: uuid(),
          userId,
          name,
          mobilizationFee,
          slotSize,
          costPerFoot: rowsToRecord(costPerFoot),
          casingPrices: rowsToRecord(casingPrices),
          screenPrices: rowsToRecord(screenPrices),
          gravelPackPrices: rowsToRecord(gravelPackPrices)
        })
        if (response.status === 201) {
          navigate('/dashboard')
          return ''
        }
        return response.message
      } catch {
        return 'Something went wrong. Please try again.'
      }
    },
    ''
  )

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </Link>
          <span className="text-sm text-neutral-content/70">New Config</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold">New Config</h2>

          <form action={ submitAction } className="flex flex-col gap-6">
            { error && (
              <p className="rounded-md bg-error/20 px-4 py-2.5 text-sm text-error">{ error }</p>
            ) }

            <Field label="Name" id="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Default Pricing 2026"
                className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Mobilization Fee ($)" id="mobilizationFee">
                <input
                  id="mobilizationFee"
                  name="mobilizationFee"
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="e.g. 1500"
                  className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>

              <Field label="Slot Size (in)" id="slotSize">
                <input
                  id="slotSize"
                  name="slotSize"
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="e.g. 0.02"
                  className="rounded-md border border-base-300 bg-base-100 px-4 py-2.5 text-base-content placeholder-neutral-content/50 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>
            </div>

            <PriceMap
              title="Cost Per Foot"
              description="Depth range (ft) → drilling $/ft"
              keyLabel="Depth Range"
              keyPlaceholder="e.g. 0-200"
              rows={ costPerFoot }
              setRows={ setCostPerFoot }
            />

            <PriceMap
              title="Casing Prices"
              description="Casing diameter (in) → $/ft"
              keyLabel="Diameter"
              keyPlaceholder="e.g. 6"
              rows={ casingPrices }
              setRows={ setCasingPrices }
            />

            <PriceMap
              title="Screen Prices"
              description="Screen diameter (in) → $/ft"
              keyLabel="Diameter"
              keyPlaceholder="e.g. 6"
              rows={ screenPrices }
              setRows={ setScreenPrices }
            />

            <PriceMap
              title="Gravel Pack Prices"
              description="Casing diameter (in) → $/ft"
              keyLabel="Diameter"
              keyPlaceholder="e.g. 6"
              rows={ gravelPackPrices }
              setRows={ setGravelPackPrices }
            />

            <div className="flex gap-3 mt-2">
              <Link
                to="/dashboard"
                className="flex-1 rounded-md border border-base-300 px-4 py-2.5 font-medium text-neutral-content transition hover:bg-base-200 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={ isPending }
                className="flex-1 rounded-md bg-primary px-4 py-2.5 font-medium text-primary-content transition hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50"
              >
                { isPending ? 'Creating...' : 'Create Config' }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={ id } className="text-sm font-medium text-neutral-content">
        { label }
      </label>
      { children }
    </div>
  )
}

interface PriceMapProps {
  title: string
  description: string
  keyLabel: string
  keyPlaceholder: string
  rows: PriceRow[]
  setRows: (rows: PriceRow[]) => void
}

function PriceMap({ title, description, keyLabel, keyPlaceholder, rows, setRows }: PriceMapProps) {
  function updateRow(index: number, patch: Partial<PriceRow>) {
    setRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function addRow() {
    setRows([ ...rows, emptyRow() ])
  }

  function removeRow(index: number) {
    setRows(rows.length === 1 ? [ emptyRow() ] : rows.filter((_, i) => i !== index))
  }

  return (
    <fieldset className="rounded-md border border-base-300 p-4">
      <legend className="px-2 text-sm font-semibold">{ title }</legend>
      <p className="mb-3 text-xs text-neutral-content/70">{ description }</p>

      <div className="flex flex-col gap-2">
        { rows.map((row, i) => (
          <div key={ i } className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              type="text"
              value={ row.key }
              onChange={ e => updateRow(i, { key: e.target.value }) }
              placeholder={ keyPlaceholder }
              aria-label={ keyLabel }
              className="rounded-md border border-base-300 bg-base-100 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              step="any"
              value={ row.value }
              onChange={ e => updateRow(i, { value: e.target.value }) }
              placeholder="Price"
              aria-label={ `${ title } price` }
              className="rounded-md border border-base-300 bg-base-100 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={ () => removeRow(i) }
              className="rounded-md border border-base-300 px-3 text-sm text-neutral-content transition hover:bg-base-200"
              aria-label="Remove row"
            >
              &times;
            </button>
          </div>
        )) }
      </div>

      <button
        type="button"
        onClick={ addRow }
        className="mt-3 rounded-md border border-base-300 px-3 py-1.5 text-xs text-neutral-content transition hover:bg-base-200"
      >
        + Add row
      </button>
    </fieldset>
  )
}
