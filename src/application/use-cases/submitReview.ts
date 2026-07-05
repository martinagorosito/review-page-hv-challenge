import type { ReviewRepository } from '@domain/repositories/ReviewRepository'
import { ReviewSubmitError } from '@domain/entities/errors'

export const submitReview =
  (repository: ReviewRepository) =>
  async (id: string): Promise<void> => {
    try {
      return await repository.submit(id)
    } catch (err) {
      throw new ReviewSubmitError(id, err)
    }
  }
