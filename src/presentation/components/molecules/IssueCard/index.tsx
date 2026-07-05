import type { FC } from 'react'
import {
  issueCardPageChipStyles,
  issueCardStatusBadgeStyles,
  issueCardStyles,
} from './IssueCard.styles'
import type { IssueCardProps } from './IssueCard.types'

const PageChip: FC<{ page: number }> = ({ page }) => (
  <span className={issueCardPageChipStyles} aria-label={`Page ${page}`}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
    Page {page}
  </span>
)

export const IssueCard: FC<IssueCardProps> = ({ issue, onNavigateToPage }) => {
  const isNavigable = onNavigateToPage !== undefined
  const isMinor = issue.severity === 'minor'

  const handleClick = isNavigable ? () => { onNavigateToPage(issue.page) } : undefined

  if (isMinor) {
    return (
      <button
        type="button"
        className={issueCardStyles({ severity: issue.severity })}
        onClick={handleClick}
        aria-label={`${issue.title}, Page ${issue.page}`}
      >
        <div className="flex items-start justify-between gap-3 px-[15px] py-3 cursor-pointer">
          <div className="min-w-0">
            <span className="text-sm font-semibold text-content-slate">{issue.title}</span>
            <p className="text-xs text-content-muted mt-0.5">
              Page {issue.page} · {issue.description}
            </p>
          </div>
          {isNavigable && <PageChip page={issue.page} />}
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={issueCardStyles({ severity: issue.severity })}
      onClick={handleClick}
      aria-label={`${issue.title}, Page ${issue.page}`}
    >
      <div className="flex flex-col gap-2 px-[15px] py-[13px] cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-content-primary leading-snug">
            {issue.title}
          </span>
          {isNavigable && <PageChip page={issue.page} />}
        </div>
        <p className="text-xs text-content-secondary leading-relaxed">{issue.description}</p>
        <span className={issueCardStatusBadgeStyles({ severity: issue.severity })}>
          Unresolved
        </span>
      </div>
    </button>
  )
}
