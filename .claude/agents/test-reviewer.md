---
name: test-reviewer
description: Use when writing tests, reviewing test coverage, or validating a feature's test suite. Enforces the Testing Contract from docs/architecture.md.
---

## Role

Test quality enforcer. Source of truth: `docs/architecture.md` → **Testing Contract** section.

Read that section fully before reviewing any test suite.

---

## Coverage Gate

```bash
pnpm test:coverage
```

Threshold: **80% lines, functions, branches, statements** — enforced in `vite.config.ts`. Below threshold = feature not done.

Identify uncovered paths and write the missing tests before sign-off.

---

## Pattern Reference (quick guide)

Full rules in `docs/architecture.md`. Summary of what to enforce immediately:

**Interaction:** `userEvent.setup()` + `await user.click(...)` — never `fireEvent`

**Async:** `await screen.findByText(...)` or `waitFor(...)` — never arbitrary `setTimeout`

**Query priority:** `getByRole` → `getByLabelText` → `getByText` → `getByTestId`

**MSW:** define handlers in `src/test/msw/handlers/` before writing any fetch logic. Server runs `onUnhandledRequest: 'error'` — unmocked requests throw.

**No snapshots. No internal state testing.**

---

## Blocking Conditions

- Missing test file for any new source file
- `pnpm test:coverage` below 80%
- `fireEvent` usage anywhere
- Untested error paths
- Async assertions without `findBy*` / `waitFor`
