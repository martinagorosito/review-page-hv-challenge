import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HVTypography } from './index'

describe('HVTypography', () => {
  it('renders children text', () => {
    render(<HVTypography>Hello world</HVTypography>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('display variant renders as h1 by default', () => {
    render(<HVTypography variant="display">Display text</HVTypography>)
    const el = screen.getByText('Display text')
    expect(el.tagName).toBe('H1')
  })

  it('h2 variant renders as h2 by default', () => {
    render(<HVTypography variant="h2">Heading 2</HVTypography>)
    const el = screen.getByText('Heading 2')
    expect(el.tagName).toBe('H2')
  })

  it('base variant renders as p by default', () => {
    render(<HVTypography variant="base">Paragraph</HVTypography>)
    const el = screen.getByText('Paragraph')
    expect(el.tagName).toBe('P')
  })

  it('as prop overrides the element', () => {
    render(
      <HVTypography variant="h2" as="div">
        Div heading
      </HVTypography>
    )
    const el = screen.getByText('Div heading')
    expect(el.tagName).toBe('DIV')
  })

  it('color prop applies correctly', () => {
    render(<HVTypography color="brand">Branded text</HVTypography>)
    const el = screen.getByText('Branded text')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('text-brand-600')
  })

  it('forwards className', () => {
    render(<HVTypography className="custom-class">Text</HVTypography>)
    expect(screen.getByText('Text')).toHaveClass('custom-class')
  })

  it('forwards other HTML attributes', () => {
    render(<HVTypography data-testid="typo-el">Text</HVTypography>)
    expect(screen.getByTestId('typo-el')).toBeInTheDocument()
  })
})
