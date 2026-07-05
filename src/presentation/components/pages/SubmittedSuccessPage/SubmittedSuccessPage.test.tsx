import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SubmittedSuccessPage } from './index'
import type { Review } from '@domain/entities/review.types'

const mockReview: Review = {
  id: 'r1',
  name: 'Appraisal_Report.pdf',
  uploadedAt: new Date('2025-01-01T00:00:00Z'),
  status: 'submitted',
  version: 3,
  user: { id: 'u1', firstName: 'Justin', lastName: 'Stevens' },
  issues: [
    { id: 'i1', title: 'Minor issue', description: 'desc', severity: 'minor', page: 1 },
  ],
  document: { pdfUrl: '/test.pdf', pages: [] },
}

const mockSubmittedAt = new Date('2025-10-26T09:14:00Z')

describe('SubmittedSuccessPage', () => {
  it('renders "Review submitted" heading', () => {
    render(<SubmittedSuccessPage review={mockReview} submittedAt={mockSubmittedAt} />)
    expect(screen.getByRole('heading', { name: 'Review submitted' })).toBeInTheDocument()
  })

  it('renders the review name in the subtitle', () => {
    render(<SubmittedSuccessPage review={mockReview} submittedAt={mockSubmittedAt} />)
    const matches = screen.getAllByText('Appraisal_Report.pdf', { exact: false })
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the success icon', () => {
    const { container } = render(<SubmittedSuccessPage review={mockReview} submittedAt={mockSubmittedAt} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('renders version in the info table', () => {
    render(<SubmittedSuccessPage review={mockReview} submittedAt={mockSubmittedAt} />)
    expect(screen.getByText('v3')).toBeInTheDocument()
  })

  it('renders submitted by in the info table', () => {
    render(<SubmittedSuccessPage review={mockReview} submittedAt={mockSubmittedAt} />)
    expect(screen.getByText('Justin Stevens')).toBeInTheDocument()
  })

  it('renders "View document" and "Back to dashboard" buttons', () => {
    render(<SubmittedSuccessPage review={mockReview} submittedAt={mockSubmittedAt} />)
    expect(screen.getByRole('button', { name: 'View document' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back to dashboard' })).toBeInTheDocument()
  })

  it('renders "Submitted" badge', () => {
    render(<SubmittedSuccessPage review={mockReview} submittedAt={mockSubmittedAt} />)
    expect(screen.getByText('Submitted')).toBeInTheDocument()
  })
})
