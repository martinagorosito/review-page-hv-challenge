export class ReviewFetchError extends Error {
  constructor(id: string, cause?: unknown) {
    super(`Failed to fetch review "${id}"`)
    this.name = 'ReviewFetchError'
    if (cause instanceof Error) this.cause = cause
  }
}

export class ReviewSubmitError extends Error {
  constructor(id: string, cause?: unknown) {
    super(`Failed to submit review "${id}"`)
    this.name = 'ReviewSubmitError'
    if (cause instanceof Error) this.cause = cause
  }
}
