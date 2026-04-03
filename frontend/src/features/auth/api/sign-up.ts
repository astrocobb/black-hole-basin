/**
 * API fetcher for the sign-up endpoint.
 * Sends registration data to the backend to create a new user account.
 */

import { apiClient } from '../../../lib/api-client'

/** Shape of the sign-up request body. */
export interface SignUpRequest {
  id: string
  email: string
  password: string
  passwordConfirm: string
  name: string
  role: string
}

/** Shape of the API response from the sign-up endpoint. */
export interface SignUpResponse {
  status: number
  data: null
  message: string
}

/**
 * Registers a new user account.
 * The backend will hash the password, generate an activation token, and send an activation email.
 * @param { SignUpRequest } data - The registration form data including generated UUID and default role.
 * @returns { Promise<SignUpResponse> } The API response with success/failure message.
 */
export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {

  const res = await apiClient('/api/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(data)
  })

  return await res.json()
}
