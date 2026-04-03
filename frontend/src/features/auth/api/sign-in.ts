/**
 * API fetcher for the sign-in endpoint.
 * Sends credentials to the backend and returns the JWT on success.
 */

import { apiClient } from '../../../lib/api-client'

/** Shape of the sign-in request body. */
export interface SignInRequest {
  email: string
  password: string
}

/** Shape of the API response from the sign-in endpoint. */
export interface SignInResponse {
  status: number
  data: null
  message: string
}

/**
 * Authenticates a user with email and password.
 * On success, extracts the JWT from the Authorization response header.
 * @param { SignInRequest } credentials - The user's email and password.
 * @returns { Promise<{ response: SignInResponse, token: string | null }> } The API response and JWT token.
 */
export async function signIn(credentials: SignInRequest): Promise<{ response: SignInResponse, token: string | null }> {

  const res = await apiClient('/api/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })

  const response: SignInResponse = await res.json()

  // Extract the JWT from the response header (set by the backend on success)
  const token = res.headers.get('authorization')

  return { response, token }
}
