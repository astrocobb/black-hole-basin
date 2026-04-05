/**
 * Standardized API response shape used by all endpoints.
 * Every response from the backend conforms to this structure.
 */
export interface Status<T = unknown> {
  // HTTP status code (e.g. 200, 400, 500).
  status: number
  // Response payload, or null when no data is returned.
  data: T | null
  // Human-readable message describing the result, or null.
  message: string | null
}