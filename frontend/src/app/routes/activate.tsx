import React, { useState } from 'react'
import { useSearchParams } from 'react-router'
import { apiClient } from '../../lib/api-client'


/**
 * Account activation page component.
 * Reads the activation token from the URL query string and provides
 * a button to submit it to the backend. Displays success, error,
 * or invalid-link states based on the activation result.
 * @returns { JSX.Element } The account activation page layout.
 */
export default function Activate() {
  const [searchParams] = useSearchParams()

  // Extract the activation token from the ?token= query parameter
  const token = searchParams.get('token')

  // Tracks the current activation flow state
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  /**
   * Sends the activation token to the backend API to activate the user's account.
   * Updates the component state based on the API response.
   */
  async function handleActivate() {
    setStatus('loading')
    try {
      const response = await apiClient('/api/auth/activation', {
        method: 'POST',
        body: JSON.stringify({ activation: token })
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
    <div className="min-h-screen bg-gray-800 text-gray-100">
      {/* Site header with page subtitle */}
      <header className="border-b border-gray-700 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight text-white hover:text-gray-300 transition">
            Black Hole Basin
          </a>
          <span className="text-sm text-gray-500">Account Activation</span>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-10">
        <div className="rounded-md bg-gray-700 p-6 shadow-lg text-center">
          {/* Conditional rendering based on token presence and activation status */}
          {!token ? (
            <p className="text-gray-400">Invalid activation link. No token provided.</p>
          ) : status === 'success' ? (
            <>
              <h2 className="text-lg font-semibold text-gray-200">Account Activated</h2>
              <p className="mt-2 text-sm text-gray-400">{message}</p>
              <a
                href="/sign-in"
                className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700"
              >
                Sign In
              </a>
            </>
          ) : status === 'error' ? (
            <>
              <h2 className="text-lg font-semibold text-gray-200">Activation Failed</h2>
              <p className="mt-2 text-sm text-gray-400">{message}</p>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-lg font-semibold text-gray-200">Activate Your Account</h2>
              <button
                type="button"
                onClick={handleActivate}
                disabled={status === 'loading'}
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50"
              >
                {status === 'loading' ? 'Activating...' : 'Activate Account'}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
