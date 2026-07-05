# HomeVision — Review Page Challenge

A senior frontend take-home challenge: build a document review interface where an inspector can load a PDF, inspect flagged issues, and submit a review.

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
pnpm dev          # http://localhost:5173
```

```bash
pnpm test                   # run all tests once
pnpm test:coverage          # coverage report (threshold: 80%)
pnpm type-check             # TypeScript check
pnpm lint                   # ESLint
pnpm build                  # production build
```

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

- `reviewId` is hardcoded to `"review-1"` — no routing required for challenge scope
- Mock repository serves static fixture data from `reviewMockData.json` — no real API
- PDF is loaded from `public/example_document.pdf` — no dynamic document URL
- Observability logs to console — sufficient for evaluation; interface is fully wired for real Datadog
- PDF page count is bounded — render-all-pages approach is appropriate for short documents
- No authentication layer — user identity is not part of the challenge scope

---

## What is missing before production

| Gap | What to do |
|-----|-----------|
| Real API client | Replace `MockReviewRepository` with an HTTP implementation. The swap is one file — the rest of the codebase is written to the `ReviewRepository` interface. |
| Routing | Add React Router or Next.js. Extract `reviewId` from URL params in `ReviewPage`. |
| Real Datadog | Replace `src/shared/observability/datadog.mock.ts` with `@datadog/browser-rum` + `@datadog/browser-logs`. Env vars needed: `VITE_DD_APPLICATION_ID`, `VITE_DD_CLIENT_TOKEN`, `VITE_DD_SITE`. |
| Auth | Add an authentication layer. Wire `observability.setUserContext(userId)` on session start. |
| Error boundary | Add a React error boundary at page level to catch render errors and report via `trackError`. |
| Failed fetch UX | Currently shows a loading state that never resolves on fetch error. Add user-facing error state. |
| Performance | Lazy-load `ReviewPage` + code-split `PdfViewer` — pdfjs-dist is large and should not block the initial bundle. |
| E2E tests | Add Playwright: document load → PDF render → issue review → submit. |
| CI/CD | GitHub Actions running `lint` + `type-check` + `test:coverage` on every PR, failing if coverage drops below 80%. |

---

## Bonus points addressed

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
