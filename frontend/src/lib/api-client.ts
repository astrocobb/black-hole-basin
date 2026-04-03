/**
 * Shared API client for making authenticated requests to the backend.
 * Wraps fetch with the base URL, JSON headers, credentials, and JWT authorization.
 */

/** localStorage key used to persist the JWT across page reloads. */
export const AUTH_TOKEN_KEY = 'authorization'

/**
 * Sends a JSON request to the backend API.
 * Automatically attaches credentials (session cookie) and the stored JWT.
 * @param { string } path - The API path (e.g. '/api/auth/sign-in').
 * @param { RequestInit } options - Fetch options (method, body, etc.).
 * @returns { Promise<Response> } The raw fetch Response.
 */
export async function apiClient(path: string, options: RequestInit = {}): Promise<Response> {

  // Read the stored JWT token for authenticated requests
  const token = typeof window !== 'undefined'
    ? localStorage.getItem(AUTH_TOKEN_KEY)
    : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  }

  // Attach the JWT as the Authorization header if available
  if (token) {
    headers['Authorization'] = token
  }

  return fetch(`${ import.meta.env.VITE_REST_API_URL }${ path }`, {
    ...options,
    headers,
    credentials: 'include' // Required for session cookies
  })
}
