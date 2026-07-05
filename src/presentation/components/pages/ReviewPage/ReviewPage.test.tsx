import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReviewPage } from './index'
import type { Review } from '@domain/entities/review.types'

vi.mock('@shared/observability', () => ({
  observability: {
    trackEvent: vi.fn(),
    trackError: vi.fn(),
    startSpan: vi.fn().mockReturnValue({ traceId: 't1', spanId: 's1', name: 'n', startTime: 0 }),
    endSpan: vi.fn(),
    setUserContext: vi.fn(),
    trackMetric: vi.fn(),
  },
}))

vi.mock('@presentation/components/organisms/PdfViewer', () => ({
  PdfViewer: vi.fn().mockImplementation((_props: unknown) => <div data-testid="pdf-viewer" />),
}))

const mockReview: Review = {
  id: 'review-1',
  name: 'Annual Compliance Report',
  uploadedAt: new Date('2025-01-01T00:00:00Z'),
  status: 'on_review',
  version: 2,
  user: { id: 'user-1', firstName: 'Jane', lastName: 'Cooper' },
  issues: [
    {
      id: 'issue-minor-1',
      title: 'Minor formatting issue',
      description: 'A minor problem.',
      severity: 'minor',
      page: 1,
    },
  ],
  document: { pdfUrl: '/test.pdf', pages: [] },
}

vi.mock('@infrastructure/repositories/MockReviewRepository', () => ({
  MockReviewRepository: vi.fn().mockImplementation(() => ({
    getById: vi.fn().mockResolvedValue(mockReview),
    submit: vi.fn().mockResolvedValue(undefined),
  })),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ReviewPage', () => {
  it('renders loading state initially', () => {
    render(<ReviewPage reviewId="review-1" />)
    expect(screen.getByText('Loading review...')).toBeInTheDocument()
  })

  it('renders DocSubHeader with review name after load', async () => {
    render(<ReviewPage reviewId="review-1" />)
    await waitFor(() => {
      expect(screen.getByText('Annual Compliance Report')).toBeInTheDocument()
    })
  })

  it('renders PdfViewer after load', async () => {
    render(<ReviewPage reviewId="review-1" />)
    await waitFor(() => {
      expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument()
    })
  })

  it('renders IssueList after load', async () => {
    render(<ReviewPage reviewId="review-1" />)
    await waitFor(() => {
      expect(screen.getByText('Minor formatting issue')).toBeInTheDocument()
    })
  })

  it('shows SubmittedSuccessPage after submit', async () => {
    const user = userEvent.setup()
    render(<ReviewPage reviewId="review-1" />)

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /submit review/i })[0]).toBeInTheDocument()
    })

    await user.click(screen.getAllByRole('button', { name: /submit review/i })[0])

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Review submitted' })).toBeInTheDocument()
    })
  })
})
