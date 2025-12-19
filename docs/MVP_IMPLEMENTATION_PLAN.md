# Resonance MVP Implementation Plan

## Goal

Basic web app for single world with:

- CRUD on all metadata domain models (EntityDefinition, PropertyDefinition, RelationshipDefinition)
- CRUD on world domain models (Entity, Relationship)
- Intelligence chat system (query execution)

## Architecture Summary

```
Frontend (Vue 3)
    ↓
Express + tRPC
    ↓
Application Layer (Use Cases)
    ↓
Domain Layer (Entities, Logic)
    ↓
Infrastructure (Ports + Adapters)
    ├─ Database: DrizzleWorldRepository (✅ exists)
    ├─ Metadata Repos: (TO IMPLEMENT)
    ├─ Semantic Search: (TO IMPLEMENT)
    ├─ Graph Provider: (TO IMPLEMENT)
    └─ LLM Provider: (TO IMPLEMENT)
    ↓
PostgreSQL + pgvector
```

## Ports to Implement

### 1. MUST IMPLEMENT (Core Functionality)

#### A. Metadata Repositories (Domain Ports)

**IEntityDefinitionRepository**

```typescript
interface IEntityDefinitionRepository {
  findById(id: EntityDefinitionId): Promise<EntityDefinition | null>;
  findByWorld(worldId: WorldId): Promise<EntityDefinition[]>;
  save(def: EntityDefinition): Promise<void>;
  delete(id: EntityDefinitionId): Promise<boolean>;
  existsByName(worldId: WorldId, name: string, excludeId?: EntityDefinitionId): Promise<boolean>;
}
```

**IPropertyDefinitionRepository**

```typescript
interface IPropertyDefinitionRepository {
  findById(id: PropertyDefinitionId): Promise<PropertyDefinition | null>;
  findByWorld(worldId: WorldId): Promise<PropertyDefinition[]>;
  findByDefinition(definitionId: EntityDefinitionId): Promise<PropertyDefinition[]>;
  save(def: PropertyDefinition): Promise<void>;
  delete(id: PropertyDefinitionId): Promise<boolean>;
}
```

**IRelationshipDefinitionRepository**

```typescript
interface IRelationshipDefinitionRepository {
  findById(id: RelationshipDefinitionId): Promise<RelationshipDefinition | null>;
  findByWorld(worldId: WorldId): Promise<RelationshipDefinition[]>;
  save(def: RelationshipDefinition): Promise<void>;
  delete(id: RelationshipDefinitionId): Promise<boolean>;
}
```

#### B. World Domain Repository (Already Exists)

- `IWorldRepository` - DrizzleWorldRepository ✅

#### C. Entity & Relationship Repositories

**IEntityRepository**

```typescript
interface IEntityRepository {
  findById(id: EntityId): Promise<Entity | null>;
  findByWorld(worldId: WorldId): Promise<Entity[]>;
  findByDefinition(worldId: WorldId, definitionId: EntityDefinitionId): Promise<Entity[]>;
  findBySlug(worldId: WorldId, slug: string): Promise<Entity | null>;
  save(entity: Entity): Promise<void>;
  delete(id: EntityId): Promise<boolean>;
  existsBySlug(worldId: WorldId, slug: string, excludeId?: EntityId): Promise<boolean>;
}
```

**IRelationshipRepository**

```typescript
interface IRelationshipRepository {
  findById(id: RelationshipId): Promise<Relationship | null>;
  findByWorld(worldId: WorldId): Promise<Relationship[]>;
  findByEntity(
    entityId: EntityId,
    direction?: 'incoming' | 'outgoing' | 'both'
  ): Promise<Relationship[]>;
  findByDefinition(definitionId: RelationshipDefinitionId): Promise<Relationship[]>;
  save(rel: Relationship): Promise<void>;
  delete(id: RelationshipId): Promise<boolean>;
}
```

#### D. Intelligence Ports (Minimal Implementations)

**ISemanticSearchProvider** (MINIMAL MVP)

```typescript
interface ISemanticSearchProvider {
  search(
    worldId: WorldId,
    query: string,
    options?: {
      limit?: number;
      minScore?: number;
    }
  ): Promise<SemanticSearchResult[]>;

  findSimilar(
    entityId: EntityId,
    options?: {
      limit?: number;
      minScore?: number;
    }
  ): Promise<SemanticSearchResult[]>;

  searchFields(
    worldId: WorldId,
    query: string,
    fields: ('name' | 'body' | 'summary')[],
    options?: { limit?: number }
  ): Promise<SemanticSearchResult[]>;
}
```

