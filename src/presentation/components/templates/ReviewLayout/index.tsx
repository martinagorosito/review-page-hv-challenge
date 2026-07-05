import type { FC } from 'react'
import {
  reviewLayoutBodyStyles,
  reviewLayoutIssuesPaneStyles,
  reviewLayoutPdfPaneStyles,
  reviewLayoutRootStyles,
} from './ReviewLayout.styles'
import type { ReviewLayoutProps } from './ReviewLayout.types'

export const ReviewLayout: FC<ReviewLayoutProps> = ({ header, pdfPanel, issuesPanel }) => {
  return (
    <div className={reviewLayoutRootStyles}>
      <div>{header}</div>
      <div className={reviewLayoutBodyStyles}>
        <div className={reviewLayoutPdfPaneStyles}>{pdfPanel}</div>
        <div className={reviewLayoutIssuesPaneStyles}>{issuesPanel}</div>
      </div>
    </div>
  )
}
