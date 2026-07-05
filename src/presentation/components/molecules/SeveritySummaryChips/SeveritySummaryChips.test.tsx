import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SeveritySummaryChips } from './index'
import type { Issue } from '@domain/entities/issue.types'

const mockIssues: Issue[] = [
  { id: '1', title: 'Critical 1', description: 'desc', severity: 'critical', page: 1 },
  { id: '2', title: 'Critical 2', description: 'desc', severity: 'critical', page: 2 },
  { id: '3', title: 'Major 1', description: 'desc', severity: 'major', page: 3 },
  { id: '4', title: 'Minor 1', description: 'desc', severity: 'minor', page: 4 },
  { id: '5', title: 'Minor 2', description: 'desc', severity: 'minor', page: 5 },
]

describe('SeveritySummaryChips', () => {
  it('shows correct counts when issues present', () => {
    render(<SeveritySummaryChips issues={mockIssues} />)

    // 2 critical, 1 major, 2 minor — counts shown in each chip
    const counts = screen.getAllByText(/^[0-9]+$/)
    const countValues = counts.map((el) => el.textContent)
    expect(countValues).toContain('2') // critical
    expect(countValues).toContain('1') // major
  })

  it('shows zero counts when no issues', () => {
    render(<SeveritySummaryChips issues={[]} />)

    const zeros = screen.getAllByText('0')
    expect(zeros).toHaveLength(3)
  })

  it('renders all three severity chips always', () => {
    render(<SeveritySummaryChips issues={[]} />)

    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.getByText('Major')).toBeInTheDocument()
    expect(screen.getByText('Minor')).toBeInTheDocument()
  })

  it('shows correct counts when only critical issues present', () => {
    const onlyCritical: Issue[] = [
      { id: '1', title: 'Critical 1', description: 'desc', severity: 'critical', page: 1 },
    ]
    render(<SeveritySummaryChips issues={onlyCritical} />)

    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.getByText('Major')).toBeInTheDocument()
    expect(screen.getByText('Minor')).toBeInTheDocument()
  })
})
