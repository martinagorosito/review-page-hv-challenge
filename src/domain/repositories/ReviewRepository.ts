import type { Review } from '@domain/entities/review.types'

export interface ReviewRepository {
  getById(id: string): Promise<Review>
  submit(id: string): Promise<void>
}