**IRelationshipProvider** (MINIMAL MVP)

```typescript
interface IRelationshipProvider {
  getRelationships(
    entityIds: EntityId[],
    options?: {
      direction?: RelationshipDirection;
      limit?: number;
    }
  ): Promise<{ relationships: Relationship[] }>;

  getConnectedEntities(
    entityId: EntityId,
    options?: {
      maxHops?: number;
      limit?: number;
    }
  ): Promise<EntitySummary[]>;

  findRelatedBySharedConnections(
    entityId: EntityId,
    options?: {
      minShared?: number;
      limit?: number;
    }
  ): Promise<Array<{ entity: EntitySummary; sharedCount: number }>>;
}
```

**IWorldIntelligenceProvider** (MVP - Use Claude or OpenAI)

```typescript
interface IWorldIntelligenceProvider {
  executeQuery(
    worldId: WorldId,
    userId: UserId,
    queryText: string,
    options?: QueryExecutionOptions
  ): Promise<QueryExecutionResult>;

  buildInitialContext(
    worldId: WorldId,
    queryText: string,
    config: QueryConfig
  ): Promise<QueryContext>;

  queryLlm(
    query: WorldQuery,
    context: QueryContext,
    capabilities: InfoCapability[],
    forceAnswer?: boolean
  ): Promise<QueryResponse>;

  getQueryById(queryId: QueryId): Promise<WorldQuery | null>;
  getRecentQueries(
    worldId: WorldId,
    userId: UserId,
    options?: { limit?: number }
  ): Promise<WorldQuery[]>;
}
```

---

## Implementation Strategy (MVP)

### Phase 1: Database Layer (1-2 days)

#### Tasks:

1. **Create Database Schemas**
   - Add tables for entity_definitions, property_definitions, relationship_definitions
   - Add tables for entities, relationships
   - Add tables for world_queries (for intelligence)

2. **Implement Metadata Repositories**
   - `DrizzleEntityDefinitionRepository`
   - `DrizzlePropertyDefinitionRepository`
   - `DrizzleRelationshipDefinitionRepository`

3. **Implement World Domain Repositories**
   - `DrizzleEntityRepository`
   - `DrizzleRelationshipRepository`

#### Files to Create:

```
src/infrastructure/database/schema/
├── entity-definitions.ts      (updated - remove templateIds)
├── property-definitions.ts    (new)
├── relationship-definitions.ts (new)
├── entities.ts                (updated)
├── relationships.ts           (new)
└── world-queries.ts           (new)

src/infrastructure/database/repositories/
├── drizzle-entity-definition.repository.ts (new)
├── drizzle-property-definition.repository.ts (new)
├── drizzle-relationship-definition.repository.ts (new)
├── drizzle-entity.repository.ts (new)
├── drizzle-relationship.repository.ts (new)
└── index.ts (updated exports)
```

### Phase 2: Application Layer (1 day)

#### Use Cases Needed:

**EntityDefinition Use Cases:**

- CreateEntityDefinition
- UpdateEntityDefinition
- DeleteEntityDefinition
- ListEntityDefinitions

**PropertyDefinition Use Cases:**

- CreatePropertyDefinition
- UpdatePropertyDefinition
- DeletePropertyDefinition
- ListPropertyDefinitions

**RelationshipDefinition Use Cases:**

- CreateRelationshipDefinition
- UpdateRelationshipDefinition
- DeleteRelationshipDefinition
- ListRelationshipDefinitions

**Entity Use Cases:**

- CreateEntity
- UpdateEntity
- DeleteEntity
- ListEntities
- GetEntity

**Relationship Use Cases:**

- CreateRelationship
- UpdateRelationship
- DeleteRelationship
- ListRelationships

**Intelligence Use Cases:**

- ExecuteWorldQuery

#### Files to Create:

