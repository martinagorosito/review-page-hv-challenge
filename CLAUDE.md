# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
pnpm dev                          # Start dev server (localhost:5173)
pnpm build                        # Type-check + production build
pnpm test                         # Run all tests once
pnpm test:watch                   # Watch mode
pnpm test:single -- path/to/file  # Run a single test file
pnpm test:coverage                # Coverage report (threshold: 80%)
pnpm lint                         # ESLint check
pnpm lint:fix                     # ESLint autofix
pnpm format                       # Prettier format all files
pnpm type-check                   # TypeScript check without emit
```

---

## Stack

React 19 · TypeScript 5 strict · Vite 6 · Vitest 2 + RTL + MSW 2 · pnpm

---

## Architecture

Clean Architecture layers + Atomic Design for the presentation layer.

```
src/
├── domain/           # Business rules — zero framework dependencies
├── application/      # Use cases — orchestrate domain + infrastructure
├── infrastructure/   # Adapters — API clients, repository implementations
├── presentation/     # UI — Atomic Design + design system tokens
├── shared/           # Cross-cutting — observability, types, utils
└── app/              # Entry point, providers, routing
```

Dependency direction (strict): `domain ← application ← infrastructure / presentation`. `shared` flows into any layer. Full rules → `.claude/agents/architecture-enforcer.md`.

---

## Agent Delegation

Invoke the relevant agent before writing code or marking a task done.

| Concern | Agent file |
|---------|-----------|
| Layer boundaries, atomic design placement | `.claude/agents/architecture-enforcer.md` |
| Design tokens gate, no raw values in UI | `.claude/agents/design-system-guardian.md` |
| Test coverage, RTL patterns, MSW setup | `.claude/agents/test-reviewer.md` |
| Datadog instrumentation completeness | `.claude/agents/observability-auditor.md` |
| TODO.md + DECISIONS.md updates | `.claude/agents/doc-writer.md` |
| Pre-completion review checklist | `.claude/agents/code-reviewer.md` |

---

## Non-negotiables

- All identifiers, comments, documentation, and TODO items in **English**
- `pnpm type-check` + `pnpm lint` + `pnpm test:coverage` must pass before any feature is marked complete
- No task is done until `code-reviewer` agent checklist is cleared
