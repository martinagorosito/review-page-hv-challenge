# DECISIONS

Append-only log of architectural and technical decisions made during this challenge.

---

## [2026-07-05] Tailwind CSS v4 over CSS-in-JS / CSSProperties

**Decision**: Use Tailwind CSS v4 with CSS-first `@theme` configuration as the sole styling mechanism.

**Why**: Compile-time token resolution means zero runtime overhead. `@theme` in `globals.css` is the single source of truth for all design tokens — no duplication between a JS theme file and CSS. cva handles variant logic without adding a runtime styling library.

**Alternatives considered**: CSS Modules (good isolation, but verbose and no variant system); CSSProperties objects (fine for simple cases, but raw values scatter across files with no token enforcement); styled-components / Emotion (runtime cost, harder to enforce design system contracts).

**Assumptions**: The team knows Tailwind. Token names are stable — changing them requires a global rename.

---

## [2026-07-05] Vite config split (vite.config.ts + vitest.config.ts)

**Decision**: Keep Vite and Vitest configuration in separate files rather than a single merged config.

**Why**: Tailwind CSS v4's Vite plugin bundles Vite 6 type definitions internally. Vitest's `vitest/config` helper bundles Vite 5 type definitions. Merging both into one file causes TypeScript type conflicts that are not resolvable with simple `/// <reference>` directives. Splitting avoids the conflict entirely: `vite.config.ts` owns the Tailwind plugin and build settings; `vitest.config.ts` imports `mergeConfig` from `vitest/config` and extends only what it needs.

**Alternatives considered**: Triple-slash reference directive (`/// <reference types="vitest" />`) in a single config — attempted and failed due to the bundled Vite version mismatch.

**Assumptions**: This is a Tailwind v4 + Vitest 2 constraint; may be resolved in future releases.

---

## [2026-07-05] pdfjs-dist render-all-pages approach

**Decision**: Render all PDF pages upfront, stacked vertically in the DOM.

**Why**: Browser-native CMD+F search requires all text content to be present in the DOM simultaneously. pdfjs-dist renders a text layer alongside each canvas page; if only one page is mounted at a time, CMD+F cannot find text on unmounted pages. Rendering all pages and using IntersectionObserver for scroll-linked highlighting gives correct CMD+F behavior without custom search infrastructure.

**Alternatives considered**: Single-page render with prev/next navigation — simpler implementation and lower initial memory cost, but breaks CMD+F entirely. Custom in-app search overlay — correct behavior but significant scope increase.

**Assumptions**: Document page count is bounded (challenge documents are short). For very large PDFs, a virtualized approach with a custom search index would be required.

---

## [2026-07-05] HV prefix for DS atoms

**Decision**: All components under `presentation/components/atoms/` use the `HV` prefix (HVButton, HVBadge, HVTypography). Feature-specific components do not.

**Why**: Clear visual distinction at the import site between reusable design system primitives and feature-specific components. When reading code, `HV` signals "this is a generic building block from the design system" vs. a component that carries domain-specific semantics.

**Alternatives considered**: No prefix (all components look the same, harder to distinguish DS primitives from feature components); full namespace prefix like `DS` or `HomeVision` (more verbose, less ergonomic).

**Assumptions**: The project stays on this single design system. A multi-brand or white-label scenario would require revisiting the prefix strategy.

---

## [2026-07-05] Three-file separation per component

**Decision**: Every component folder contains `index.tsx` (logic), `ComponentName.types.ts` (types), `ComponentName.styles.ts` (cva/clsx strings), and a co-located test file. These are never collapsed into one file.

**Why**: Separation of concerns at the file level enforces the design system contract: `.styles.ts` cannot import component logic or domain types, so raw values cannot leak in. Types are importable without pulling in React or runtime code. The constraint is structural — it cannot be violated accidentally.

**Alternatives considered**: Single-file components (common in smaller projects, but styles and types get inlined, making enforcement rely on discipline rather than structure).

**Assumptions**: Component complexity justifies the overhead. Trivial one-off components could use a single file, but consistency is preferred.

---

## [2026-07-05] MockReviewRepository instantiated in ReviewPage

**Decision**: `ReviewPage` directly imports and instantiates `MockReviewRepository`. No IoC container.

**Why**: Challenge scope does not warrant a DI container. The dependency is explicit and traceable. Adding a container (InversifyJS, tsyringe) would introduce ceremony without benefit at this scale.

**Alternatives considered**: React Context as a DI mechanism (reasonable for production — repository passed via context, swap implementation at the provider level); a lightweight DI container (correct for large apps, overkill here).

**Assumptions**: In production, the repository would be injected via context or a DI library so the HTTP implementation can replace the mock without touching `ReviewPage`.

---

## [2026-07-05] useEffect for data fetching in ReviewPage

**Decision**: Use `useEffect` + `useState` for fetching review data in `ReviewPage` rather than React 19's `use()` hook with Suspense.

**Why**: `use()` requires a stable Promise reference — the same Promise object across renders. Without a cache layer (e.g. a simple `Map<id, Promise>`) the Promise would be recreated on every render, causing an infinite loop. Implementing a minimal cache adds infrastructure that is out of scope for the challenge. `useEffect` is explicit, well-understood, and correct for this use case.

**Alternatives considered**: React 19 `use()` with a simple promise cache keyed by `reviewId` — correct and more idiomatic for React 19, but requires the cache infrastructure. Suspense + lazy data (same constraint).

**Assumptions**: The data fetching pattern is acceptable for challenge scope. A production implementation should adopt `use()` with a proper cache or a data-fetching library.

---

## [2026-07-05] Observability mock (console-based)

**Decision**: Implement the full `ObservabilityService` interface using `console.warn` / `console.error` under the hood. A TODO comment marks the file as requiring replacement before production.

**Why**: The observability contract (`trackEvent`, `trackError`, `trackMetric`, `startSpan`/`endSpan`, `setUserContext`) must be exercised throughout the codebase even in the challenge. A real Datadog integration requires environment variables and a browser RUM setup that is out of scope. A console-based mock preserves the full interface so the rest of the code is written correctly — swapping the implementation requires changing one file.

**Alternatives considered**: No-op mock (all methods are empty functions) — simpler, but gives no signal during development that events are firing correctly. Real Datadog (correct for production, out of scope for challenge).

**Assumptions**: The mock is sufficient for challenge evaluation. The interface is stable — adding new Datadog methods would require updating both the interface and the mock.