```
src/application/
├── entity-definition/
│   ├── create-entity-definition.ts
│   ├── update-entity-definition.ts
│   ├── delete-entity-definition.ts
│   └── list-entity-definitions.ts
├── property-definition/
│   ├── create-property-definition.ts
│   ├── update-property-definition.ts
│   ├── delete-property-definition.ts
│   └── list-property-definitions.ts
├── relationship-definition/
│   ├── create-relationship-definition.ts
│   ├── update-relationship-definition.ts
│   ├── delete-relationship-definition.ts
│   └── list-relationship-definitions.ts
├── entity/
│   ├── create-entity.ts
│   ├── update-entity.ts
│   ├── delete-entity.ts
│   ├── list-entities.ts
│   └── get-entity.ts
├── relationship/
│   ├── create-relationship.ts
│   ├── update-relationship.ts
│   ├── delete-relationship.ts
│   └── list-relationships.ts
└── intelligence/
    └── execute-world-query.ts
```

### Phase 3: Intelligence Adapters (2 days)

#### A. Semantic Search (Simple Implementation)

**PostgreSQL Full-Text Search** (MVP, no pgvector yet)

```typescript
// Simple full-text search on entity name + body + summary
class PostgresSemanticSearchProvider implements ISemanticSearchProvider {
  search(worldId, query) {
    // SELECT * FROM entities
    // WHERE world_id = $1
    // AND (name ILIKE $2 OR body @@ plainto_tsquery($2))
    // ORDER BY ts_rank(body, query)
  }
}
```

Or use **pgvector** if you have embeddings:

```typescript
class PgVectorSemanticSearchProvider implements ISemanticSearchProvider {
  // Use OpenAI embeddings API to embed query
  // Search for similar vectors in pgvector
}
```

**Key Decision:** For MVP, I'd recommend PostgreSQL full-text search (simpler, no external dependencies)

#### B. Relationship Provider (Database-based)

```typescript
class PostgresRelationshipProvider implements IRelationshipProvider {
  // Query relationships using SQL joins
  // No need for graph database yet - simple joins work

  async getRelationships(entityIds) {
    // SELECT * FROM relationships
    // WHERE source_entity_id = ANY($1) OR target_entity_id = ANY($1)
  }

  async getConnectedEntities(entityId, maxHops = 2) {
    // Recursive CTE to find connected entities
    // WITH RECURSIVE connected AS (...)
  }
}
```

#### C. LLM Provider (Claude/OpenAI)

```typescript
class ClaudeIntelligenceProvider implements IWorldIntelligenceProvider {
  async queryLlm(query, context, capabilities, forceAnswer) {
    // 1. Format context for LLM
    // 2. Format available capabilities
    // 3. Create prompt with system instructions
    // 4. Call Claude API
    // 5. Parse response (Answer or NeedsMoreInfo)
    // 6. Validate against capabilities
  }

  async executeQuery(worldId, userId, queryText, options) {
    // Orchestrate the full loop:
    // 1. Create WorldQuery
    // 2. Build initial context via semantic search
    // 3. Loop: queryLlm → validate → fulfill requests
    // 4. Return final answer
  }
}
```

**Files to Create:**

```
src/infrastructure/intelligence/
├── postgres-semantic-search.provider.ts
├── postgres-relationship.provider.ts
├── claude-intelligence.provider.ts (or openai-intelligence.provider.ts)
└── index.ts
```

### Phase 4: API Layer (1 day)

#### tRPC Router Structure

```typescript
// src/server/trpc/routers/
├── entity-definitions.router.ts    # CRUD endpoints
├── property-definitions.router.ts
├── relationship-definitions.router.ts
├── entities.router.ts
├── relationships.router.ts
├── intelligence.router.ts          # Query execution
├── worlds.router.ts                # Get single world (hardcoded)
└── app.router.ts                   # Root router

// Root router combines all:
export const appRouter = t.router({
  worlds: worldsRouter,
  entityDefinitions: entityDefinitionsRouter,
  propertyDefinitions: propertyDefinitionsRouter,
  relationshipDefinitions: relationshipDefinitionsRouter,
  entities: entitiesRouter,
  relationships: relationshipsRouter,
  intelligence: intelligenceRouter,
});
```

---

## MVP Adapter Implementations (Summary)

