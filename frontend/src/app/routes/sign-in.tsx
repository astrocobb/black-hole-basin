import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { v7 as uuid } from 'uuid'
import { signIn } from '../../features/auth/api/sign-in'
import { signUp } from '../../features/auth/api/sign-up'
import { useAuth } from '../../features/auth/hooks/use-auth'


/**
 * Authentication page component that toggles between sign-in and sign-up forms.
 * Manages the active form state and renders the appropriate form component.
 * @returns { JSX.Element } The sign-in/sign-up page layout.
 */
export default function SignIn() {
  // Tracks whether the sign-up form is shown (true) or the sign-in form (false)
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      {/* Site header with contextual subtitle */}
      <header className="border-b border-gray-700 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight text-white hover:text-gray-300 transition">
            Black Hole Basin
          </a>
          <span className="text-sm text-gray-500">{ isSignUp ? 'Create Account' : 'Sign In' }</span>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-10">
        <div className="rounded-md bg-gray-700 p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-gray-200">
            { isSignUp ? 'Create Account' : 'Sign In' }
          </h2>

          {/* Render the active form based on toggle state */}
          { isSignUp ? <SignUpForm/> : <SignInForm/> }

          {/* Toggle link to switch between sign-in and sign-up */}
          <p className="mt-6 text-center text-sm text-gray-400">
            { isSignUp ? 'Already have an account?' : 'Don\'t have an account?' }{ ' ' }
            <button
              type="button"
              onClick={ () => setIsSignUp(!isSignUp) }
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              { isSignUp ? 'Sign In' : 'Sign Up' }
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}


/**
 * Sign-in form component with email and password fields.
 * Submits credentials to the backend API and redirects to the dashboard on success.
 * @returns { JSX.Element } The sign-in form markup.
 */
function SignInForm() {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Handles form submission by sending credentials to the sign-in API.
   * Stores the JWT and redirects on success, or displays an error message.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { response, token } = await signIn({ email, password })

      if (response.status === 200 && token) {
        // Store the JWT and redirect to the dashboard
        setToken(token)
        navigate('/dashboard')
      } else {
        setError(response.message)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={ handleSubmit } className="flex flex-col gap-6">
      {/* Error message display */}
      { error && (
        <p className="rounded-md bg-red-900/50 px-4 py-2.5 text-sm text-red-300">{ error }</p>
      ) }

      {/* Email field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={ loading }
        className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50"
      >
        { loading ? 'Signing in...' : 'Sign In' }
      </button>
    </form>
  )
}


/**
 * Sign-up form component with name, email, password, and confirm password fields.
 * Submits registration data to the backend API and displays the result message.
 * @returns { JSX.Element } The sign-up form markup.
 */
function SignUpForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Handles form submission by generating a UUID, setting the default role,
   * and sending registration data to the sign-up API.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string

    try {
      const response = await signUp({
        id: uuid(),        // Generate a UUID v7 for the new user
        email,
        password,
        passwordConfirm,
        name,
        role: 'user'       // Default role for new registrations
      })

      if (response.status === 201) {
        setSuccess(response.message)
      } else {
        setError(response.message)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show the success message after a successful registration
  if (success) {
    return (
      <div className="text-center">
        <p className="rounded-md bg-green-900/50 px-4 py-3 text-sm text-green-300">{ success }</p>
      </div>
    )
  }

  return (
    <form onSubmit={ handleSubmit } className="flex flex-col gap-6">
      {/* Error message display */}
      { error && (
        <p className="rounded-md bg-red-900/50 px-4 py-2.5 text-sm text-red-300">{ error }</p>
      ) }

      {/* Name field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-400">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="signup-email" className="text-sm font-medium text-gray-400">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Password and confirm password fields side-by-side */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-password" className="text-sm font-medium text-gray-400">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            required
            placeholder="Min. 8 characters"
            className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-gray-400">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="passwordConfirm"
            type="password"
            required
            placeholder="Confirm password"
            className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={ loading }
        className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50"
      >
        { loading ? 'Creating Account...' : 'Create Account' }
      </button>
    </form>
  )
}
