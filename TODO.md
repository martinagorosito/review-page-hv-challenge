# TODO

## In Progress

(nothing — all stages complete)

---

## Completed

- [x] **Stage 1**: Domain layer — entities, use cases, repository interface + mock, MSW handlers, unit tests *(completed 2026-07-05)*
- [x] **Stage 2**: DS atoms — HVButton, HVBadge, HVTypography (HV prefix rule established) *(completed 2026-07-05)*
- [x] **Stage 3**: PdfViewer organism — pdfjs-dist v6, text layer for CMD+F, toolbar, zoom, IntersectionObserver, forwardRef *(completed 2026-07-05)*
- [x] **Stage 4**: Issues panel — IssueCard, SeveritySummaryChips, IssueSectionHeader, StatusBanner molecules + IssueList organism *(completed 2026-07-05)*
- [x] **Stage 5**: Page assembly — DocSubHeader, ReviewLayout template, ReviewPage page, SubmittedSuccessPage *(completed 2026-07-05)*
- [x] **Stage 6**: Documentation — TODO.md, DECISIONS.md, docs/development-approach.md, docs/production-readiness.md *(completed 2026-07-05)*

---

## NON-BLOCKERS (known gaps, shippable without)

- Real Datadog integration (replace mock in `src/shared/observability/datadog.mock.ts`)
- Real API client (replace `MockReviewRepository` with HTTP implementation)
- React Router integration (currently hardcoded `reviewId="review-1"`)
- E2E tests (Playwright)
- CI/CD pipeline

---

## BLOCKERs

(none — challenge scope complete)

---

## Assumptions

- `reviewId` is hardcoded for challenge scope — no routing required
- Mock repository serves static data — no real API
- Datadog mock logs to console — sufficient for challenge
- PDF worker sourced from `pdfjs-dist` package — no separate CDN needed
