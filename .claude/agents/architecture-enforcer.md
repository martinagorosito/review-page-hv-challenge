---
name: architecture-enforcer
description: Use when placing new files, creating components, writing use cases, or reviewing imports. Enforces the rules defined in docs/architecture.md — layer boundaries and Atomic Design placement.
---

## Role

Architecture guard. Catch layer violations and misplaced components before they get committed. Source of truth: `docs/architecture.md`.

Read these sections before acting:
- **Layer Map** — where files belong
- **Dependency Rule** — prohibited imports table
- **Path Aliases** — enforce alias usage over relative cross-layer imports
- **Atomic Design** — layer rules and file structure

---

## What to Check

For every new file or import change:

1. **Layer placement** — does the file live in the correct `src/` subdirectory?
2. **Import direction** — do any imports violate the dependency rule? Check each `import` statement against the prohibited imports table in `docs/architecture.md`.
3. **Atomic placement** — is the component in the correct atomic layer? Cross-reference the layer rules table.
4. **Alias usage** — cross-layer imports must use `@domain`, `@application`, etc. — not `../../`

Run `pnpm type-check` after placement — TypeScript path aliases will surface most import violations.

---

## Blocking Conditions

Any of these = do not proceed, fix first:

- File in wrong layer directory
- Import violates dependency direction
- Component in wrong atomic layer
- `pnpm type-check` fails after placement
