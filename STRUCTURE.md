# Resonance Project Structure

This is a monorepo using npm workspaces with three main packages.

## Directory Layout

```
resonance/
├── packages/
│   ├── backend/              # Express.js + tRPC server
│   │   ├── src/
│   │   │   ├── router/       # tRPC router procedures (to be created)
│   │   │   ├── db/           # Drizzle ORM schema & migrations
│   │   │   ├── services/     # Business logic
│   │   │   └── index.ts      # Server entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── frontend/             # Vue 3 + Vite application
│   │   ├── src/
│   │   │   ├── components/   # Vue components
│   │   │   ├── pages/        # Page components
│   │   │   ├── lib/          # tRPC client setup
│   │   │   ├── App.vue       # Root component
│   │   │   └── main.ts       # App entry point
│   │   ├── index.html        # HTML entry point
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/               # Shared types and utilities
│       ├── src/
│       │   ├── types/
│       │   │   ├── domain.ts    # Core domain types
│       │   │   ├── api.ts       # API types
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json              # Root workspace config
├── tsconfig.json            # Base TypeScript config
├── .gitignore
├── STRUCTURE.md             # This file
├── README.md                # Project overview
├── CONTRIBUTING.md          # Contributing guidelines
├── ROADMAP.md              # Development roadmap
└── .github/                 # GitHub workflows & issues

```

## Workspace Scripts

Run scripts from the root to execute across all workspaces:

```bash
npm run dev          # Start all dev servers (backend on 3000, frontend on 5173)
npm run build        # Build all packages
npm run test         # Run tests in all packages
npm run lint         # Lint all packages
npm run format       # Format all packages with Prettier
npm run type-check   # TypeScript type checking
```

### Individual Package Scripts

Navigate to a package and run:

```bash
cd packages/backend
npm run dev          # Start backend dev server with hot reload
npm run build        # Build backend
npm start            # Run built backend

cd packages/frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

cd packages/shared
npm run build        # Build types
npm run dev          # Watch mode TypeScript compilation
```

## Package Details

### `@resonance/backend`

- **Framework**: Express.js
- **API Layer**: tRPC (to be added in Phase 9)
- **Database**: Drizzle ORM + libSQL
- **Port**: 3000
- **Dependencies**: Express, Drizzle ORM, better-sqlite3

### `@resonance/frontend`

- **Framework**: Vue 3
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (to be integrated)
- **Port**: 5173
- **Dependencies**: Vue 3, Vite, TanStack Query

### `@resonance/shared`

- **Purpose**: Shared TypeScript types and utilities
- **Exports**: Domain types, API response types
- **No external dependencies** (only TypeScript)

## Development Workflow

1. **Clone and install**:

   ```bash
   git clone <repo>
   cd resonance
   npm install
   ```

2. **Start development servers**:

   ```bash
   npm run dev
   ```

   This will start:
   - Backend on http://localhost:3000
   - Frontend on http://localhost:5173

3. **Make changes**:
   - Frontend changes hot-reload via Vite
   - Backend changes hot-reload via tsx watch
   - Shared types changes require rebuild

4. **Test and format**:
   ```bash
   npm run test
   npm run lint
   npm run format
   npm run type-check
   ```

## Adding Dependencies

Since this is a monorepo, when adding dependencies:

```bash
# Add to a specific workspace
npm install <package> --workspace=@resonance/backend
npm install <package> --workspace=@resonance/frontend
npm install <package> --workspace=@resonance/shared

# Add to root (for dev dependencies)
npm install --save-dev <package> --workspace=root
```

## Cross-Workspace Dependencies

Packages can depend on each other using workspace protocol:

```json
{
  "dependencies": {
    "@resonance/shared": "workspace:*"
  }
}
```

This means "use the local version in the workspace" rather than npm registry.

## TypeScript Configuration

- **Root tsconfig.json**: Base configuration inherited by all packages
- **Package tsconfigs**: Extend root config with package-specific settings
- All packages use strict mode and ES2020 target

## Next Steps

Phase 0 remaining tasks:

- [ ] Initialize backend package (tRPC, middleware)
- [ ] Initialize frontend package (Vue components, router)
- [ ] Create shared types package (core domain types)
- [ ] Set up development tooling (ESLint, Prettier, pre-commit hooks)
- [ ] Environment configuration (.env setup)
- [ ] Docker setup (local dev + production)

See [ROADMAP.md](./ROADMAP.md) for full implementation plan.
