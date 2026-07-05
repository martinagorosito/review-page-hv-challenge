import type { FC } from 'react'
import { AppHeader } from '@presentation/components/molecules/AppHeader'
import { HVBadge } from '@presentation/components/atoms/HVBadge'
import type { SubmittedSuccessPageProps } from './SubmittedSuccessPage.types'

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
  ' · ' +
  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export const SubmittedSuccessPage: FC<SubmittedSuccessPageProps> = ({ review, submittedAt }) => {
  const userInitials =
    `${review.user.firstName.charAt(0)}${review.user.lastName.charAt(0)}`.toUpperCase()
  const fullName = `${review.user.firstName} ${review.user.lastName}`
  const minorCount = review.issues.filter((i) => i.severity === 'minor').length
  const blockingCount = review.issues.filter(
    (i) => i.severity === 'critical' || i.severity === 'major'
  ).length

  const issuesSummary =
    blockingCount > 0
      ? `${blockingCount} blocking · ${minorCount} minor ignored`
      : minorCount > 0
        ? `${minorCount} minor ignored`
        : 'None'

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-subtle">
      <AppHeader userInitials={userInitials} />

      {/* Submitted doc header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-surface-border bg-white gap-4 flex-shrink-0">
        <div className="flex items-start gap-3 min-w-0">
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-content-primary truncate">{review.name}</span>
              <HVBadge variant="status-submitted">Submitted</HVBadge>
            </div>
            <span className="text-xs text-content-secondary">
              {'Version '}
              <strong className="font-medium text-content-primary">{review.version}</strong>
              {' · Submitted '}
              {formatDate(submittedAt)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-content-secondary border border-surface-border rounded-md px-3 py-1.5 hover:bg-surface-subtle transition-colors flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <svg
              width="56"
              height="56"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="31" stroke="#16a34a" strokeWidth="2" fill="#f0fdf4" />
              <path
                d="M20 33l9 9 15-18"
                stroke="#16a34a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-content-primary text-center mb-2">
            Review submitted
          </h1>
          <p className="text-sm text-content-secondary text-center leading-relaxed mb-6">
            The review for{' '}
            <strong className="font-semibold text-content-primary">{review.name}</strong>{' '}
            has been submitted successfully. No further action is required.
          </p>

          {/* Info table */}
          <div className="border border-surface-border rounded-lg overflow-hidden mb-6">
            {[
              { label: 'Version submitted', value: `v${review.version}` },
              { label: 'Issues resolved', value: issuesSummary },
              { label: 'Submitted by', value: fullName },
              { label: 'Submitted at', value: formatDate(submittedAt) },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                className={`flex items-center justify-between px-4 py-3 text-sm ${i < arr.length - 1 ? 'border-b border-surface-border' : ''}`}
              >
                <span className="text-content-secondary">{label}</span>
                <span className="font-semibold text-content-primary">{value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-lg border border-surface-border px-4 py-2.5 text-sm font-semibold text-content-primary hover:bg-surface-subtle transition-colors"
            >
              View document
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
