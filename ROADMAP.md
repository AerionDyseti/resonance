# Resonance Development Roadmap

This document outlines the step-by-step development plan for Resonance, organized into testable components.

## Phase 0: Project Setup ✅

- [x] Monorepo structure (npm workspaces)
- [x] Backend package setup (Node.js + TypeScript + Express + tRPC)
- [x] Frontend package setup (Vue 3 + Vite + Vue Router + TailwindCSS)
- [x] Shared types package (domain types + Zod schemas)
- [x] Development tooling (ESLint, Prettier, Husky pre-commit hooks)
- [x] Environment configuration (Zod-validated env)
- [x] Docker setup (dev + production)

## Phase 1: Database & Core Models (Current)

- [x] PostgreSQL/Drizzle ORM setup with migrations
- [x] Database schema design for entities, properties, relationships
- [x] Vector storage integration (pgvector with utility functions)
- [x] Core type definitions and interfaces
- [ ] Schema builder with template/trait support
- [ ] Property validator with type checking

## Phase 2: Schema System

### 2.1 Schema Builder Testing

- [ ] Write unit tests for mixin creation and retrieval
- [ ] Write unit tests for entity type schema creation
- [ ] Write unit tests for schema composition (mixins + properties)
- [ ] Write integration tests for schema persistence
- [ ] Test schema import/export functionality

### 2.2 Schema Validation Testing

- [ ] Write tests for each property type validation
- [ ] Write tests for required field checking
- [ ] Write tests for constraint validation (min/max, regex, etc.)
- [ ] Write tests for relationship validation
- [ ] Test error handling and error messages

## Phase 3: Entity Management

### 3.1 Entity Storage Layer

- [ ] Implement Chroma collection management for entities
- [ ] Implement entity embedding generation
- [ ] Create entity storage service
- [ ] Write tests for entity storage and retrieval
- [ ] Test vector embedding quality

### 3.2 Entity CRUD Operations

- [ ] Implement entity creation with validation
- [ ] Implement entity reading and querying
- [ ] Implement entity updates with schema validation
- [ ] Implement entity deletion with relationship handling
- [ ] Write comprehensive CRUD tests with various schemas

### 3.3 Property Management

- [ ] Implement property type coercion
- [ ] Handle property defaults
- [ ] Write property-specific tests

## Phase 4: Markdown & Content Processing

### 4.1 Markdown Processing

- [ ] Implement basic markdown parsing
- [ ] Implement property reference resolution ({{property}})
- [ ] Implement entity transclusion ([[entity]])
- [ ] Write tests for markdown rendering
- [ ] Test circular reference prevention

### 4.2 Content Integration

- [ ] Integrate markdown with entity storage
- [ ] Implement content search indexing
- [ ] Test combined property + markdown search

## Phase 5: Relationships

### 5.1 Relationship Management

- [ ] Implement relationship creation and storage
- [ ] Implement bidirectional relationship sync
- [ ] Implement relationship cardinality enforcement
- [ ] Write tests for relationship CRUD
- [ ] Test relationship integrity validation

### 5.2 Relationship Graph

- [ ] Implement relationship graph queries
- [ ] Create graph traversal utilities
- [ ] Generate visualization data structures
- [ ] Write tests for graph operations
- [ ] Test performance with large graphs

## Phase 6: Search & Query

### 6.1 Semantic Search

- [ ] Implement vector similarity search
- [ ] Implement hybrid search (semantic + filters)
- [ ] Optimize search performance
- [ ] Write search tests with various queries
- [ ] Test search result ranking

### 6.2 Property Filtering

- [ ] Implement filter operators (eq, gt, contains, etc.)
- [ ] Implement AND/OR filter logic
- [ ] Implement saved filters
- [ ] Write comprehensive filter tests
- [ ] Test complex nested filters

### 6.3 Advanced Queries

- [ ] Implement smart collections (auto-updating views)
- [ ] Implement faceted search
- [ ] Implement full-text search
- [ ] Write query optimization tests

## Phase 7: Campaign System

### 7.1 Campaign Snapshots

- [ ] Implement snapshot creation
- [ ] Implement snapshot restoration
- [ ] Implement snapshot diffing
- [ ] Write snapshot tests
- [ ] Test snapshot performance and storage

### 7.2 World Change Tracking

- [ ] Implement change log system
- [ ] Track entity modifications
- [ ] Implement change attribution
- [ ] Write change tracking tests

### 7.3 Permissions & Spoilers

- [ ] Implement spoiler protection system
- [ ] Implement export controls
- [ ] Add read-only sharing
- [ ] Write permission tests

## Phase 8: Timeline System

### 8.1 Timeline Management

- [ ] Implement timeline event storage
- [ ] Create chronological ordering
- [ ] Implement timeline queries
- [ ] Write timeline tests

### 8.2 Consistency Checking

- [ ] Implement temporal validation
- [ ] Detect chronological conflicts
- [ ] Provide consistency suggestions
- [ ] Write consistency tests

## Phase 9: Backend API (tRPC)

### 9.1 tRPC Router Setup

- [ ] Set up tRPC server with Express
- [ ] Create world management procedures
- [ ] Create schema management procedures
- [ ] Create entity CRUD procedures
- [ ] Create search and query procedures
- [ ] Create relationship procedures
- [ ] Create campaign procedures

### 9.2 API Testing & Documentation

- [ ] Write integration tests for all procedures
- [ ] Test type safety end-to-end
- [ ] Test authentication and authorization
- [ ] Test error handling and validation
- [ ] Performance benchmarking with real data

