# Resonance Development Workflow & Context

## Development Workflow

### Kanban-Based Issue Flow

We use GitHub Projects as our kanban board. Each issue moves through these stages:

```
Ready → In Progress → In Review → Done
```

### Workflow Steps

**1. Start Work on an Issue**

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/<issue-number>-<brief-description>
```

Then move the ticket to "In Progress":
```bash
gh project item-edit --project-id PVT_kwHOAXv1ls4BKbVp \
  --id <ITEM_ID> \
  --field-id PVTSSF_lAHOAXv1ls4BKbVpzg6TFMo \
  --single-select-option-id 47fc9ee4  # In Progress
```

**2. Do the Work**

- Make changes related to the single issue
- Commit with conventional commits: `feat:`, `fix:`, `docs:`, etc.
- Reference issue number in commits: `#<issue-number>`

**3. Create Pull Request**

```bash
git push -u origin feature/<issue-number>-<brief-description>
gh pr create --title "[#<issue>] <title>" --body "..." --base main
```

Then move the ticket to "In Review":
```bash
gh project item-edit --project-id PVT_kwHOAXv1ls4BKbVp \
  --id <ITEM_ID> \
  --field-id PVTSSF_lAHOAXv1ls4BKbVpzg6TFMo \
  --single-select-option-id df73e18b  # In Review
```

**4. After User Merges PR**

Move ticket to "Done" and close issue:
```bash
gh project item-edit --project-id PVT_kwHOAXv1ls4BKbVp \
  --id <ITEM_ID> \
  --field-id PVTSSF_lAHOAXv1ls4BKbVpzg6TFMo \
  --single-select-option-id 98236657  # Done

gh issue close <issue-number>
```

Then return to main:
```bash
git checkout main
git pull origin main
```

### Project Status Field IDs

| Status | Option ID |
|--------|-----------|
| Blocked | f75ad846 |
| Ready | 61e4505c |
| In Progress | 47fc9ee4 |
| In Review | df73e18b |
| Done | 98236657 |

### Finding Item IDs

To get the item ID for an issue:
```bash
gh project item-list 2 --owner AerionDyseti | grep "<issue-number>"
```

## Tech Stack

- **Frontend**: Vue 3 + Vite + TanStack Query + Tailwind CSS + Vue Router
- **Backend**: Node.js + TypeScript + Express + tRPC + Drizzle ORM
- **Database**: libSQL (SQLite-compatible) with native vector support
- **Testing**: Vitest
- **Linting/Formatting**: ESLint + Prettier + Husky pre-commit hooks

## Key Files & Directories

- `/packages/backend/` - Express server, tRPC routers, Drizzle schema
- `/packages/frontend/` - Vue 3 app, components, pages, router
- `/packages/shared/` - TypeScript types (domain, API), Zod schemas
- `/STRUCTURE.md` - Detailed project structure documentation
- `/ROADMAP.md` - Implementation phases and milestones
- `/CONTRIBUTING.md` - Development guidelines

## Current Status

- **Phase 0**: Project Setup ✅ Complete
  - [x] #16 Monorepo structure
  - [x] #18 Backend package setup
  - [x] #19 Frontend package setup
  - [x] #20 Shared types package
  - [x] #21 Development tooling
  - [x] #22 Environment configuration
  - [x] #23 Docker setup

- **Phase 1**: Database & Core Models (Next)
  - [ ] #24 libSQL/Drizzle ORM setup with migrations
  - [ ] #25 Database schema design
  - [ ] #26 Core type definitions
  - [ ] #27 Schema builder
  - [ ] #28 Property validator
  - [ ] #29 Vector storage integration

## Important Notes

- Each feature branch should be self-contained for a single issue
- Always create a PR and wait for human review before merging
- Update GitHub Project board status as you progress through the workflow
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Run `npm run type-check` and `npm run lint` before creating PRs
