import type { Review } from '@domain/entities/review.types'

export interface DocSubHeaderProps {
  review: Review
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => Promise<void>
}
