import type { FC } from 'react'
import { blockingBannerStyles, readyBannerStyles } from './StatusBanner.styles'
import type { StatusBannerProps } from './StatusBanner.types'

const AlertCircleIcon: FC = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0 text-critical mt-px"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const CheckCircleIcon: FC = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0 text-success mt-px"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export const StatusBanner: FC<StatusBannerProps> = ({ canSubmit, blockingCount }) => {
  if (!canSubmit) {
    return (
      <div role="alert" className={blockingBannerStyles}>
        <AlertCircleIcon />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-critical leading-snug">
            {blockingCount} blocking {blockingCount === 1 ? 'issue' : 'issues'} must be resolved before submitting
          </p>
          <p className="text-xs text-content-muted mt-0.5 leading-snug">
            Fix critical and major issues in your source system, then upload a new version to re-run the review.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div role="status" className={readyBannerStyles}>
      <CheckCircleIcon />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-success leading-snug">
          No blocking issues — ready to submit
        </p>
        <p className="text-xs text-content-muted mt-0.5 leading-snug">
          All critical and major issues have been resolved.
        </p>
      </div>
    </div>
  )
}
