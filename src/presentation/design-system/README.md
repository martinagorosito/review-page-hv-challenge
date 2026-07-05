# Design System

## Status: AWAITING HANDOFF

All token files under `tokens/` are shells. Populate them from the Claude Design handoff before building any UI component.

## Gate Rule

**No component may use raw values for color, typography, or spacing.** Always import from `@design-system/tokens`.

## Token Files

| File | Status | Source |
|------|--------|--------|
| `tokens/index.ts` | Shell — awaiting handoff | Claude Design |

## Atomic Design Layers

Components live in `src/presentation/components/`:

| Layer | Purpose | Examples |
|-------|---------|---------|
| `atoms/` | Smallest indivisible UI | Button, Input, Text, Icon |
| `molecules/` | Atoms composed with logic | FormField, SearchBar, Card |
| `organisms/` | Complex sections | Header, ReviewForm, ReviewList |
| `templates/` | Page layout wiring | MainLayout, SidebarLayout |
| `pages/` | Route-level containers | ReviewPage, NotFoundPage |

Each component folder: `ComponentName/index.tsx`, `ComponentName.test.tsx`, `ComponentName.stories.tsx` (optional).
