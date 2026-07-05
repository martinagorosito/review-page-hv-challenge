import type { ReviewRepository } from '@domain/repositories/ReviewRepository'
import type { Review } from '@domain/entities/review.types'
import { reviewMockData } from '@infrastructure/api/reviewMockData'

export class MockReviewRepository implements ReviewRepository {
  async getById(_id: string): Promise<Review> {
    return Promise.resolve(reviewMockData)
  }

  async submit(_id: string): Promise<void> {
    return Promise.resolve()
  }
}
