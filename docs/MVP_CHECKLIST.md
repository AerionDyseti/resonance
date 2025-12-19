# MVP Checklist: Ports & Adapters Implementation

## Quick Reference: 9 Ports to Implement

### ✅ ALREADY HAVE

- [x] IWorldRepository (DrizzleWorldRepository)

### 🔨 MUST BUILD (9 items)

#### 🗄️ Database Repositories (5 items)

- [ ] **IEntityDefinitionRepository** (2h)
  - Drizzle schema: `entity-definitions.ts`
  - Adapter: `drizzle-entity-definition.repository.ts`
  - Methods: findById, findByWorld, save, delete, existsByName

- [ ] **IPropertyDefinitionRepository** (2h)
  - Drizzle schema: `property-definitions.ts` (NEW)
  - Adapter: `drizzle-property-definition.repository.ts`
  - Methods: findById, findByWorld, findByDefinition, save, delete

- [ ] **IRelationshipDefinitionRepository** (2h)
  - Drizzle schema: `relationship-definitions.ts` (NEW)
  - Adapter: `drizzle-relationship-definition.repository.ts`
  - Methods: findById, findByWorld, save, delete

- [ ] **IEntityRepository** (3h)
  - Drizzle schema: `entities.ts` (UPDATE)
  - Adapter: `drizzle-entity.repository.ts`
  - Methods: findById, findByWorld, findByDefinition, findBySlug, save, delete, existsBySlug
  - Special: Handle JSONB properties serialization

- [ ] **IRelationshipRepository** (2h)
  - Drizzle schema: `relationships.ts` (NEW)
  - Adapter: `drizzle-relationship.repository.ts`
  - Methods: findById, findByWorld, findByEntity, findByDefinition, save, delete

#### 🧠 Intelligence Providers (3 items)

- [ ] **ISemanticSearchProvider** (4h)
  - Adapter: `postgres-semantic-search.provider.ts`
  - Implementation: PostgreSQL full-text search (RECOMMENDED MVP approach)
  - Methods: search, findSimilar, searchFields
  - Query: `SELECT * FROM entities WHERE name ILIKE $1 OR body @@ plainto_tsquery($2)`

- [ ] **IRelationshipProvider** (4h)
  - Adapter: `postgres-relationship.provider.ts`
  - Implementation: SQL joins + recursive CTEs
  - Methods: getRelationships, getConnectedEntities, findRelatedBySharedConnections
  - Query: Recursive CTE for N-hop traversal

- [ ] **IWorldIntelligenceProvider** (6h)
  - Adapter: `claude-intelligence.provider.ts` (or `openai-intelligence.provider.ts`)
  - Implementation: LLM orchestration loop
  - Methods: executeQuery, buildInitialContext, queryLlm, getQueryById, getRecentQueries
  - Main logic: Query loop with capability validation

#### ⭐ Optional/Later

- [ ] **User/Auth Port** (Skip for MVP, add later)
- [ ] **IQueryRepository** (For persisting queries - optional)

---

## Implementation Order (Recommended)

### Week 1: Database & Repositories (11 hours)

1. **Day 1 AM: Schema Design (1h)**
   - [ ] Design entity_definitions schema
   - [ ] Design property_definitions schema
   - [ ] Design relationship_definitions schema
   - [ ] Design entities schema (JSONB properties)
   - [ ] Design relationships schema

2. **Day 1 PM: Core Repository** (2h)
   - [ ] Implement DrizzlePropertyDefinitionRepository
   - [ ] Write basic tests
   - [ ] Create Drizzle migration

3. **Day 2: Metadata Repositories** (4h)
   - [ ] DrizzleEntityDefinitionRepository
   - [ ] DrizzleRelationshipDefinitionRepository
   - [ ] Test both

4. **Day 3: Entity & Relationship Repositories** (4h)
   - [ ] DrizzleEntityRepository (hardest - JSONB handling)
   - [ ] DrizzleRelationshipRepository

### Week 2: Application Layer (4 hours)

5. **Minimal CRUD Use Cases**
   - [ ] CreatePropertyDefinition
   - [ ] ListPropertyDefinitions
   - [ ] CreateEntity
   - [ ] ListEntities
   - [ ] CreateRelationship
   - [ ] CreateWorldQuery (for intelligence)

### Week 3: Intelligence Layer (14 hours)

6. **Day 1: Semantic Search** (4h)
   - [ ] PostgresSemanticSearchProvider
   - [ ] Full-text search queries
   - [ ] Tests

7. **Day 2: Relationship Provider** (4h)
   - [ ] PostgresRelationshipProvider
   - [ ] Recursive CTE queries
   - [ ] Tests

