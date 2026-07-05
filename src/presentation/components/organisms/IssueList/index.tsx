import { type FC, useTransition } from 'react'
import { HVButton } from '@presentation/components/atoms/HVButton'
import { HVTypography } from '@presentation/components/atoms/HVTypography'
import { IssueCard } from '@presentation/components/molecules/IssueCard'
import { IssueSectionHeader } from '@presentation/components/molecules/IssueSectionHeader'
import { SeveritySummaryChips } from '@presentation/components/molecules/SeveritySummaryChips'
import { StatusBanner } from '@presentation/components/molecules/StatusBanner'
import { canSubmitReview } from '@application/use-cases/canSubmitReview'
import { observability } from '@shared/observability'
import type { Review } from '@domain/entities/review.types'
import {
  issueListBannerStyles,
  issueListContainerStyles,
  issueListEmptyStateStyles,
  issueListFooterStyles,
  issueListHeaderStyles,
  issueListScrollAreaStyles,
} from './IssueList.styles'
import type { IssueListProps } from './IssueList.types'

export const IssueList: FC<IssueListProps> = ({ issues, onNavigateToPage, onSubmit }) => {
  const [isPending, startTransition] = useTransition()

  const minimalReview: Review = {
    id: '',
    name: '',
    uploadedAt: new Date(),
    status: 'on_review',
    version: 1,
    user: { id: '', firstName: '', lastName: '' },
    issues,
    document: { pdfUrl: '', pages: [] },
  }

  const canSubmit = canSubmitReview(minimalReview)
  const criticalIssues = issues.filter((i) => i.severity === 'critical')
  const majorIssues = issues.filter((i) => i.severity === 'major')
  const minorIssues = issues.filter((i) => i.severity === 'minor')
  const blockingCount = criticalIssues.length + majorIssues.length

  const handleSubmit = () => {
    if (!onSubmit) return

    observability.trackEvent('review.submit_clicked', { issueCount: issues.length })

    startTransition(async () => {
      try {
        await onSubmit()
      } catch (error) {
        observability.trackError(error as Error, { issueCount: issues.length })
      }
    })
  }

  const isEmpty = issues.length === 0

  return (
    <div className={issueListContainerStyles}>
      <div className={issueListHeaderStyles}>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-sm font-bold text-content-primary">Issues</span>
          <span className="text-xs text-content-muted font-medium">
            {isEmpty ? 'None found' : blockingCount > 0 ? `${blockingCount} remaining` : `${issues.length} found`}
          </span>
        </div>
        {!isEmpty && <SeveritySummaryChips issues={issues} />}
      </div>

      {!isEmpty && (
        <div className={issueListBannerStyles}>
          <StatusBanner canSubmit={canSubmit} blockingCount={blockingCount} />
        </div>
      )}

      {isEmpty ? (
        <div className={issueListEmptyStateStyles}>
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="31" stroke="#16a34a" strokeWidth="2" fill="#f0fdf4" />
            <path d="M20 33l9 9 15-18" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-base font-bold text-content-primary mt-3 mb-1">No issues found</h2>
          <p className="text-xs text-content-secondary text-center leading-relaxed max-w-[200px]">
            MIRA reviewed all pages and found no critical, major, or minor issues. This document is ready to submit.
          </p>
        </div>
      ) : (
        <div className={issueListScrollAreaStyles}>
          {criticalIssues.length > 0 && (
            <section className="flex flex-col gap-2">
              <IssueSectionHeader severity="critical" count={criticalIssues.length} />
              <div className="flex flex-col gap-2">
                {criticalIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onNavigateToPage={onNavigateToPage} />
                ))}
              </div>
            </section>
          )}

          {majorIssues.length > 0 && (
            <section className="flex flex-col gap-2">
              <IssueSectionHeader severity="major" count={majorIssues.length} />
              <div className="flex flex-col gap-2">
                {majorIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onNavigateToPage={onNavigateToPage} />
                ))}
              </div>
            </section>
          )}

          {minorIssues.length > 0 && (
            <section className="flex flex-col gap-2">
              <IssueSectionHeader severity="minor" count={minorIssues.length} />
              <div className="flex flex-col gap-2">
                {minorIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onNavigateToPage={onNavigateToPage} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {onSubmit !== undefined && (
        <div className={issueListFooterStyles}>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={!canSubmit || isPending}
            onClick={handleSubmit}
            aria-label={isPending ? 'Submitting...' : 'Submit review'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {isPending ? 'Submitting...' : 'Submit review'}
          </button>
          {!canSubmit && (
            <p className="text-xxs text-content-muted text-center mt-1.5">
              Resolve{' '}
              {criticalIssues.length > 0 && (
                <strong className="font-semibold text-critical">{criticalIssues.length} critical</strong>
              )}
              {criticalIssues.length > 0 && majorIssues.length > 0 && ' and '}
              {majorIssues.length > 0 && (
                <strong className="font-semibold text-major">{majorIssues.length} major</strong>
              )}
              {' issues to enable submission'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
