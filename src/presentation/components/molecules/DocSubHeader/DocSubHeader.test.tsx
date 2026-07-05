import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DocSubHeader } from './index'
import type { Review } from '@domain/entities/review.types'

const mockReview: Review = {
  id: 'review-1',
  name: 'Annual Compliance Report',
  uploadedAt: new Date(2025, 0, 1), // Jan 1, 2025 local time — avoids UTC timezone shift
  status: 'on_review',
  version: 2,
  user: { id: 'user-1', firstName: 'Jane', lastName: 'Cooper' },
  issues: [],
  document: { pdfUrl: '/test.pdf', pages: [] },
}

const defaultProps = {
  review: mockReview,
  canSubmit: true,
  isSubmitting: false,
  onSubmit: vi.fn().mockResolvedValue(undefined),
}

describe('DocSubHeader', () => {
  it('renders review name', () => {
    render(<DocSubHeader {...defaultProps} />)
    expect(screen.getByText('Annual Compliance Report')).toBeInTheDocument()
  })

  it('renders formatted uploaded date in metadata row', () => {
    render(<DocSubHeader {...defaultProps} />)
    expect(screen.getByText(/Jan 1, 2025/)).toBeInTheDocument()
  })

  it('renders version in metadata row', () => {
    render(<DocSubHeader {...defaultProps} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders correct status badge for on_review', () => {
    render(<DocSubHeader {...defaultProps} />)
    expect(screen.getByText('On review')).toBeInTheDocument()
  })

  it('renders assigned user name', () => {
    render(<DocSubHeader {...defaultProps} />)
    expect(screen.getByText('Jane Cooper')).toBeInTheDocument()
  })

  it('submit button is enabled when canSubmit is true', () => {
    render(<DocSubHeader {...defaultProps} canSubmit={true} />)
    expect(screen.getByRole('button', { name: /submit review/i })).not.toBeDisabled()
  })

  it('submit button is disabled when canSubmit is false', () => {
    render(<DocSubHeader {...defaultProps} canSubmit={false} />)
    expect(screen.getByRole('button', { name: /submit review/i })).toBeDisabled()
  })
})
