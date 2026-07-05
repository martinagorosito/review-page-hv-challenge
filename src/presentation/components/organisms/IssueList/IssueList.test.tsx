import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IssueList } from './index'
import type { Issue } from '@domain/entities/issue.types'

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

const criticalIssue: Issue = {
  id: 'c1',
  title: 'Critical issue',
  description: 'A critical problem',
  severity: 'critical',
  page: 1,
}

const majorIssue: Issue = {
  id: 'm1',
  title: 'Major issue',
  description: 'A major problem',
  severity: 'major',
  page: 2,
}

const minorIssue: Issue = {
  id: 'mn1',
  title: 'Minor issue',
  description: 'A minor problem',
  severity: 'minor',
  page: 3,
}

const allIssues: Issue[] = [criticalIssue, majorIssue, minorIssue]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('IssueList', () => {
  it('renders all three section headers when issues of all severities present', () => {
    render(<IssueList issues={allIssues} />)

    expect(screen.getByTestId('section-header-critical')).toBeInTheDocument()
    expect(screen.getByTestId('section-header-major')).toBeInTheDocument()
    expect(screen.getByTestId('section-header-minor')).toBeInTheDocument()
  })

  it('does NOT render a section when that severity has zero issues', () => {
    render(<IssueList issues={[minorIssue]} />)

    expect(screen.queryByTestId('section-header-critical')).not.toBeInTheDocument()
    expect(screen.queryByTestId('section-header-major')).not.toBeInTheDocument()
    expect(screen.getByTestId('section-header-minor')).toBeInTheDocument()
  })

  it('renders empty state when issues is empty array', () => {
    render(<IssueList issues={[]} />)

    expect(screen.getByText('No issues found')).toBeInTheDocument()
  })

  it('submit button disabled when canSubmit is false (has critical/major issues)', () => {
    render(<IssueList issues={allIssues} onSubmit={vi.fn()} />)

    const button = screen.getByRole('button', { name: /submit review/i })
    expect(button).toBeDisabled()
  })

  it('submit button enabled when canSubmit is true (no critical/major issues)', () => {
    render(<IssueList issues={[minorIssue]} onSubmit={vi.fn()} />)

    const button = screen.getByRole('button', { name: /submit review/i })
    expect(button).not.toBeDisabled()
  })

  it('clicking submit calls onSubmit and trackEvent', async () => {
    const { observability } = await import('@shared/observability')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { trackEvent } = observability
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<IssueList issues={[minorIssue]} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /submit review/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce()
    })

    expect(trackEvent).toHaveBeenCalledWith('review.submit_clicked', {
      issueCount: 1,
    })
  })

  it('does not render submit button when onSubmit is not provided', () => {
    render(<IssueList issues={[minorIssue]} />)

    expect(screen.queryByRole('button', { name: /submit review/i })).not.toBeInTheDocument()
  })

  it('calls trackError when onSubmit throws', async () => {
    const { observability } = await import('@shared/observability')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { trackError } = observability
    const error = new Error('Submit failed')
    const onSubmit = vi.fn().mockRejectedValue(error)
    const user = userEvent.setup()

    render(<IssueList issues={[minorIssue]} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /submit review/i }))

    await waitFor(() => {
      expect(trackError).toHaveBeenCalledWith(error, { issueCount: 1 })
    })
  })

  it('shows "Submitting..." label while in-flight and button is disabled', async () => {
    let resolveSubmit!: () => void
    const onSubmit = vi.fn().mockImplementation(
      () => new Promise<void>((resolve) => { resolveSubmit = resolve })
    )
    const user = userEvent.setup()

    render(<IssueList issues={[minorIssue]} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /submit review/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submitting/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled()

    resolveSubmit()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument()
    })
  })
})
