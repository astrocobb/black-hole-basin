/** Base class for all application errors. */
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

/** Custom error classes for specific HTTP status codes. */
export class BadRequestError extends AppError {
  constructor(message: string) { super(400, message) }
}

export class UnauthorizedError extends AppError {
  constructor(message:string) { super(401, message) }
}

export class ForbiddenError extends AppError {
  constructor(message: string) { super(403, message) }
}

export class NotFoundError extends AppError {
  constructor(message: string) { super(404, message) }
}

export class ConflictError extends AppError {
  constructor(message: string) { super(409, message) }
}

export class InternalServerError extends AppError {
  constructor(message: string) { super(500, message) }
}