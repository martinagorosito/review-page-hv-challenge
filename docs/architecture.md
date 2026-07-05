# Architecture

Single source of truth for all architectural decisions in this project. All agents and executors read this before acting.

---

## Stack

| Concern | Tool |
|---------|------|
| UI framework | React 19 |
| Language | TypeScript 5 (strict) |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 (CSS-first config via `@theme`) |
| Variant management | `class-variance-authority` (cva) + `clsx` |
| Test runner | Vitest 2 |
| Component testing | React Testing Library 16 |
| API mocking (tests) | MSW 2 |
| Package manager | pnpm |

---

## Layer Map

```
src/
├── domain/                    # Business rules — zero framework or library dependencies
│   ├── entities/              # Core data shapes, value objects, domain invariants
│   ├── repositories/          # Interfaces (ports) — contracts for data access, NOT implementations
│   └── services/              # Domain logic that doesn't belong on a single entity
│
├── application/               # Use cases — orchestrate domain + infrastructure
│   └── use-cases/             # One file per use case. No UI concerns here.
│
├── infrastructure/            # Adapters — implement domain interfaces
│   ├── api/                   # HTTP clients, fetch wrappers, response parsers
│   └── repositories/          # Concrete implementations of domain/repositories interfaces
│
├── presentation/              # UI layer
│   ├── components/            # Atomic Design — see section below
│   ├── design-system/
│   │   └── tokens/            # All visual tokens — colors, typography, spacing, radii
│   └── hooks/                 # Presentation-only hooks (local UI state, form state)
│
├── shared/                    # Cross-cutting concerns — no layer affiliation
│   ├── observability/         # Datadog service (mock in dev, real in prod)
│   ├── types/                 # Shared TypeScript types and interfaces
│   └── utils/                 # Pure utility functions
│
└── app/                       # App entry point, providers, routing, error boundaries
```

---

## Dependency Rule

Direction of allowed imports:

```
domain ← application ← infrastructure
domain ← application ← presentation
shared ← any layer
```

**Prohibited imports (hard violations):**

| Violating import | Why |
|------------------|-----|
| `domain` imports from `application`, `infrastructure`, or `presentation` | Inverts dependency — domain must be pure |
| `application` imports from `infrastructure` or `presentation` | Use cases must depend on abstractions (domain interfaces), not adapters |
| `presentation` imports directly from `infrastructure` | UI must go through use cases, not fetch directly |
| Any layer imports from `app/` | App is the composition root — nothing depends on it |

---

## Path Aliases

Defined in `tsconfig.app.json` and `vite.config.ts`. Use aliases for all cross-layer imports — never use relative `../../` paths that cross layer boundaries.

| Alias | Maps to |
|-------|---------|
| `@domain/*` | `src/domain/*` |
| `@application/*` | `src/application/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@presentation/*` | `src/presentation/*` |
| `@shared/*` | `src/shared/*` |
| `@app/*` | `src/app/*` |
| `@design-system/*` | `src/presentation/design-system/*` |

---

## Atomic Design

### Layer Rules

| Layer | Location | Rule |
|-------|----------|------|
| `atoms/` | `presentation/components/atoms/` | Single HTML element or primitive. Zero child component imports from this project. Stateless or minimal local state only. |
| `molecules/` | `presentation/components/molecules/` | Composes 2–5 atoms. No business logic. No data fetching. No use case calls. |
| `organisms/` | `presentation/components/organisms/` | Complex, self-contained section. MAY call application-layer use cases or hooks backed by use cases. |
| `templates/` | `presentation/components/templates/` | Layout skeleton. Accepts `children`. No data fetching. No use case calls. Defines grid/structure. |
| `pages/` | `presentation/components/pages/` | Route entry point. Composes organisms + templates. Handles route params. Lazy-loadable. |

### File Structure Per Component

Every component folder uses three-file separation — never collapse them into one file:

```
ComponentName/
  index.tsx                  # Component logic only — named export
  ComponentName.types.ts     # All TypeScript interfaces and types for this component
  ComponentName.styles.ts    # cva / clsx class strings — no raw color/spacing values
  ComponentName.test.tsx     # Co-located tests
```

**Rules:**
- `index.tsx` imports types from `.types.ts` and styles from `.styles.ts` — never inline either
- `.styles.ts` exports `cva(...)` variants or `clsx(...)` strings — imports nothing from outside the file except `cva`/`clsx`. All values come from Tailwind utilities derived from `@theme` tokens.
- `.types.ts` exports only `interface` / `type` declarations — no logic, no value imports
- No barrel files. Import from the component folder directly.

**`.styles.ts` pattern:**

```typescript
// HVButton.styles.ts
import { cva } from 'class-variance-authority'

export const buttonStyles = cva(
  'inline-flex items-center justify-center font-medium transition-colors rounded-md',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-hover shadow-md',
        secondary: 'border-2 border-black bg-transparent text-content-primary',
        ghost: 'bg-transparent text-content-primary hover:text-brand-600',
      },
      size: {
        lg: 'px-8 py-4 text-sm',
        md: 'px-6 py-3 text-sm',
        sm: 'px-5 py-2 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)
```

