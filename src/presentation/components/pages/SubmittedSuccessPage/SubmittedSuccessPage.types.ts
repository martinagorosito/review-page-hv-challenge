import type { Review } from '@domain/entities/review.types'

export interface SubmittedSuccessPageProps {
  review: Review
  submittedAt: Date
}
