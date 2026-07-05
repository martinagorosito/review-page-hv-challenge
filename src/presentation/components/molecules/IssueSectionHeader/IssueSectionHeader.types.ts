import type { IssueSeverity } from '@domain/entities/issue.types'

export interface IssueSectionHeaderProps {
  severity: IssueSeverity
  count: number
}