---

## Design System Components — HV Prefix

All components that belong to the Design System (atoms and design-system-level molecules) **must** use the `HV` prefix:

```
HVButton      HVBadge       HVTypography
HVInput       HVSelect      HVTextarea
HVAlert       HVAvatar      HVCard
```

**Rule:** If a component lives under `presentation/components/atoms/` or is a primitive DS building block, it gets the `HV` prefix. Feature-specific components (organisms, templates, pages, and feature molecules) do NOT use the prefix.

```
✅ HVButton        — DS atom, reusable anywhere
✅ HVBadge         — DS atom, reusable anywhere
❌ IssueCard       — feature molecule, Review Page specific
❌ ReviewHeader    — feature organism
❌ PdfViewer       — feature organism
```

---

## Code Standards

### TypeScript

- Strict mode — no `any` without an inline comment explaining why it's unavoidable
- No non-null assertions (`!`) without an inline comment
- All exported functions and hooks must have explicit return type annotations
- No `@ts-ignore` or `@ts-expect-error` without justification comment
- `consistent-type-imports` enforced — use `import type` for type-only imports

### React 19

- Functional components only with explicit `FC` type annotation
- Named exports for all components — default exports only for lazy-loaded pages
- One component per file
- Use `use()` hook for async resources — avoid `useEffect` for data fetching
- No `useEffect` for derived state — compute inline or use `useMemo`
- React 19 Actions for form submissions

### Naming

- Components: `PascalCase`
- Hooks: `use` prefix + `camelCase`
- Use cases: `camelCase` verb-noun (e.g., `submitReview`, `fetchReviews`)
- Entities: `PascalCase` — match domain language
- All identifiers, comments, documentation, and TODO items in **English**

---

## Design System Contract

All visual values come from Tailwind utilities backed by `@theme` tokens in `src/app/globals.css`. No raw color/spacing values in component files.

| Forbidden | Correct |
|-----------|---------|
| `className="text-[#4f46e5]"` | `className="text-brand-600"` |
| `className="p-[16px]"` | `className="p-4"` |
| `style={{ color: '#4f46e5' }}` | `className="text-brand-600"` |
| `style={{ margin: '16px' }}` | `className="m-4"` |

**Exception:** truly dynamic values (e.g. progress percentages, pixel positions from external data) may use `style={{ '--var': value }}` + `className="property-[var(--var)]"`.

**Tailwind token reference:**
- Brand: `brand-50` through `brand-900`, `brand-hover`
- Severity: `critical`, `critical-dark`, `critical-bg`, `critical-border` (same pattern for `major`, `minor`)
- Text: `content-primary`, `content-secondary`, `content-slate`, `content-medium`, `content-muted`, `content-disabled`
- Surfaces: `surface-page`, `surface-subtle`, `surface-border`, `surface-border-light`
- Semantic: `success`, `success-dark`, `success-bg`, `success-border`, `success-text` (same for `warning`, `error`, `info`)
- Radius: `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (10px), `rounded-xl` (16px), `rounded-2xl` (24px)
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-brand`, `shadow-card`
- Font sizes (custom): `text-display` (3.5rem), `text-h3` (2rem), `text-xxs` (0.6875rem)
- Font families: `font-sans` (Inter), `font-mono` (JetBrains Mono)

Gate: if `src/app/globals.css` `@theme` block is empty, **no UI work is allowed**.

---

## Observability Contract

Import: `import { observability } from '@shared/observability'`

| Method | When |
|--------|------|
| `trackEvent(name, props?)` | User actions with business significance |
| `trackError(error, ctx?)` | Every caught error — fetches, validation, boundaries |
| `trackMetric(name, value, tags?)` | Performance-sensitive operations |
| `startSpan` / `endSpan` | Every async operation |
| `setUserContext(userId, attrs?)` | When user identity becomes known |

Event naming: `noun.verb` lowercase with dots. E.g. `review.submitted`, `review.load_failed`.

---

## Testing Contract

| Code type | Test type |
|-----------|-----------|
| Domain entities | Unit — pure input/output |
| Use cases | Unit + integration with MSW |
| Atoms / Molecules | Component render + interaction |
| Organisms | Integration — MSW for data |
| Custom hooks | `renderHook` |

Rules:
- Test behavior, not implementation
- `userEvent` only — never `fireEvent`
- `findBy*` / `waitFor` for async — never arbitrary timeouts
- Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- No snapshot tests
- MSW handlers defined before fetch logic — server is `onUnhandledRequest: 'error'`
- Coverage gate: 80% lines / functions / branches / statements (enforced in `vite.config.ts`)

---

## Documentation Contract

**`TODO.md`** — root level. Updated after every task:
- Check off completed items with date
- Add new BLOCKERs or NON-BLOCKERs discovered
- Add to Assumptions when something is assumed for challenge scope

**`DECISIONS.md`** — root level, created on first decision. Append-only:
```markdown
## [YYYY-MM-DD] Decision title
**Decision**: What was decided.
**Why**: Constraint or tradeoff that drove it.
**Alternatives considered**: What else was evaluated.
**Assumptions**: What was taken for granted.
```