8. **Day 3-4: LLM Provider** (6h)
   - [ ] ClaudeIntelligenceProvider
   - [ ] executeQuery orchestration
   - [ ] Capability building & validation
   - [ ] Tests

### Week 4: API & Integration (4 hours)

9. **tRPC Routers**
   - [ ] Entity definitions router
   - [ ] Entities router
   - [ ] Intelligence router
   - [ ] Connect to use cases

---

## File Structure: What to Create

### New Schema Files (5 files)

```
src/infrastructure/database/schema/
├── property-definitions.ts       [NEW] - Basic CRUD
├── relationship-definitions.ts   [NEW] - Basic CRUD
├── entities.ts                   [UPDATE] - Handle JSONB
├── relationships.ts              [NEW] - Foreign keys
└── world-queries.ts              [NEW] - Query tracking
```

### New Repository Files (5 files)

```
src/infrastructure/database/repositories/
├── drizzle-entity-definition.repository.ts    [NEW]
├── drizzle-property-definition.repository.ts  [NEW]
├── drizzle-relationship-definition.repository.ts [NEW]
├── drizzle-entity.repository.ts               [NEW]
├── drizzle-relationship.repository.ts         [NEW]
└── index.ts                                   [UPDATE] exports
```

### New Intelligence Provider Files (3 files)

```
src/infrastructure/intelligence/
├── postgres-semantic-search.provider.ts      [NEW]
├── postgres-relationship.provider.ts         [NEW]
├── claude-intelligence.provider.ts           [NEW]
└── index.ts                                  [NEW] exports
```

### New Use Case Files (6+ files)

```
src/application/
├── property-definition/create-property-definition.ts
├── entity/create-entity.ts
├── entity/list-entities.ts
├── relationship/create-relationship.ts
├── intelligence/execute-world-query.ts
└── ... (add CRUD as needed)
```

### New tRPC Router Files (1 file)

```
src/server/
└── trpc/routers/
    ├── intelligence.router.ts [NEW]
    ├── entities.router.ts     [NEW]
    └── app.router.ts          [UPDATE]
```

---

## Key Decisions Made

1. **World Model**: Hardcode `DEMO_WORLD_ID = "demo-world-123"` in backend
2. **Semantic Search**: Use PostgreSQL full-text search (not pgvector yet)
3. **LLM**: Claude Anthropic (free tier available)
4. **Properties**: JSONB in PostgreSQL with serialization in repo layer
5. **Graph Queries**: Recursive CTEs (no graph DB needed yet)
6. **Frontend**: Skip auth for MVP, single-world UI

---

## Success Criteria

- [ ] Create entity definition
- [ ] Create property definition
- [ ] Create entity with property values
- [ ] Create relationship between entities
- [ ] Query: "Tell me about [entity name]" → LLM answers using available data
- [ ] Query: "Who is connected to [entity]?" → LLM explores relationships

---

## Testing Checklist

- [ ] Unit: Domain entity validation works
- [ ] Integration: Each repository CRUD works
- [ ] E2E: Create definition → Create entity → Run query works
- [ ] LLM: Claude integration returns valid responses

---

## Database Setup

```bash
# After implementing schemas, create migration:
cd packages/backend
npm run db:generate
npm run db:push

# If you mess up:
npm run db:studio  # Inspect DB with GUI
```

---

## Potential Pitfalls & Fixes

### Pitfall 1: JSONB Properties Hard to Query

- **Fix**: Keep properties as JSONB in DB, convert to domain objects in repo
- **When**: After DrizzleEntityRepository works

### Pitfall 2: LLM Hallucination

- **Fix**: Validate all InfoRequests against capability constraints
- **Check**: `validateInfoRequest()` rejects bad requests

### Pitfall 3: Recursive CTE Performance

- **Fix**: Add `LIMIT` clause, limit `maxHops`
- **Monitor**: Query execution time with EXPLAIN

### Pitfall 4: LLM API Costs

- **Fix**: Use Claude free tier, add rate limiting
- **Monitor**: API usage in Anthropic dashboard

---

## Minimum Viable Feature Set for MVP

✅ MUST HAVE:

- CRUD all metadata definitions
- CRUD all entities
- Create relationships
- Run simple query (entity details)

⏳ NICE TO HAVE (POST-MVP):

- Edit relationships
- Advanced query features
- Export/import world
- Multi-user support

---

## Estimated Timeline

- **Solo developer**: 25 hours → 3-4 weeks
- **2 developers**: 10-12 hours → 1-2 weeks parallel

---

See MVP_IMPLEMENTATION_PLAN.md for full technical details.
