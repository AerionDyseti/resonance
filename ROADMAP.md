# Resonance Development Roadmap

This document outlines the step-by-step development plan for Resonance, organized into testable components.

## Phase 1: Foundation ✅

- [x] Project structure setup
- [x] Core configuration and environment
- [x] Database setup (Chroma + SQLite)
- [x] Core data models and type definitions
- [x] Schema builder with mixin support
- [x] Schema validator with property type checking

## Phase 2: Schema System (Current)

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
- [ ] Implement computed property calculation
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

## Phase 9: API Layer

### 9.1 FastAPI Routes
- [ ] Create world management endpoints
- [ ] Create schema management endpoints
- [ ] Create entity CRUD endpoints
- [ ] Create search and query endpoints
- [ ] Create relationship endpoints
- [ ] Create campaign endpoints

### 9.2 API Testing
- [ ] Write integration tests for all endpoints
- [ ] Test authentication and authorization
- [ ] Test error handling
- [ ] Test API documentation
- [ ] Performance testing

## Phase 10: MCP Server

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

## Phase 12: Frontend (TBD)

### 12.1 Framework Selection
- [ ] Evaluate React/Next.js
- [ ] Evaluate Vue/Nuxt
- [ ] Evaluate SvelteKit
- [ ] Make decision and document rationale

### 12.2 Core UI Components
- [ ] Schema builder interface
- [ ] Entity editor (forms + markdown)
- [ ] Navigation and hierarchy browser
- [ ] Search interface

### 12.3 Advanced UI
- [ ] Relationship graph visualization
- [ ] Timeline visualization
- [ ] Campaign management UI
- [ ] User settings and preferences

## Current Priority

**Focus**: Complete Phase 2 (Schema System Testing) before moving forward.

We're taking a test-driven approach where each component is fully tested before building the next layer.

## Testing Strategy

1. **Unit Tests**: Test individual functions and classes in isolation
2. **Integration Tests**: Test component interactions (e.g., schema + validator)
3. **End-to-End Tests**: Test complete workflows (e.g., create entity with schema validation)
4. **Performance Tests**: Ensure system scales with large datasets

## Success Metrics

- [ ] All tests passing with >80% coverage
- [ ] Can create a complete world with custom schemas
- [ ] MCP server can query and understand world data
- [ ] Web UI provides intuitive world management
- [ ] System handles 10,000+ entities efficiently
