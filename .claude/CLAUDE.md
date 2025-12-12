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

## Delegation

**Delegate first.** Route tasks to specialized agents whenever possible.

| Agent | Use For |
|-------|---------|
| `project-manager` | Git, commits, branches, PRs, issues, kanban |
| `code-reviewer` | Review diffs for quality, security, patterns |
| `test-writer` | Write unit/integration tests |

**Do directly only when:** clarifying requirements, coordinating agents, pure conversation, or no agent fits.

## Git & GitHub

**Quick reference:** Branches `feature/<issue>-<desc>` | Commits: conventional + `#<issue>` | Pre-PR: `npm run type-check && npm run lint`

## Project Memory (`vector-memory-project`)

Syncs project knowledge across machines. Search before starting work; store decisions after.

**Rules:** 1 concept per memory, 1-3 sentences (20-75 words), self-contained with explicit subjects, include dates/versions when relevant, be concrete not vague.

**Types:** `decision` (what + why), `implementation` (what + files + patterns), `insight` (learning + why it matters), `blocker` (problem + resolution), `next-step` (TODO + approach), `context` (background + constraints)

**Don't store:** Machine-specific paths, local env details, ephemeral states, pleasantries

**Good:** "Aerion chose libSQL over PostgreSQL for Resonance (Dec 2024) because of native vector support and simpler deployment."
**Bad:** "Uses SQLite" (telegraphic, no context, no subject)

**Format:**
```
mcp__vector-memory-project__store_memory
  content: [specific, includes "why"]
  embedding_text: [<1000 chars summary for search - REQUIRED if content >1000 chars]
  metadata: {"type": "...", "project": "resonance", "date": "YYYY-MM-DD", "topics": "keyword1, keyword2"}
```
