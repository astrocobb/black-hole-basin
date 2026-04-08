/**
 * Auth context and hook for managing authentication state across the app.
 * Stores the JWT in localStorage and decodes it to extract user claims.
 * Provides sign-in, sign-out, and auth state to all child components.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AUTH_TOKEN_KEY } from '../../../lib/api-client'

/** User claims extracted from the decoded JWT payload. */
export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

/** Shape of the auth context value provided to consumers. */
interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setToken: (token: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Decodes a JWT and extracts the user claims from the payload.
 * Does NOT verify the signature — that's the backend's responsibility.
 * @param { string } token - The raw JWT string.
 * @returns { AuthUser | null } The decoded user claims, or null if decoding fails.
 */
function decodeToken(token: string): AuthUser | null {
  try {
    // JWT structure: header.payload.signature — we need the payload
    const payload = token.split('.')[1]
    if (!payload) return null

    const decoded = JSON.parse(atob(payload))

    // The backend stores user claims under the 'auth' key in the JWT
    return decoded.auth ?? null
  } catch {
    return null
  }
}

/**
 * Checks if a JWT has expired by reading its 'exp' claim.
 * @param { string } token - The raw JWT string.
 * @returns { boolean } True if the token has expired or can't be decoded.
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1]
    if (!payload) return true

    const decoded = JSON.parse(atob(payload))
    const now = Math.floor(Date.now() / 1000)

    return decoded.exp < now
  } catch {
    return true
  }
}

/**
 * Auth provider component that wraps the app and provides auth state.
 * Initializes auth state from localStorage on mount (client-side only).
 * @param {{ children: React.ReactNode }} props - Child components to wrap.
 * @returns { JSX.Element } The provider wrapping its children.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount, restore auth state from a previously stored JWT
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY)
    if (stored && !isTokenExpired(stored)) {
      setUser(decodeToken(stored))
    } else if (stored) {
      // Clear expired token
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
    setIsLoading(false)
  }, [])

  /**
   * Stores a new JWT and updates the user state from its claims.
   * Called after a successful sign-in.
   */
  const setToken = useCallback((token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    setUser(decodeToken(token))
  }, [])

  /**
   * Clears the stored JWT and resets the user state.
   * Called when the user signs out.
   */
  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    setToken,
    signOut
  }

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  )
}

/**
 * Hook to access the auth context from any component.
 * Must be used within an AuthProvider.
 * @returns { AuthContextValue } The current auth state and actions.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
