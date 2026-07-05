# Development Approach

How this challenge was structured and why.

---

## Architecture philosophy

The project follows Clean Architecture with Atomic Design for the presentation layer. The core principle is the dependency rule: domain code has zero dependencies on any framework, library, or infrastructure concern. Use cases sit above domain and orchestrate it. Infrastructure and presentation adapt to the domain — they depend on it, not the other way around.

This matters because it keeps business logic testable in isolation, makes swapping implementations (mock → real HTTP client, mock Datadog → real Datadog) a single-file change, and prevents the common failure mode where UI concerns bleed into business rules.

---

## Layer-by-layer walkthrough

**`domain/`** — Entities and repository interfaces only. No React, no fetch, no Tailwind. A `ReviewDocument`, `Issue`, and `ReviewStatus` can be instantiated and tested with plain TypeScript.

**`application/`** — Use cases that orchestrate domain + infrastructure. `fetchReview` and `submitReview` live here. They call repository interfaces (ports), never concrete implementations.

**`infrastructure/`** — Concrete implementations of domain interfaces. `MockReviewRepository` implements `ReviewRepository` and returns static fixture data. Swapping it for an HTTP client touches only this layer.

**`presentation/`** — React components organized by Atomic Design. Atoms are pure DS primitives (HV prefix). Molecules compose atoms with no business logic. Organisms may call use cases. Templates define layout. Pages are route entry points.

**`shared/`** — Cross-cutting concerns with no layer affiliation: the observability service, shared TypeScript types, and pure utility functions.

---

## Testing strategy

| Code type | Approach |
|-----------|----------|
| Domain entities | Unit — pure input/output, no mocks needed |
| Use cases | Unit with MSW intercepting fetch calls |
| Atoms / Molecules | RTL component render + user interaction |
| Organisms | Integration — MSW server active |
| Pages | Full render with mocked repository and MSW |

Rules enforced throughout: `userEvent` only (never `fireEvent`), `findBy*` / `waitFor` for async, query priority `getByRole > getByLabelText > getByText`. No snapshot tests. MSW server configured with `onUnhandledRequest: 'error'` so unhandled requests fail loudly.

Coverage gate: 80% lines/functions/branches/statements enforced in `vitest.config.ts`. Final state: 92 tests, 88.64% coverage.

---

## Design system approach

All visual tokens live in a single `@theme` block in `src/app/globals.css`. Tailwind utilities reference these tokens — no raw hex values, pixel values, or `style={{}}` props in component files.

Variant logic uses `cva` (class-variance-authority). Each component's `.styles.ts` file exports a `cva(...)` call and imports nothing except `cva`/`clsx`. This structural constraint makes it impossible to accidentally inline a raw value — if it isn't in `@theme`, there's no utility class for it.

The HV prefix on atoms (`HVButton`, `HVBadge`, `HVTypography`) creates a clear visual signal at the import site: HV = design system primitive, reusable anywhere. No HV prefix = feature-specific component.

---

## Observability

A full `ObservabilityService` interface is defined and wired throughout the codebase. Every async operation uses `startSpan`/`endSpan`. Every caught error calls `trackError`. User actions with business significance call `trackEvent` with `noun.verb` naming (`review.submitted`, `review.load_failed`).

The current implementation logs to console. Replacing it with real Datadog RUM requires changing one file (`src/shared/observability/datadog.mock.ts`) — the rest of the codebase is already written to the interface.

---

## Key tradeoffs

See `DECISIONS.md` for the full list. The most consequential decisions were:

- Tailwind v4 CSS-first config (zero runtime, single token source of truth)
- Render-all-pages PDF approach (required for CMD+F, higher initial memory)
- `useEffect` for data fetching over React 19 `use()` (avoids cache infrastructure, less idiomatic)
- No IoC container (explicit and traceable at challenge scale, would need context injection in production)
