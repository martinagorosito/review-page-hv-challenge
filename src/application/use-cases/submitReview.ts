import type { ReviewRepository } from '@domain/repositories/ReviewRepository'

export const submitReview =
  (repository: ReviewRepository) =>
  async (id: string): Promise<void> => {
    return repository.submit(id)
  }
