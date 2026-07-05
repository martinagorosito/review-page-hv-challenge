import { describe, it, expect, vi } from 'vitest'
import { fetchReview } from './fetchReview'
import { ReviewFetchError } from '@domain/entities/errors'
import type { ReviewRepository } from '@domain/repositories/ReviewRepository'
import type { Review } from '@domain/entities/review.types'

const mockReview: Review = {
  id: 'review-1',
  name: 'Test Review',
  uploadedAt: new Date('2025-01-01'),
  status: 'on_review',
  version: 1,
  user: { id: 'u1', firstName: 'Jane', lastName: 'Doe' },
  document: { pdfUrl: '/doc.pdf', pages: [] },
  issues: [],
}

const makeRepository = (overrides?: Partial<ReviewRepository>): ReviewRepository => ({
  getById: vi.fn().mockResolvedValue(mockReview),
  submit: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('fetchReview', () => {
  it('calls repository.getById with the correct id', async () => {
    const getById = vi.fn().mockResolvedValue(mockReview)
    const repository = makeRepository({ getById })
    await fetchReview(repository)('review-1')
    expect(getById).toHaveBeenCalledWith('review-1')
  })

  it('returns the review from the repository', async () => {
    const repository = makeRepository()
    const result = await fetchReview(repository)('review-1')
    expect(result).toEqual(mockReview)
  })

  it('wraps repository errors in ReviewFetchError', async () => {
    const cause = new Error('Repository failure')
    const repository = makeRepository({
      getById: vi.fn().mockRejectedValue(cause),
    })
    await expect(fetchReview(repository)('review-1')).rejects.toThrow(ReviewFetchError)
  })

  it('preserves the original error as cause', async () => {
    const cause = new Error('Repository failure')
    const repository = makeRepository({
      getById: vi.fn().mockRejectedValue(cause),
    })
    try {
      await fetchReview(repository)('review-1')
    } catch (err) {
      expect((err as ReviewFetchError).cause).toBe(cause)
    }
  })
})
