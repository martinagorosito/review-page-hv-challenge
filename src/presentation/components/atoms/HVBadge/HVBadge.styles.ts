import { cva } from 'class-variance-authority'

export const badgeStyles = cva(
  'inline-flex items-center font-semibold rounded-full',
  {
    variants: {
      variant: {
        // Severity — used in issue cards
        critical: 'text-critical-dark bg-critical-bg px-[9px] py-[3px] text-xxs',
        major: 'text-major-dark bg-major-bg px-[9px] py-[3px] text-xxs',
        minor: 'text-minor-label bg-surface-subtle border border-surface-border px-[9px] py-[3px] text-xxs',
        // Document status
        'status-on-review': 'text-warning bg-warning-bg border border-warning-border px-[9px] py-[3px] text-xxs',
        'status-submitted': 'text-success-dark bg-success-bg border border-success-border px-[9px] py-[3px] text-xxs',
        // Brand tag
        brand: 'text-brand-600 bg-brand-50 px-[9px] py-[3px] text-xxs',
        // Neutral tag
        neutral: 'text-content-secondary bg-surface-subtle border border-surface-border px-3 py-1 text-xs font-medium',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
)
