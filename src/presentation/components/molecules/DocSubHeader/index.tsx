import type { FC } from 'react'
import { HVButton } from '@presentation/components/atoms/HVButton'
import { HVBadge } from '@presentation/components/atoms/HVBadge'
import type { ReviewStatus } from '@domain/entities/review.types'
import type { IssueSeverity } from '@domain/entities/issue.types'
import type { DocSubHeaderProps } from './DocSubHeader.types'

const BLOCKING_SEVERITIES: IssueSeverity[] = ['critical', 'major']

const statusVariantMap: Record<ReviewStatus, 'status-on-review' | 'status-submitted' | 'neutral'> =
  {
    on_review: 'status-on-review',
    submitted: 'status-submitted',
    created: 'neutral',
    processing: 'neutral',
  }

const statusLabelMap: Record<ReviewStatus, string> = {
  on_review: 'On review',
  submitted: 'Submitted',
  created: 'Created',
  processing: 'Processing',
}

export const DocSubHeader: FC<DocSubHeaderProps> = ({
  review,
  canSubmit,
  isSubmitting,
  onSubmit,
}) => {
  const formattedDate = review.uploadedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = review.uploadedAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const statusVariant = statusVariantMap[review.status]
  const statusLabel = statusLabelMap[review.status]
  const assignedTo = `${review.user.firstName} ${review.user.lastName}`
  const blockingCount = review.issues.filter((i) =>
    BLOCKING_SEVERITIES.includes(i.severity)
  ).length

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-surface-border bg-white gap-4">
      {/* Left — back + file info */}
      <div className="flex items-start gap-3 min-w-0">
        <button
          type="button"
          aria-label="Go back"
          className="mt-0.5 w-7 h-7 flex items-center justify-center rounded-md text-content-secondary hover:bg-surface-subtle transition-colors flex-shrink-0"
        >
          ←
        </button>

        {/* PDF icon */}
        <svg
          className="mt-0.5 flex-shrink-0 text-success"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>

        <div className="flex flex-col gap-0.5 min-w-0">
          {/* Filename + status badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-content-primary truncate">
              {review.name}
            </span>
            <HVBadge variant={statusVariant}>{statusLabel}</HVBadge>
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-1 text-xs text-content-secondary">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 10H10.5" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.25 1.74999C8.44891 1.55108 8.7187 1.43933 9 1.43933C9.13929 1.43933 9.27721 1.46677 9.4059 1.52007C9.53458 1.57337 9.65151 1.6515 9.75 1.74999C9.84849 1.84848 9.92662 1.96541 9.97992 2.09409C10.0332 2.22278 10.0607 2.3607 10.0607 2.49999C10.0607 2.63928 10.0332 2.7772 9.97992 2.90589C9.92662 3.03457 9.84849 3.1515 9.75 3.24999L3.5 9.49999L1.5 9.99999L2 7.99999L8.25 1.74999Z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
              {'Version '}
              <strong className="font-medium text-content-primary">{review.version}</strong>
              {` · Uploaded ${formattedDate} · ${formattedTime} · Assigned to `}
              <strong className="font-medium text-content-primary">{assignedTo}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right — submit button + blocking count */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <HVButton
          variant="primary"
          size="sm"
          disabled={!canSubmit || isSubmitting}
          onClick={() => { void onSubmit() }}
        >
          {canSubmit && !isSubmitting ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22 11 13 2 9 22 2z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
          {isSubmitting ? 'Submitting...' : 'Submit review'}
        </HVButton>
        {blockingCount > 0 && (
          <span className="text-xxs font-medium text-critical">
            {blockingCount} blocking {blockingCount === 1 ? 'issue' : 'issues'} remaining
          </span>
        )}
      </div>
    </div>

  )
} 