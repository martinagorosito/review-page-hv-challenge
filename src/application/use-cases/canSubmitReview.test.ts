import { describe, it, expect } from 'vitest'
import { canSubmitReview } from './canSubmitReview'
import type { Review } from '@domain/entities/review.types'

const baseReview: Review = {
  id: 'test-id',
  name: 'Test Review',
  uploadedAt: new Date('2025-01-01'),
  status: 'on_review',
  version: 1,
  user: { id: 'u1', firstName: 'Jane', lastName: 'Doe' },
  document: { pdfUrl: '/doc.pdf', pages: [] },
  issues: [],
}

describe('canSubmitReview', () => {
  it('returns false when review has critical issues', () => {
    const review: Review = {
      ...baseReview,
      issues: [
        { id: 'i1', title: 'Critical issue', description: '', severity: 'critical', page: 1 },
      ],
    }
    expect(canSubmitReview(review)).toBe(false)
  })

  it('returns false when review has major issues', () => {
    const review: Review = {
      ...baseReview,
      issues: [
        { id: 'i1', title: 'Major issue', description: '', severity: 'major', page: 1 },
      ],
    }
    expect(canSubmitReview(review)).toBe(false)
  })

  it('returns false when review has both critical and major issues', () => {
    const review: Review = {
      ...baseReview,
      issues: [
        { id: 'i1', title: 'Critical issue', description: '', severity: 'critical', page: 1 },
        { id: 'i2', title: 'Major issue', description: '', severity: 'major', page: 2 },
      ],
    }
    expect(canSubmitReview(review)).toBe(false)
  })

  it('returns true when review has only minor issues', () => {
    const review: Review = {
      ...baseReview,
      issues: [
        { id: 'i1', title: 'Minor issue', description: '', severity: 'minor', page: 1 },
      ],
    }
    expect(canSubmitReview(review)).toBe(true)
  })

  it('returns true when review has no issues at all', () => {
    const review: Review = { ...baseReview, issues: [] }
    expect(canSubmitReview(review)).toBe(true)
  })
})
