# Production Readiness

What is done, what is missing, and what is required before shipping.

---

## Done (challenge scope)

**Architecture**
- Clean Architecture enforced — dependency rule followed across all layers
- Atomic Design applied — atoms, molecules, organisms, templates, pages
- HV prefix convention for DS atoms
- Three-file separation per component (index, types, styles)
- Path aliases for all cross-layer imports — no relative `../../` crossing boundaries

**Code quality**
- TypeScript strict mode — no `any`, no non-null assertions without justification
- ESLint clean, Prettier formatted
- Named exports for all components; default exports only for lazy-loaded pages

**Testing**
- 92 tests passing
- 88.64% coverage — above the 80% gate
- MSW 2 handlers for all API boundaries
- RTL with `userEvent` throughout — no `fireEvent`, no snapshots
- Coverage gate enforced in `vitest.config.ts` (80% lines/functions/branches/statements)

**Design system**
- All visual tokens in `@theme` — no raw color or spacing values in component files
- `cva` variant management in `.styles.ts` files
- Design system contract enforced structurally, not by convention

**Observability**
- `ObservabilityService` interface fully wired
- All async operations instrumented with `startSpan`/`endSpan`
- All caught errors call `trackError`
- User actions call `trackEvent` with `noun.verb` naming

**Accessibility**
- ARIA roles on all interactive elements
- Semantic HTML throughout
- Text layer in PDF viewer enables browser-native CMD+F search

---

## Required before production

**Infrastructure replacements**
- Replace `MockReviewRepository` with a real HTTP client (fetch + error handling + retry logic + timeout)
- Replace `datadogMock` with `@datadog/browser-rum` + `@datadog/browser-logs`; env vars needed: `VITE_DD_APPLICATION_ID`, `VITE_DD_CLIENT_TOKEN`, `VITE_DD_SITE`

**Routing**
- Add React Router or Next.js — `reviewId` is currently hardcoded as `"review-1"` in `ReviewPage`
- Extract `reviewId` from URL params

**Auth**
- Add authentication and authorization layer
- Pass user identity to `observability.setUserContext(userId)` on session start

**Error handling**
- Add an error boundary at the page level to catch render errors and report them via `observability.trackError`
- Add user-facing error states for failed fetches (currently shows a loading state that never resolves on error)

**Performance**
- Lazy-load `ReviewPage` with `React.lazy` + `Suspense`
- Code-split `PdfViewer` — pdfjs-dist is large and should not block the initial bundle

**Testing**
- Add E2E tests with Playwright covering: document load → PDF render → issue review → submit
- Add axe-core accessibility assertions to component tests

**CI/CD**
- Add a CI pipeline (GitHub Actions or equivalent) running: `pnpm lint` + `pnpm type-check` + `pnpm test:coverage` on every PR
- Fail the pipeline if coverage drops below the 80% gate
- Add a production build step (`pnpm build`) to catch type errors in the build output
