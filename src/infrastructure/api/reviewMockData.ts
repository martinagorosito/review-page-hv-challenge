import type { Review } from '@domain/entities/review.types'
import type { IssueSeverity } from '@domain/entities/issue.types'
import rawMock from './reviewMockData.json'

// Map snake_case API response to domain Review entity
export const reviewMockData: Review = {
  id: rawMock.id,
  name: rawMock.name,
  uploadedAt: new Date(rawMock.uploaded_at),
  status: rawMock.status as Review['status'],
  version: rawMock.version,
  user: {
    id: rawMock.user.id,
    firstName: rawMock.user.first_name,
    lastName: rawMock.user.last_name,
  },
  document: {
    pdfUrl: rawMock.document.pdf_url,
    pages: rawMock.document.pages.map((p) => ({
      pageNum: p.page_num,
      height: p.height,
      width: p.width,
    })),
  },
  issues: rawMock.issues.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    severity: i.severity as IssueSeverity,
    page: i.page,
  })),
}
