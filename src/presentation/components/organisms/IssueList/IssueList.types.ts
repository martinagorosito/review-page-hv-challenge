import type { Issue } from '@domain/entities/issue.types'

export interface IssueListProps {
  issues: Issue[]
  onNavigateToPage?: (page: number) => void
  onSubmit?: () => Promise<void>
}
