import type { FC } from 'react'
import type { IssueSeverity } from '@domain/entities/issue.types'
import type { IssueSectionHeaderProps } from './IssueSectionHeader.types'

const severityConfig: Record<IssueSeverity, { label: string; dotColor: string; labelColor: string; requirement: string }> = {
  critical: {
    label: 'Critical',
    dotColor: 'bg-critical',
    labelColor: 'text-critical',
    requirement: 'must resolve',
  },
  major: {
    label: 'Major',
    dotColor: 'bg-major',
    labelColor: 'text-major',
    requirement: 'must resolve',
  },
  minor: {
    label: 'Minor',
    dotColor: 'bg-minor',
    labelColor: 'text-minor-label',
    requirement: 'can be ignored',
  },
}

export const IssueSectionHeader: FC<IssueSectionHeaderProps> = ({ severity, count }) => {
  const { label, dotColor, labelColor, requirement } = severityConfig[severity]

  return (
    <div className="flex items-center gap-2 py-1" data-testid={`section-header-${severity}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} aria-hidden="true" />
      <span className={`text-xs font-bold uppercase tracking-wide ${labelColor}`}>{label}</span>
      <span className="text-xxs text-content-muted font-medium">
        {count} · {requirement}
      </span>
    </div>
  )
}
