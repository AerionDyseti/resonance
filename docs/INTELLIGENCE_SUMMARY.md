# Resonance Intelligence System - Quick Reference

## Four Core Concepts

### 1. WorldQuery - Query Lifecycle

Manages a natural language question and its execution lifecycle.

```
pending → processing → completed/failed
```

**Key Methods:**

- `startProcessing()` - Transition to processing
- `recordInfoRequest()` - Track NeedsMoreInfo iterations
- `complete()` / `fail()` - Finalize query
- `canRequestMoreInfo()` - Check iteration limit
- `remainingInfoRequests()` - Get remaining attempts

**Config:**

```typescript
{
  maxInfoRequests: 3,          // Max iterations
  maxInitialEntities: 10,      // Initial context size
  includeRelationships: true,
  temperature: 0.7
}
```

### 2. QueryContext - Memory Management

Rich domain model for entity, relationship, and definition data.

**Two-Level Entities:**

- **Full entities:** Complete data (body, properties, relationships)
- **Entity summaries:** Lightweight (id, name, definition, summary)

**Key Methods:**

- `addEntity()` / `addEntitySummary()` - Add data
- `markExpanded()` - Track fully explored entities
- `merge()` - Combine contexts from info requests
- `getStats()` - Monitor token usage

**Queries:**

- `allEntityIds` - All known entities (full + summary)
- `expandableEntityIds` - Summaries not yet loaded
- `hasExpandableEntities()` - Can request more detail?

### 3. QueryResponse - LLM Communication

Discriminated union of two response types.

**Answer:**

```typescript
{
  type: 'answer',
  content: string,
  confidence: 'high' | 'medium' | 'low',
  sources: AnswerSource[],      // Provenance
  suggestedFollowUps?: string[]
}
```

**NeedsMoreInfo:**

```typescript
{
  type: 'needs_more_info',
  reason: string,
  requests: InfoRequest[]
}
```

**Type Guards:**

```typescript
isAnswer(response); // true if Answer
isNeedsMoreInfo(response); // true if NeedsMoreInfo
```

### 4. InfoCapabilities - Declarative Actions

Define what information retrieval the LLM can request.

**Built-in Capabilities:**

1. `EXPAND_ENTITY` / `EXPAND_ENTITIES` - Load full entity details
2. `SEARCH_ENTITIES` - Semantic search (unconstrained)
3. `GET_ENTITY_BY_NAME` - Name lookup with fuzzy matching
4. `GET_RELATIONSHIPS` - Relationship traversal
5. `LIST_ENTITY_DEFINITIONS` - Schema discovery
6. `GET_ENTITIES_BY_DEFINITION` - Type-based listing

**Constraint System:**

```typescript
// Parameters include valid values from context
createEntityIdParam(
  'entityId',
  'Entity to expand',
  context.expandableEntityIds // Prevents hallucination
);

// Validation rejects invalid requests
validateInfoRequest(request, capability);
// → { valid: false, errors: ['Invalid entity ID: ...'] }
```

## Execution Flow

```
1. WorldQuery.create()
2. semanticSearch.search() → EntitySummaries
3. QueryContext.create() with summaries
4. buildCapabilities(context)
5. llm.query(text, context, capabilities) → Response
6. Loop while NeedsMoreInfo and iterations < max:
   a. Validate requests
   b. Execute each request (DB queries)
   c. context.merge(results)
   d. Rebuild capabilities
   e. Query LLM again
7. query.complete()
8. Return Answer
```

## Integration Ports

### ISemanticSearchProvider

Vector/semantic search over entities.

```typescript
search(worldId, query, options?)
findSimilar(entityId, options?)
searchFields(worldId, query, fields, options?)
```

### IRelationshipProvider

Graph traversal and relationship analysis.

```typescript
getRelationships(entityIds, options?)
getConnectedEntities(entityId, options?)
findPath(sourceId, targetId, options?)
findRelatedBySharedConnections(entityId, options?)
getRelationshipStats(worldId)
```

### IWorldIntelligenceProvider

Main orchestrator for query execution.

```typescript
executeQuery(worldId, userId, queryText, options?)
buildInitialContext(worldId, queryText, config)
queryLlm(query, context, capabilities, forceAnswer?)
getQueryById(queryId)
getRecentQueries(worldId, userId, options?)
```

## Design Patterns

### 1. Prevent LLM Hallucination

- All parameters constrained to valid values
- Constraint validation rejects bad requests
- Forces answer on constraint violations

### 2. Progressive Context Building

- Start with lightweight entity summaries
- Expand to full entities on demand
- Track expanded entities to avoid duplication
- Monitor token usage with `getStats()`

### 3. Deterministic Iteration

- Fixed `maxInfoRequests` limit (default: 3)
- Forced answer when limit reached (low confidence)
- Prevents infinite loops

### 4. Transparency

- All answers include `sources` (entity contributions)
- `confidence` level indicates answer quality
- `suggestedFollowUps` for guided exploration
- Full query lifecycle tracked

### 5. Infrastructure Independence

- All data sources are port interfaces
- Domain layer doesn't depend on implementation
- Swap LLM providers, search engines, graph DBs

## Example Usage

```typescript
// 1. Create query
const query = WorldQuery.create({
  worldId,
  userId,
  queryText: "Who are the main heroes?",
  config: DEFAULT_QUERY_CONFIG
});

// 2. Build context
query.startProcessing();
const results = await semanticSearch.search(worldId, queryText, { limit: 10 });
let context = QueryContext.create({
  worldId,
  entitySummaries: results
});

// 3. Query with capabilities
const capabilities = buildCapabilities(context);
let response = await llm.query(queryText, context, capabilities);

// 4. Fulfill info requests
while (isNeedsMoreInfo(response) && query.canRequestMoreInfo()) {
  for (const request of response.requests) {
    // Validate
    const cap = getCapabilityById(capabilities, request.capabilityId);
    const valid = validateInfoRequest(request, cap);

    if (!valid.valid) {
      response = createForcedAnswer({...});
      break;
    }

    // Execute and merge
    const result = await fulfillRequest(request);
    context.merge(result);
  }

  // Re-query
  if (isNeedsMoreInfo(response)) {
    capabilities = buildCapabilities(context);
    response = await llm.query(queryText, context, capabilities);
  }
}

// 5. Complete
query.complete();
return response;  // Answer type
```

## File Organization

```
src/domain/intelligence/
├── world-query.ts              # Query lifecycle management
├── query-context.ts            # Context data model
├── query-response.ts           # Answer/NeedsMoreInfo types
├── info-capability.ts          # Capability definitions
├── capabilities.ts             # Built-in capability builders
├── semantic-search.port.ts     # Semantic search interface
├── relationship.port.ts        # Graph traversal interface
├── world-intelligence.port.ts  # Main orchestrator interface
└── index.ts                    # Public exports
```

## Key Files Reference

| File                         | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `world-query.ts`             | Query state machine and lifecycle      |
| `query-context.ts`           | Entity/relationship management for LLM |
| `query-response.ts`          | Answer vs NeedsMoreInfo discrimination |
| `info-capability.ts`         | Capability constraints and validation  |
| `capabilities.ts`            | Builder functions for 6 capabilities   |
| `semantic-search.port.ts`    | Vector search interface                |
| `relationship.port.ts`       | Graph query interface                  |
| `world-intelligence.port.ts` | Orchestrator interface                 |
