import type { Review } from '@domain/entities/review.types'

export const canSubmitReview = (review: Review): boolean => {
  return !review.issues.some(
    (issue) => issue.severity === 'critical' || issue.severity === 'major'
  )
}