| Component                         | Implementation                          | Complexity          | Notes                           |
| --------------------------------- | --------------------------------------- | ------------------- | ------------------------------- |
| IWorldRepository                  | DrizzleWorldRepository                  | ✅ Done             | Existing                        |
| IEntityDefinitionRepository       | DrizzleEntityDefinitionRepository       | 2 hours             | SQL CRUD                        |
| IPropertyDefinitionRepository     | DrizzlePropertyDefinitionRepository     | 2 hours             | SQL CRUD                        |
| IRelationshipDefinitionRepository | DrizzleRelationshipDefinitionRepository | 2 hours             | SQL CRUD                        |
| IEntityRepository                 | DrizzleEntityRepository                 | 3 hours             | Handle JSONB properties         |
| IRelationshipRepository           | DrizzleRelationshipRepository           | 2 hours             | SQL CRUD                        |
| ISemanticSearchProvider           | PostgresSemanticSearchProvider          | 4 hours             | Full-text search                |
| IRelationshipProvider             | PostgresRelationshipProvider            | 4 hours             | Recursive CTEs                  |
| IWorldIntelligenceProvider        | ClaudeIntelligenceProvider              | 6 hours             | API integration + orchestration |
|                                   |                                         | **Total: 25 hours** | ~3 days solo                    |

---

## Single-World Simplification

Since MVP assumes one world:

### Option A: Hardcode World ID

```typescript
const DEMO_WORLD_ID = 'demo-world-123'; // Set once in DB

// In endpoints:
async function getEntityDefinitions() {
  return await repo.findByWorld(DEMO_WORLD_ID);
}
```

### Option B: Use World from Session

```typescript
// After auth, store world in session
const world = await worldRepo.findById(ctx.user.worldId);
```

### Option C: API Always Uses Demo World

```typescript
// Frontend never sends worldId, backend always uses hardcoded
t.procedure.query(async () => {
  const defs = await repo.findByWorld(DEMO_WORLD_ID);
  return defs;
});
```

**Recommendation:** Use Option A (hardcode). Simplest for MVP, easy to parameterize later.

---

## Database Migrations

You'll need Drizzle migrations for new tables. Create with:

```bash
cd packages/backend
npm run db:generate
npm run db:push
```

## Testing Strategy for MVP

### Unit Tests (Domain)

- EntityDefinition validation
- Entity slug validation
- Query state machine

### Integration Tests (Repo + DB)

- CRUD operations on each repository
- Transaction handling

### E2E Tests (Full flow)

- Create definition → create entity → run query

---

## Frontend Integration (Basic)

Single-page app with tabs:

```vue
<template>
  <div class="app">
    <nav>
      <button @click="tab = 'definitions'">Define Schema</button>
      <button @click="tab = 'entities'">Manage Entities</button>
      <button @click="tab = 'chat'">Intelligence Chat</button>
    </nav>

    <div v-if="tab === 'definitions'">
      <EntityDefinitionCRUD />
      <PropertyDefinitionCRUD />
      <RelationshipDefinitionCRUD />
    </div>

    <div v-if="tab === 'entities'">
      <EntityCRUD />
      <RelationshipCRUD />
    </div>

    <div v-if="tab === 'chat'">
      <IntelligenceChat />
    </div>
  </div>
</template>
```

---

## Immediate Next Steps

1. **Design database schema** (30 min)
   - Review Drizzle schema for entity_definitions, etc.
   - Plan property storage (JSONB in PostgreSQL)

2. **Implement metadata repositories** (3-4 hours)
   - Create Drizzle schema files
   - Create repository implementations
   - Write basic tests

3. **Implement entity/relationship repositories** (3-4 hours)
   - Handle JSONB properties serialization
   - Validate slug uniqueness

4. **Create use cases** (2-3 hours)
   - Create/update/delete for each domain model

5. **Implement semantic search & relationship provider** (4-6 hours)
   - PostgreSQL full-text search
   - Relationship traversal queries

6. **Implement LLM provider** (6-8 hours)
   - Claude or OpenAI API integration
   - Orchestration loop
   - Capability validation

7. **Create tRPC routes** (2-3 hours)
   - Connect use cases to API endpoints

8. **Build frontend** (4-6 hours)
   - Vue 3 components for each entity type
   - Chat interface

**Total Estimated Time: 3-4 weeks solo, or 1-2 weeks with 2 developers**

---

## Risk Areas & Mitigations

| Risk                         | Mitigation                                     |
| ---------------------------- | ---------------------------------------------- |
| LLM API costs                | Use free tier, rate limit, cache contexts      |
| pgvector not needed yet      | Use simple full-text search initially          |
| Complex validation           | Start simple, add constraints gradually        |
| State management complexity  | Use tRPC Query for caching, simple React Query |
| Relationship cycles in graph | Limit maxHops to prevent infinite loops        |
