import type { Issue } from './issue.types'
import type { ReviewDocument } from './document.types'
import type { ReviewUser } from './user.types'

export type ReviewStatus = 'created' | 'processing' | 'on_review' | 'submitted'

export interface Review {
  id: string
  name: string
  uploadedAt: Date
  status: ReviewStatus
  version: number
  user: ReviewUser
  issues: Issue[]
  document: ReviewDocument
}
