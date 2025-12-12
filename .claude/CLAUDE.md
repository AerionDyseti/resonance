# Resonance

## Stack
- **Frontend**: Vue 3 + Vite + TanStack Query + Tailwind + Vue Router
- **Backend**: Node/TS + Express + tRPC + Drizzle ORM + libSQL
- **Testing**: Vitest | **Tooling**: ESLint + Prettier + Husky

## Structure
```
/packages/backend/   # Express, tRPC routers, Drizzle schema
/packages/frontend/  # Vue 3 app, components, pages
/packages/shared/    # Types, Zod schemas
```
If More Details Needed, See: `STRUCTURE.md`

## Conventions
- **Branches**: `feature/<issue>-<desc>`, `fix/<issue>-<desc>`
- **Commits**: Conventional (`feat:`, `fix:`, `docs:`) + reference `#<issue>`
- **Pre-PR**: Run `npm run type-check && npm run lint`
- **PRs**: Always create PR to `main`, wait for human review

## Workflow
GitHub Projects kanban: Ready → In Progress → In Review → Done

1. **Start**: Create branch from `main` → move ticket to "In Progress"
2. **Work**: Commits reference `#<issue>`, follow conventions
3. **PR**: Push branch, create PR to `main` → move ticket to "In Review"
4. **Done**: User merges → move ticket to "Done", close issue, return to `main`

For `gh project item-edit` commands and kanban field IDs, search vector memory for "resonance workflow".

## Project Memory (`vector-memory-project`)

Syncs project knowledge across machines. Search before starting work; store decisions after.

**Store:** Architecture decisions + rationale, design patterns, implementation choices, conventions, session handoffs, bug resolutions, feature plans

**Don't store:** Machine-specific paths, local env details, personal preferences

**Examples:**
- "Chose React Query over SWR for better devtools and mutation support"
- "Auth: JWT + refresh tokens in httpOnly cookies"
- "Session handoff: Refactored auth module, next: add rate limiting"
