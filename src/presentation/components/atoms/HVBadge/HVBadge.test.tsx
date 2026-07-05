import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HVBadge } from './index'
import type { HVBadgeProps } from './HVBadge.types'

const variants: NonNullable<HVBadgeProps['variant']>[] = [
  'critical',
  'major',
  'minor',
  'status-on-review',
  'status-submitted',
  'brand',
  'neutral',
]

describe('HVBadge', () => {
  it.each(variants)('renders children for variant "%s"', (variant) => {
    render(<HVBadge variant={variant}>{variant} label</HVBadge>)
    expect(screen.getByText(`${variant} label`)).toBeInTheDocument()
  })

  it('forwards additional className', () => {
    render(<HVBadge className="extra-class">Badge</HVBadge>)
    expect(screen.getByText('Badge')).toHaveClass('extra-class')
  })

  it('forwards other HTML span attributes', () => {
    render(<HVBadge data-testid="my-badge">Badge</HVBadge>)
    expect(screen.getByTestId('my-badge')).toBeInTheDocument()
  })
})
