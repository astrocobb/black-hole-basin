import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { apiClient } from '../../lib/api-client'


/**
 * Account activation page component.
 * Reads the activation token from the URL query string and provides
 * a button to submit it to the backend. Displays success, error,
 * or invalid-link states based on the activation result.
 * @returns { JSX.Element } The account activation page layout.
 */
export default function Activate() {
  const [ searchParams ] = useSearchParams()

  // Extract the activation token from the ?token= query parameter
  const token = searchParams.get('token')

  // Tracks the current activation flow state
  const [ status, setStatus ] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [ message, setMessage ] = useState('')

  /**
   * Sends the activation token to the backend API to activate the user's account.
   * Updates the component state based on the API response.
   */
  async function handleActivate() {
    setStatus('loading')
    try {
      const response = await apiClient('/api/auth/activation', {
        method: 'POST',
        body: JSON.stringify({ token })
      })
      const data = await response.json()
      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      { /* Site header with page subtitle */ }
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </Link>
          <span className="text-sm text-neutral-content/70">Account Activation</span>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-10">
        <div className="rounded-md border border-base-300 bg-base-100 p-6 shadow-lg text-center">
          { /* Conditional rendering based on token presence and activation status */ }
          { !token ? (
            <p className="text-neutral-content">Invalid activation link. No token provided.</p>
          ) : status === 'success' ? (
            <>
              <h2 className="text-lg font-semibold">Account Activated</h2>
              <p className="mt-2 text-sm text-neutral-content">{ message }</p>
              <Link
                to="/sign-in"
                className="mt-6 inline-block rounded-md bg-primary px-6 py-2.5 font-medium text-primary-content transition hover:bg-primary/90 active:bg-primary/80"
              >
                Sign In
              </Link>
            </>
          ) : status === 'error' ? (
            <>
              <h2 className="text-lg font-semibold">Activation Failed</h2>
              <p className="mt-2 text-sm text-neutral-content">{ message }</p>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-lg font-semibold">Activate Your Account</h2>
              <button
                type="button"
                onClick={ handleActivate }
                disabled={ status === 'loading' }
                className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-primary-content transition hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50"
              >
                { status === 'loading' ? 'Activating...' : 'Activate Account' }
              </button>
            </>
          ) }
        </div>
      </main>
    </div>
  )
}
