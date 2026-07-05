import type { ReviewRepository } from '@domain/repositories/ReviewRepository'
import type { Review } from '@domain/entities/review.types'

export const fetchReview =
  (repository: ReviewRepository) =>
  async (id: string): Promise<Review> => {
    return repository.getById(id)
  }
