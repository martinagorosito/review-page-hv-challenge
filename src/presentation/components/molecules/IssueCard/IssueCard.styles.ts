import { cva } from 'class-variance-authority'

export const issueCardStyles = cva(
  'w-full text-left bg-white border border-surface-border rounded-lg transition-colors hover:bg-surface-subtle',
  {
    variants: {
      severity: {
        critical: 'border-l-[3px] border-l-critical',
        major: 'border-l-[3px] border-l-major',
        minor: '',
      },
    },
    defaultVariants: { severity: 'minor' },
  }
)

export const issueCardStatusBadgeStyles = cva(
  'inline-flex text-xxs font-semibold px-2.5 py-0.5 rounded-full max-w-fit',
  {
    variants: {
      severity: {
        critical: 'text-critical-dark bg-critical-bg',
        major: 'text-major-dark bg-major-bg',
        minor: 'hidden',
      },
    },
    defaultVariants: { severity: 'minor' },
  }
)

export const issueCardPageChipStyles =
  'flex items-center gap-1 flex-shrink-0 text-xxs font-semibold text-brand-600 bg-brand-50 rounded-md px-2 py-1'
