import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { IssueSectionHeader } from './index'
import type { IssueSeverity } from '@domain/entities/issue.types'

describe('IssueSectionHeader', () => {
  it.each<[IssueSeverity, string]>([
    ['critical', 'Critical'],
    ['major', 'Major'],
    ['minor', 'Minor'],
  ])('renders correct label for severity "%s"', (severity, expectedLabel) => {
    render(<IssueSectionHeader severity={severity} count={2} />)

    const header = screen.getByTestId(`section-header-${severity}`)
    expect(header).toHaveTextContent(expectedLabel)
  })

  it('renders count with requirement text for critical', () => {
    render(<IssueSectionHeader severity="critical" count={5} />)

    expect(screen.getByText('5 · must resolve')).toBeInTheDocument()
  })

  it('renders count with "can be ignored" for minor', () => {
    render(<IssueSectionHeader severity="minor" count={3} />)

    expect(screen.getByText('3 · can be ignored')).toBeInTheDocument()
  })

  it('renders zero count', () => {
    render(<IssueSectionHeader severity="minor" count={0} />)

    expect(screen.getByText('0 · can be ignored')).toBeInTheDocument()
  })
})
