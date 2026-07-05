import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReviewLayout } from './index'

describe('ReviewLayout', () => {
  it('renders all three slots', () => {
    render(
      <ReviewLayout
        header={<div>Header slot</div>}
        pdfPanel={<div>PDF panel slot</div>}
        issuesPanel={<div>Issues panel slot</div>}
      />
    )

    expect(screen.getByText('Header slot')).toBeInTheDocument()
    expect(screen.getByText('PDF panel slot')).toBeInTheDocument()
    expect(screen.getByText('Issues panel slot')).toBeInTheDocument()
  })

  it('right pane has border-l class', () => {
    render(
      <ReviewLayout
        header={<div>Header</div>}
        pdfPanel={<div>PDF</div>}
        issuesPanel={<div data-testid="issues">Issues</div>}
      />
    )

    const issuesPane = screen.getByTestId('issues').parentElement
    expect(issuesPane?.className).toContain('border-l')
  })

  it('root element has h-screen and flex-col classes', () => {
    const { container } = render(
      <ReviewLayout
        header={<div>Header</div>}
        pdfPanel={<div>PDF</div>}
        issuesPanel={<div>Issues</div>}
      />
    )

    const root = container.firstElementChild
    expect(root?.className).toContain('h-screen')
    expect(root?.className).toContain('flex-col')
  })
})
