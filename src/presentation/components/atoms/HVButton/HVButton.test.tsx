import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { HVButton } from './index'

describe('HVButton', () => {
  it('renders children text', () => {
    render(<HVButton>Click me</HVButton>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<HVButton onClick={onClick}>Click me</HVButton>)
    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <HVButton onClick={onClick} disabled>
        Click me
      </HVButton>
    )
    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies disabled HTML attribute when disabled prop is true', () => {
    render(<HVButton disabled>Click me</HVButton>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDisabled()
  })

  it('forwards additional className', () => {
    render(<HVButton className="extra-class">Click me</HVButton>)
    expect(screen.getByRole('button', { name: 'Click me' })).toHaveClass('extra-class')
  })

  it('renders with variant primary by default', () => {
    render(<HVButton>Click me</HVButton>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-brand-600')
  })

  it('renders with secondary variant', () => {
    render(<HVButton variant="secondary">Click me</HVButton>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('border-2')
  })
})
