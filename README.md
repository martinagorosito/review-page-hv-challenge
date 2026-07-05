# HomeVision — Review Page Challenge

**Live demo**: [review-page-hv-challenge.vercel.app](https://review-page-hv-challenge.vercel.app/)

A document review interface for property inspectors. An inspector opens a flagged property report, reads the PDF side-by-side with a structured issue list, and submits the review once all critical and major issues are resolved. The interface enforces the submission gate — the submit action is disabled until no blocking issues remain.

---

## AI-assisted development

This project was built using **Claude (Anthropic)** as a development and design partner throughout the full cycle — architecture design, component structure, test strategy, and code implementation. All architectural decisions, tradeoffs, and assumptions were reviewed and validated by the developer before execution.

The design was based on the provided Figma spec:
[HV Review Page — Figma](https://www.figma.com/design/ZVCXCS46IDwscSPn7jTjcX/HV-Review-page?node-id=2-609&t=IWAk0aCMgGkNGUdp-1)

---

## Getting started

**Requirements**: Node 20+, pnpm

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

```bash
pnpm test                   # run all tests once
pnpm test:coverage          # coverage report (threshold: 80%)
pnpm type-check             # TypeScript check
pnpm lint                   # ESLint
pnpm build                  # production build
```

---

## Dev scenarios

A `?scenario=` query param filters the displayed issues without touching the mock data.

| URL | What it shows |
|-----|---------------|
| `/?scenario=no-issues` | Empty issue list — submit enabled immediately |
| `/?scenario=minors-only` | Only minor issues — submit enabled |
| `/?scenario=majors-only` | Only major issues — submit blocked |
| `/?scenario=criticals-only` | Only critical issues — submit blocked |
| `/?scenario=can-submit` | Minor issues only — submit enabled |
| `/` (no param) | All issues from mock data (default) |

---

## Project map

```
src/
├── domain/               # Business rules — zero framework dependencies
│   ├── entities/         # Core types: ReviewDocument, Issue, ReviewStatus, User
│   └── repositories/     # ReviewRepository interface (port)
│
├── application/          # Use cases: fetchReview, submitReview, canSubmitReview
│
├── infrastructure/       # Adapters
│   ├── api/              # Static mock data (reviewMockData.json)
│   └── repositories/     # MockReviewRepository — implements ReviewRepository
│
├── presentation/
│   ├── design-system/
│   │   └── tokens/       # All visual tokens (colors, spacing, typography, radii)
│   ├── components/
│   │   ├── atoms/        # HVButton, HVBadge, HVTypography — DS primitives (HV prefix)
│   │   ├── molecules/    # IssueCard, SeveritySummaryChips, IssueSectionHeader,
│   │   │                 #   StatusBanner, DocSubHeader, AppHeader
│   │   ├── organisms/    # PdfViewer, IssueList
│   │   ├── templates/    # ReviewLayout
│   │   └── pages/        # ReviewPage, SubmittedSuccessPage
│   └── hooks/
│
├── shared/
│   └── observability/    # ObservabilityService interface + console mock
│
├── test/
│   └── msw/              # MSW 2 handlers and server setup
│
└── app/                  # Entry point, globals.css (@theme tokens)
```

Dependency rule (strict): `domain ← application ← infrastructure / presentation`. `shared` flows into any layer.

---

## Assumptions made

- **`reviewId` is hardcoded to `"review-1"`** — no routing layer is implemented. In production this would come from URL params, enabling deep linking, browser history, and multi-review navigation.
- **Mock repository serves static fixture data** — `MockReviewRepository` returns `reviewMockData.json` with no network calls. Replacing it with an HTTP client is a single-file swap; the rest of the codebase is written to the `ReviewRepository` interface.
- **PDF loaded from `public/example_document.pdf`** — no dynamic document URL. In production the URL would come from the review payload returned by the API.
- **Observability logs to console** — the full `ObservabilityService` interface is wired throughout (`trackEvent`, `trackError`, `startSpan`/`endSpan`). Replacing the mock with real Datadog RUM is a single-file change in `src/shared/observability/datadog.mock.ts`.
- **All PDF pages rendered upfront** — required for browser-native CMD+F search to work across the full document. For very large PDFs, a virtualized approach with a custom search index would be needed. See `DECISIONS.md` for the full tradeoff.
- **No authentication layer** — user identity is not part of the challenge scope. In production, auth would gate the route and supply user identity to `observability.setUserContext`.

---

## What is missing before production

| Gap | File(s) to change | Notes |
|-----|-------------------|-------|
| Real API client | `src/infrastructure/repositories/` | Replace `MockReviewRepository` with an HTTP client. Interface stays the same — swap is isolated to this layer. |
| Routing | `src/main.tsx`, `ReviewPage` | Add React Router or Next.js. Extract `reviewId` from URL params instead of hardcoding. |
| Real Datadog | `src/shared/observability/datadog.mock.ts` | Drop-in replacement for `@datadog/browser-rum` + `@datadog/browser-logs`. Needs: `VITE_DD_APPLICATION_ID`, `VITE_DD_CLIENT_TOKEN`, `VITE_DD_SITE`. |
| Auth | Route layer + `ReviewPage` | Gate the route and call `observability.setUserContext(userId)` on session start. |
| Failed fetch UX | `ReviewPage` | Loading state never resolves on error. Add a user-facing error state with retry. |
| Bundle size | `src/main.tsx` | Code-split `PdfViewer` with `React.lazy` — pdfjs-dist is ~1.2 MB and should not block the initial bundle. |
| E2E tests | — | Add Playwright: document load → PDF render → issue navigation → submit. |
| CI/CD | `.github/workflows/` | GitHub Actions: `lint` + `type-check` + `test:coverage` on every PR. Fail if coverage drops below 80%. |

---

## Criteria explained 

**Clean Architecture**
Strict layer separation with enforced dependency direction. Domain has zero framework dependencies. Swapping mock → real HTTP, or mock → real Datadog, is a single-file change.

**Design system enforcement**
All visual tokens in a single `@theme` block in `globals.css`. No raw hex, pixel, or spacing values in component files. `cva` manages variants in `.styles.ts` files. The constraint is structural — it cannot be violated accidentally.

**Observability**
Full `ObservabilityService` interface wired throughout: `startSpan`/`endSpan` on every async operation, `trackError` on every caught error, `trackEvent` with `noun.verb` naming (`review.submitted`, `review.load_failed`). Console-based implementation, real Datadog is a one-file swap.

**PDF CMD+F support**
pdfjs-dist renders a text layer alongside each canvas page. All pages are present in the DOM simultaneously so browser-native CMD+F search works across the full document without custom infrastructure.

**Accessibility**
ARIA roles on all interactive elements. Semantic HTML throughout. Text layer in PdfViewer enables screen reader access to document content.

**Test coverage**
92 tests passing. 88.64% coverage — above the 80% gate. RTL with `userEvent` throughout, no `fireEvent`, no snapshot tests. MSW 2 intercepts all API boundaries. Coverage gate enforced in `vitest.config.ts`.

---

## Key decisions

Full decision log: [`DECISIONS.md`](./DECISIONS.md)

The most consequential tradeoffs:

- **Tailwind v4 CSS-first config** — zero runtime, single token source of truth, but token renames require a global find/replace
- **Render-all-pages PDF** — required for CMD+F correctness; higher initial memory than a single-page render
- **`useEffect` over React 19 `use()`** — avoids the stable-Promise-reference requirement without a cache layer; more idiomatic `use()` would be appropriate in production with a proper data-fetching solution
- **No IoC container** — explicit and traceable at challenge scale; production would use React Context or a DI library to inject the repository

---

## Further reading

- [`docs/development-approach.md`](./docs/development-approach.md) — architecture philosophy and testing strategy
- [`docs/production-readiness.md`](./docs/production-readiness.md) — full production gap analysis
- [`DECISIONS.md`](./DECISIONS.md) — append-only architectural decision log
