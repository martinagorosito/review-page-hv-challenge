import { describe, it, expect, vi } from 'vitest'
import { submitReview } from './submitReview'
import type { ReviewRepository } from '@domain/repositories/ReviewRepository'

const makeRepository = (overrides?: Partial<ReviewRepository>): ReviewRepository => ({
  getById: vi.fn(),
  submit: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('submitReview', () => {
  it('calls repository.submit with the correct id', async () => {
    const submit = vi.fn().mockResolvedValue(undefined)
    const repository = makeRepository({ submit })
    await submitReview(repository)('review-1')
    expect(submit).toHaveBeenCalledWith('review-1')
  })

  it('resolves without returning a value', async () => {
    const repository = makeRepository()
    await expect(submitReview(repository)('review-1')).resolves.toBeUndefined()
  })

  it('propagates repository errors', async () => {
    const error = new Error('Submit failure')
    const repository = makeRepository({
      submit: vi.fn().mockRejectedValue(error),
    })
    await expect(submitReview(repository)('review-1')).rejects.toThrow('Submit failure')
  })
})
