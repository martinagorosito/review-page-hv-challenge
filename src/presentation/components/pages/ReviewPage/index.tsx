import { type FC, useEffect, useRef, useState, useTransition } from 'react'
import { HVTypography } from '@presentation/components/atoms/HVTypography'
import { AppHeader } from '@presentation/components/molecules/AppHeader'
import { DocSubHeader } from '@presentation/components/molecules/DocSubHeader'
import { ReviewLayout } from '@presentation/components/templates/ReviewLayout'
import { PdfViewer } from '@presentation/components/organisms/PdfViewer'
import { IssueList } from '@presentation/components/organisms/IssueList'
import { SubmittedSuccessPage } from '@presentation/components/pages/SubmittedSuccessPage'
import { fetchReview } from '@application/use-cases/fetchReview'
import { submitReview } from '@application/use-cases/submitReview'
import { canSubmitReview } from '@application/use-cases/canSubmitReview'
import { MockReviewRepository } from '@infrastructure/repositories/MockReviewRepository'
import { observability } from '@shared/observability'
import type { Review } from '@domain/entities/review.types'
import type { PdfViewerHandle } from '@presentation/components/organisms/PdfViewer/PdfViewer.types'
import type { ReviewPageProps } from './ReviewPage.types'

export const ReviewPage: FC<ReviewPageProps> = ({ reviewId }) => {
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null)
  const [isPending, startTransition] = useTransition()

  const repository = useRef(new MockReviewRepository())
  const pdfViewerRef = useRef<PdfViewerHandle>(null)

  useEffect(() => {
    let cancelled = false

    const load = async (): Promise<void> => {
      const span = observability.startSpan('review.fetch', { reviewId })
      try {
        const data = await fetchReview(repository.current)(reviewId)
        observability.endSpan(span)
        if (cancelled) return
        setReview(data)
        setLoading(false)
        observability.trackEvent('review.loaded', { reviewId })
        observability.setUserContext(data.user.id, {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        })
      } catch (err) {
        observability.endSpan(span)
        if (cancelled) return
        observability.trackError(err instanceof Error ? err : new Error(String(err)), { reviewId })
        setError('Failed to load the review. Please try again.')
        setLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [reviewId])

  const handleSubmit = (): Promise<void> => {
    if (!review) return Promise.resolve()
    startTransition(async () => {
      try {
        await submitReview(repository.current)(review.id)
        observability.trackEvent('review.submitted', { reviewId: review.id })
        setSubmittedAt(new Date())
        setSubmitted(true)
      } catch (err) {
        observability.trackError(err instanceof Error ? err : new Error(String(err)), {
          reviewId: review.id,
        })
      }
    })
    return Promise.resolve()
  }

  if (submitted && review && submittedAt) {
    return <SubmittedSuccessPage review={review} submittedAt={submittedAt} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HVTypography variant="base" color="secondary">Loading review...</HVTypography>
      </div>
    )
  }

  if (error ?? !review) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="alert">
        <HVTypography variant="base" color="primary">
          {error ?? 'An unexpected error occurred.'}
        </HVTypography>
      </div>
    )
  }

  const userInitials =
    `${review.user.firstName.charAt(0)}${review.user.lastName.charAt(0)}`.toUpperCase()
  const canSubmit = canSubmitReview(review)

  return (
    <ReviewLayout
      header={
        <>
          <AppHeader userInitials={userInitials} />
          <DocSubHeader
            review={review}
            canSubmit={canSubmit}
            isSubmitting={isPending}
            onSubmit={handleSubmit}
          />
        </>
      }
      pdfPanel={<PdfViewer ref={pdfViewerRef} pdfUrl={review.document.pdfUrl} />}
      issuesPanel={
        <IssueList
          issues={review.issues}
          onNavigateToPage={(page) => { pdfViewerRef.current?.navigateToPage(page) }}
          onSubmit={handleSubmit}
        />
      }
    />
  )
}