## Phase 10: MCP Server (Optional/Future)

> **Note**: This phase is optional and can be deferred until core functionality is complete. It enables Claude and other AI tools to query and interact with Resonance worlds.

### 10.1 MCP Foundation

- [ ] Set up MCP server structure
- [ ] Implement basic MCP tools
- [ ] Create tool registry
- [ ] Write MCP server tests

### 10.2 Query Tools

- [ ] Implement natural language query tool
- [ ] Implement entity lookup tools
- [ ] Implement relationship traversal tools
- [ ] Write query tool tests

### 10.3 Context Building

- [ ] Implement scene context builder
- [ ] Implement character context builder
- [ ] Implement relationship context builder
- [ ] Write context building tests

### 10.4 Validation & Generation

- [ ] Implement consistency check tool
- [ ] Implement content generation tools
- [ ] Implement suggestion tools
- [ ] Write validation and generation tests

## Phase 11: Import/Export

### 11.1 Schema Import/Export

- [ ] Implement YAML schema export
- [ ] Implement YAML schema import
- [ ] Implement JSON schema format
- [ ] Write schema I/O tests

### 11.2 Content Import

- [ ] Implement markdown file import
- [ ] Implement WorldAnvil import (if feasible)
- [ ] Implement Obsidian vault import
- [ ] Write import tests

### 11.3 Export Formats

- [ ] Implement markdown export
- [ ] Implement JSON export
- [ ] Implement API for third-party tools
- [ ] Write export tests

## Phase 12: Frontend (Vue 3 + Vite)

### 12.1 Project Setup

- [ ] Vue 3 + Vite project scaffold
- [ ] TanStack Query integration with tRPC client
- [ ] TipTap editor integration
- [ ] Tailwind CSS configuration
- [ ] Component library scaffolding
- [ ] Routing setup (Vue Router)
- [ ] OAuth authentication flow

### 12.2 Core UI Components

- [ ] Entity form with dynamic property fields
- [ ] WYSIWYG editor with TipTap
- [ ] Entity list/grid views
- [ ] Schema management interface
- [ ] Navigation and world browser
- [ ] Search interface with filters

### 12.3 Advanced UI

- [ ] Relationship visualization (graph view)
- [ ] Timeline visualization
- [ ] Campaign management dashboard
- [ ] User settings and preferences
- [ ] World snapshots and version history

## Development Approach

**Recommended Order**:

1. **Phase 0**: Project setup and infrastructure
2. **Phase 1**: Database layer with Drizzle ORM
3. **Phase 2-8**: Core business logic (schema, entities, relationships, search)
4. **Phase 9**: Backend API (tRPC procedures)
5. **Phase 12**: Frontend (Vue 3 + Vite)
6. **Phase 11**: Import/Export features
7. **Phase 10**: MCP Server (optional, when core is solid)

We're taking a **test-driven approach** where each component is tested before moving to the next layer.

## Testing Strategy

1. **Unit Tests**: Test individual functions and classes (backend business logic)
2. **Integration Tests**: Test Drizzle ORM queries, service layer interactions
3. **End-to-End Tests**: Test complete workflows via tRPC client
4. **Performance Tests**: Ensure vector search and large entity queries are efficient
5. **Component Tests**: Vue component testing with Vue Test Utils

**Framework**: Vitest for backend/frontend unit tests

## Success Metrics (MVP)

- [ ] All tests passing with >80% coverage
- [ ] Can create worlds with custom entity types and properties
- [ ] Entities store markdown content with WYSIWYG editor
- [ ] Semantic search finds similar entities by vector distance
- [ ] Relationships between entities can be created and visualized
- [ ] System efficiently handles 1000+ entities with complex schemas
- [ ] OAuth authentication works with Google/GitHub/Discord
- [ ] Export to JSON and Markdown formats

---

## Future Considerations (Post-MVP)

These features were identified during domain modeling but deferred to keep MVP scope manageable.

### Timeline & Calendar Systems

- [ ] Custom calendar systems (fantasy calendars, custom eras)
- [ ] Timeline Events as first-class entities
- [ ] Temporal validation and chronological conflict detection
- [ ] Era definitions and year offsets

> **Note**: Phase 8 (Timeline System) covers basic timeline; this extends it with full calendar customization.

### Campaigns & Session Tracking

- [ ] Campaign aggregate with session tracking
- [ ] Session notes linked to world state
- [ ] Spoiler protection (hide entities/properties from players)
- [ ] World snapshots per session for "what players know"

> **Note**: Phase 7 (Campaign System) covers this.

### Entity History & Versioning

- [ ] Full version history for entities
- [ ] View/restore previous entity states
- [ ] Audit log (who changed what, when)
- [ ] Diff view between versions

### Collaboration & Sharing

- [ ] World sharing with collaborator roles (viewer, editor)
- [ ] Team/organization-based ownership
- [ ] Concurrent editing with conflict resolution
- [ ] Comments and annotations on entities

### User Features

- [ ] User favorites/pins for quick access to entities
- [ ] Recently viewed entities
- [ ] Custom dashboard per world

### Advanced Property Features

- [ ] Computed/formula properties (e.g., `full_name = firstName + lastName`)
- [ ] Virtual properties (read-only derived values)
- [ ] Property inheritance/override per entity

### Content States

- [ ] Draft/published workflow for entities
- [ ] Scheduled publishing
- [ ] Review/approval workflows
