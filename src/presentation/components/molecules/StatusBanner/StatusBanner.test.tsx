import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBanner } from './index'

describe('StatusBanner', () => {
  it('shows blocking message when canSubmit is false', () => {
    render(<StatusBanner canSubmit={false} blockingCount={3} />)

    expect(
      screen.getByText('3 blocking issues must be resolved before submitting')
    ).toBeInTheDocument()
  })

  it('shows ready message when canSubmit is true', () => {
    render(<StatusBanner canSubmit={true} blockingCount={0} />)

    expect(screen.getByText('No blocking issues — ready to submit')).toBeInTheDocument()
  })

  it('has role="alert" when blocking', () => {
    render(<StatusBanner canSubmit={false} blockingCount={2} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('has role="status" when ready', () => {
    render(<StatusBanner canSubmit={true} blockingCount={0} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows singular "issue" when blockingCount is 1', () => {
    render(<StatusBanner canSubmit={false} blockingCount={1} />)

    expect(
      screen.getByText('1 blocking issue must be resolved before submitting')
    ).toBeInTheDocument()
  })

  it('shows description text when blocking', () => {
    render(<StatusBanner canSubmit={false} blockingCount={2} />)

    expect(
      screen.getByText('Fix critical and major issues in your source system, then upload a new version to re-run the review.')
    ).toBeInTheDocument()
  })

  it('shows description text when ready', () => {
    render(<StatusBanner canSubmit={true} blockingCount={0} />)

    expect(
      screen.getByText('All critical and major issues have been resolved.')
    ).toBeInTheDocument()
  })
})
