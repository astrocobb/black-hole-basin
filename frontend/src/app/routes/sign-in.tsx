import React, { useState } from 'react'


/**
 * Authentication page component that toggles between sign-in and sign-up forms.
 * Manages the active form state and renders the appropriate form component.
 *  { JSX.Element} The sign-in/sign-up page layout.
 */
export default function SignIn() {
  // Tracks whether the sign-up form is shown (true) or the sign-in form (false)
  const [ isSignUp, setIsSignUp ] = useState(false)

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      {/* Site header with contextual subtitle */}
      <header className="border-b border-gray-700 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white">Black Hole Basin</h1>
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
 *  { JSX.Element} The sign-in form markup.
 */
function SignInForm() {
  return (
    <form className="flex flex-col gap-6">
      {/* Email field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-400">
          Email
        </label>
        <input
          id="email"
          type="email"
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
          type="password"
          placeholder="Enter your password"
          className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  )
}


/**
 * Sign-up form component with name, email, password, and confirm password fields.
 *  { JSX.Element} The sign-up form markup.
 */
function SignUpForm() {
  return (
    <form className="flex flex-col gap-6">
      {/* Name field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-400">
          Name
        </label>
        <input
          id="name"
          type="text"
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
          type="email"
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
            type="password"
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
            type="password"
            placeholder="Confirm password"
            className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700"
      >
        Create Account
      </button>
    </form>
  )
}
