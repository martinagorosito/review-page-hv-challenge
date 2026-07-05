import type { Issue } from '@domain/entities/issue.types'

export interface IssueCardProps {
  issue: Issue
  onNavigateToPage?: (page: number) => void
}
