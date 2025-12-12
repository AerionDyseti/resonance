# Resonance

A flexible, AI-powered world building and tracking system for authors, dungeon masters, and creative worldbuilders.

## Overview

Resonance is a Notion-inspired world building platform that combines structured data ("Page Properties") with freeform markdown content ("Page Body"). Each world can define its own entity types, making it infinitely customizable for any setting.

## Key Features

- **Fully Customizable Schema**: Define your own entity types per world with custom properties
- **Template/Trait System**: Reusable property groups that can be composed together
- **Semantic Search**: AI-powered search using vector embeddings
- **Relationship Mapping**: Track and visualize connections between entities
- **Timeline Management**: Chronological consistency checking and event tracking
- **Campaign Tracking**: Session notes, world changes, and spoiler protection
- **Property References**: Use `{{property}}` in markdown to reference property values
- **Entity Transclusion**: Include content from other entities with `[[entity]]` syntax
- **WYSIWYG Editor**: Rich markdown editor with live preview
- **JSON/Markdown Export**: Export worlds as JSON or Markdown with YAML frontmatter

## Tech Stack

### Frontend

- **Vue 3** with Vite
- **TipTap** (WYSIWYG editor)
- **TanStack Query** (state management)
- **Tailwind CSS** (styling)

### Backend

- **Node.js** with TypeScript
- **Express.js** (HTTP server)
- **tRPC** (type-safe API)
- **Drizzle ORM** (database access)

### Data

- **libSQL** (SQLite-compatible, with native vector support)
- **Native vector embeddings** for semantic search

### Deployment

- **Docker** (containerization)
- **OAuth** (Google, GitHub, Discord)
- **Self-hosted** (VPS/home lab)

## Architecture

### Data Model

Each world contains:

- **Custom entity types** (e.g., Characters, Locations, Factions)
- **Templates** (reusable property groups)
- **Entities** (instances with properties + markdown body)
- **Relationships** (typed connections between entities)
- **Worlds** (snapshots and session tracking)

### Project Structure

```
resonance/
├── packages/
│   ├── backend/          # Node.js + tRPC server
│   │   ├── src/
│   │   │   ├── router/   # tRPC procedure definitions
│   │   │   ├── db/       # Drizzle schema and migrations
│   │   │   ├── services/ # Business logic
│   │   │   └── index.ts
│   │   └── package.json
│   └── frontend/         # Vue 3 + Vite app
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── lib/       # tRPC client setup
│       │   └── main.ts
│       └── package.json
└── package.json          # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for deployment)

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env

# Start development servers
npm run dev
```

This starts:

- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`

### With Docker

```bash
# Development (with hot reload)
docker compose up

# Production
docker compose --profile prod up production
```

## Development Status

✅ **Phase 0 Complete** - Project infrastructure is set up. Currently working on Phase 1 (Database & Core Models).

See [ROADMAP.md](./ROADMAP.md) for the full implementation plan.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

## License

TBD
