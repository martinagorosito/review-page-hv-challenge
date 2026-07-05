import type { ReviewRepository } from '@domain/repositories/ReviewRepository'
import type { Review } from '@domain/entities/review.types'
import { ReviewFetchError } from '@domain/entities/errors'

export const fetchReview =
  (repository: ReviewRepository) =>
  async (id: string): Promise<Review> => {
    try {
      return await repository.getById(id)
    } catch (err) {
      throw new ReviewFetchError(id, err)
    }
  }
