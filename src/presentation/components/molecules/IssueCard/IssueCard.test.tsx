import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { IssueCard } from './index'
import type { Issue } from '@domain/entities/issue.types'

const mockIssue: Issue = {
  id: 'issue-1',
  title: 'Missing signature',
  description: 'The document requires a valid signature on page 3.',
  severity: 'critical',
  page: 3,
}

describe('IssueCard', () => {
  it('renders title and description', () => {
    render(<IssueCard issue={mockIssue} />)

    expect(screen.getByText('Missing signature')).toBeInTheDocument()
    expect(screen.getByText('The document requires a valid signature on page 3.')).toBeInTheDocument()
  })

  it('renders "Unresolved" status badge for critical issues', () => {
    render(<IssueCard issue={mockIssue} />)

    expect(screen.getByText('Unresolved')).toBeInTheDocument()
  })

  it('renders page chip when onNavigateToPage is provided', () => {
    render(<IssueCard issue={mockIssue} onNavigateToPage={vi.fn()} />)

    expect(screen.getByText('Page 3')).toBeInTheDocument()
  })

  it('does NOT render page chip when onNavigateToPage is undefined', () => {
    render(<IssueCard issue={mockIssue} />)

    expect(screen.queryByText('Page 3')).not.toBeInTheDocument()
  })

  it('clicking the card calls onNavigateToPage with issue.page', async () => {
    const onNavigateToPage = vi.fn()
    const user = userEvent.setup()

    render(<IssueCard issue={mockIssue} onNavigateToPage={onNavigateToPage} />)

    await user.click(screen.getByRole('button', { name: /Missing signature/i }))

    expect(onNavigateToPage).toHaveBeenCalledOnce()
    expect(onNavigateToPage).toHaveBeenCalledWith(3)
  })

  it('renders "Unresolved" badge for major severity', () => {
    const majorIssue: Issue = { ...mockIssue, severity: 'major', id: 'issue-2' }
    render(<IssueCard issue={majorIssue} />)

    expect(screen.getByText('Unresolved')).toBeInTheDocument()
  })

  it('does NOT render "Unresolved" badge for minor severity', () => {
    const minorIssue: Issue = { ...mockIssue, severity: 'minor', id: 'issue-3' }
    render(<IssueCard issue={minorIssue} />)

    expect(screen.queryByText('Unresolved')).not.toBeInTheDocument()
  })
})
