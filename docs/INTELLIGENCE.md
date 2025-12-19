# Resonance Intelligence System

The Resonance Intelligence system enables AI-powered natural language queries over world knowledge bases. It uses an iterative refinement loop where the LLM can request additional information when it needs more context to answer accurately.

## Core Architecture

The intelligence system consists of four main concepts:

1. **WorldQuery**: Represents a user's natural language question and manages query lifecycle
2. **QueryContext**: Rich model for managing entities, relationships, and definitions for LLM reasoning
3. **QueryResponse**: Discriminated union allowing LLM to either provide an answer or request more info
4. **InfoCapabilities**: Declarative capabilities that define what information retrieval actions the LLM can request

## WorldQuery: Query Lifecycle Management

A `WorldQuery` tracks a natural language question against a world.

```typescript
// User asks a question
const query = WorldQuery.create({
  worldId: world.id,
  userId: user.id,
  queryText: 'Who are the main heroes and what are their quests?',
  config: {
    maxInfoRequests: 3, // Max NeedsMoreInfo iterations
    maxInitialEntities: 10, // Initial context size
    includeRelationships: true,
    temperature: 0.7,
  },
});

// Query progresses through states
query.startProcessing(); // pending → processing
query.recordInfoRequest(); // Track NeedsMoreInfo responses
query.complete(); // processing → completed
query.completedAt; // Timestamp when done
```

**Query Lifecycle:**

- `pending`: Initial state, ready for execution
- `processing`: Currently being handled by LLM
- `completed`: Successfully finished or forced to answer
- `failed`: Error occurred

**Key Invariants:**

- Query text is non-empty and ≤ 10,000 characters
- `maxInfoRequests` prevents infinite NeedsMoreInfo loops
- Status transitions are validated (e.g., can't complete twice)
- `infoRequestCount` tracks iteration depth

## QueryContext: Intelligent Context Management

`QueryContext` is a rich domain model for managing entity and relationship data for LLM reasoning.

### Two-Level Entity Representation

Entities can exist in two forms for flexible memory management:

```typescript
// Full entities (complete data, heavier weight)
const fullEntity: IEntity = {
  id,
  definitionId,
  name,
  slug,
  aliases,
  summary,
  body,
  imageUrl,
  properties, // All properties
  tagIds,
  createdAt,
  updatedAt,
};

// Entity summaries (lightweight, for context awareness)
const summary: EntitySummary = {
  id,
  name,
  definitionId,
  summary: 'Short description',
};
```

This separation allows:

- **Initial context**: Include many entity summaries to show what exists
- **Expansion**: LLM can request full data for entities it needs details on
- **Progressive loading**: Build context incrementally without overwhelming LLM token budget

### Context Capabilities

```typescript
// Check what's in context
context.allEntityIds; // All entity IDs (full + summary)
context.expandableEntityIds; // Summaries not yet expanded
context.hasEntity(entityId); // Check if known
context.hasFullEntity(entityId); // Check if fully loaded
context.hasExpandableEntities(); // Can expand more?

// Add data
context.addEntity(entity); // Add full entity
context.addEntitySummary(summary); // Add lightweight summary
context.addRelationship(relationship); // Add relationship
context.addDefinitions(definitions); // Add schema definitions

// Track expansion state
context.markExpanded(entityId); // Mark entity as fully explored
context.isExpanded(entityId); // Check if already expanded

// Merge contexts
context.merge(otherContext); // Combine results from info requests

// Monitor usage
context.getStats(); // Entity count, relationship count,
// token estimate
```

### Context Flow Example

```typescript
// 1. Build initial context with semantic search
const initialEntities = await semanticSearch.search(world.id, query, { limit: 5 });
const summaries = initialEntities.map((e) => EntitySummary.from(e));
let context = QueryContext.create({
  worldId: world.id,
  entitySummaries: summaries, // Lightweight start
});

// 2. LLM processes query with capabilities
const response = await llm.query(query, context, capabilities);

// 3a. If NeedsMoreInfo, fulfill request and expand context
if (isNeedsMoreInfo(response)) {
  const fullEntity = await db.getEntity(request.params.entityId);
  const relationships = await relProvider.getRelationships([fullEntity.id]);

  context.addEntity(fullEntity); // Replace summary with full
  context.addRelationships(relationships);
  context.markExpanded(fullEntity.id);

  // Re-query with expanded context
  const nextResponse = await llm.query(query, context, capabilities);
}

// 3b. Or return answer with current context
```

## QueryResponse: LLM Response Types

The LLM can respond in two ways, represented as a discriminated union:

### Answer Response

```typescript
interface Answer {
  type: 'answer';
  content: string; // Natural language response
  confidence: 'high' | 'medium' | 'low';
  sources: AnswerSource[]; // Provenance tracking
  suggestedFollowUps?: string[]; // Related questions
}

interface AnswerSource {
  entityId: EntityId;
  contribution: string; // How entity contributed
  relevance: number; // 0-1 score
}

// Example
const answer: Answer = {
  type: 'answer',
  content:
    "The main heroes are Aragorn and Gandalf. Aragorn's quest is to reclaim his throne, while Gandalf seeks to protect the realm.",
  confidence: 'high',
  sources: [
    { entityId: aragornId, contribution: 'Hero status and quest', relevance: 0.95 },
    { entityId: gandalfId, contribution: 'Hero role and mission', relevance: 0.92 },
  ],
  suggestedFollowUps: ['What are their respective powers?', 'Who are their allies?'],
};
```

**Factory Functions:**

```typescript
createAnswer(params)      // Create a normal answer
createNeedsMoreInfo(...) // Create info request
createForcedAnswer(...)   // Create when hitting max iterations
```

### NeedsMoreInfo Response

```typescript
interface NeedsMoreInfo {
  type: 'needs_more_info';
  reason: string; // Why more info needed
  requests: InfoRequest[]; // What to retrieve
}

interface InfoRequest {
  capabilityId: CapabilityId; // Which capability to invoke
  params: Record<string, unknown>; // Capability parameters
  reason: string; // Why this request
}

// Example
const needsMore: NeedsMoreInfo = {
  type: 'needs_more_info',
  reason:
    'I need to understand the relationship between Aragorn and Frodo to answer your question fully.',
  requests: [
    {
      capabilityId: 'GET_RELATIONSHIPS',
      params: { entityIds: ['aragorn-id'], direction: 'both' },
      reason: "Find Aragorn's connections",
    },
  ],
};
```

**Execution Loop:**

```
1. LLM gets query + context + capabilities
2. Responds with either Answer or NeedsMoreInfo
3. If NeedsMoreInfo:
   - Validate requests against capabilities
   - Fulfill each request (database queries)
   - Merge results into context
   - Increment infoRequestCount
   - If < maxInfoRequests, loop back to 1
   - Else, force answer
4. Return final Answer to user
```

## InfoCapabilities: Declarative Information Actions

Capabilities define what actions the LLM can request. They're declarative and context-aware, preventing LLM hallucination.

### Built-in Capabilities

1. **EXPAND_ENTITY** / **EXPAND_ENTITIES**
   - Get full details of entity (body, properties, relationships)
   - Parameters constrained to expandable entity IDs from context
   - Used when summary insufficient

2. **SEARCH_ENTITIES**
   - Semantic search for entities by natural language query
   - No entity ID constraints (open search)
   - Used when entity not yet known

3. **GET_ENTITY_BY_NAME**
   - Look up entity by name or alias (fuzzy matching)
   - Used for known entities not in context

4. **GET_RELATIONSHIPS**
   - Get incoming/outgoing relationships for entities
   - Constrained to entity IDs in context
   - Direction filtering: incoming, outgoing, or both

5. **LIST_ENTITY_DEFINITIONS**
   - Enumerate available entity types (Character, Location, etc.)
   - No parameters (always returns schema)
   - Used for world structure discovery

6. **GET_ENTITIES_BY_DEFINITION**
   - Get all entities of a specific type
   - Definition names from schema
   - Useful for "list all characters" queries

### Capability Definition

```typescript
interface InfoCapability {
  id: CapabilityId;
  name: string;
  description: string; // For LLM prompt
  parameters: CapabilityParameter[];
  example?: string; // Usage example for LLM
}

interface CapabilityParameter {
  name: string;
  description: string;
  type: ParameterType; // string, number, entity_id, etc.
  required: boolean;
  constraints?: ParameterConstraints; // Prevent hallucination
}
```

### Constraint System

Constraints prevent LLM from requesting invalid data:

```typescript
// Entity ID parameters include valid IDs from context
createEntityIdParam('entityId', 'Entity to expand', context.expandableEntityIds)

// Results in constraint validation:
ParameterConstraints {
  validEntityIds: ['actual-id-1', 'actual-id-2'],
  enumValues: ['actual-id-1', 'actual-id-2']  // Also for enum format
}

// Validation rejects invalid requests
validateInfoRequest(request, capability)  // → { valid: false, errors: [...] }
```

### Dynamic Capability Building

Capabilities are built from current context:

```typescript
// Capabilities adapt to context state
const capabilities = buildCapabilities(context);

// Only include expand if there are expandable entities
if (context.hasExpandableEntities()) {
  capabilities.push(buildExpandEntityCapability(context));
}

// Define values from current entities
const relationshipCap = buildGetRelationshipsCapability(context);
// Parameters constrained to context.allEntityIds

// Provide LLM with formatted capability docs
const prompt = formatCapabilitiesForPrompt(capabilities);
```

## Integration Ports

The intelligence system depends on three infrastructure ports:

### ISemanticSearchProvider

Enables semantic similarity search over entity content.

```typescript
export interface ISemanticSearchProvider {
  search(
    worldId,
    query,
    options?: {
      limit?: number; // Default 10
      minScore?: number; // Threshold 0-1
      excludeEntityIds?: EntityId[];
    }
  ): Promise<SemanticSearchResult[]>;

  findSimilar(
    entityId,
    options?: {
      limit?: number;
      minScore?: number;
      sameWorld?: boolean;
    }
  ): Promise<SemanticSearchResult[]>;

  searchFields(worldId, query, fields, options?): Promise<SemanticSearchResult[]>;
}

interface SemanticSearchResult {
  entityId: EntityId;
  score: number; // 0-1 relevance
  matchedContent: string; // Snippet of match
}
```

**Implementations:** pgvector (PostgreSQL), Pinecone, Weaviate, etc.

### IRelationshipProvider

Provides graph traversal capabilities for understanding entity connections.

```typescript
export interface IRelationshipProvider {
  // Get relationships for entities
  getRelationships(
    entityIds,
    options?: {
      direction?: 'incoming' | 'outgoing' | 'both';
      definitionId?: RelationshipDefinitionId;
      includeEntities?: boolean;
      limit?: number;
    }
  );

  // Find connected entities within N hops
  getConnectedEntities(
    entityId,
    options?: {
      maxHops?: number;
      definitionIds?: RelationshipDefinitionId[];
      limit?: number;
    }
  );

  // Find shortest path between entities
  findPath(
    sourceId,
    targetId,
    options?: {
      maxHops?: number;
      definitionIds?: RelationshipDefinitionId[];
    }
  ): Promise<EntityPath | null>;

  // Find related entities through shared connections
  findRelatedBySharedConnections(entityId, options?);

  // Graph statistics for world
  getRelationshipStats(worldId);
}

interface EntityPath {
  entities: EntitySummary[];
  relationships: RelationshipSummary[];
  length: number; // Hops in path
}
```

**Implementations:** PostgreSQL CTEs, Neo4j, TigerGraph, etc.

### IWorldIntelligenceProvider

The main orchestrator port that coordinates the full query execution.

```typescript
export interface IWorldIntelligenceProvider {
  executeQuery(
    worldId,
    userId,
    queryText,
    options?: QueryExecutionOptions
  ): Promise<QueryExecutionResult>;

  buildInitialContext(worldId, queryText, config): Promise<QueryContext>;

  queryLlm(query, context, capabilities, forceAnswer?: boolean): Promise<QueryResponse>;

  getQueryById(queryId): Promise<WorldQuery | null>;
  getRecentQueries(worldId, userId, options?): Promise<WorldQuery[]>;
}

interface QueryExecutionResult {
  query: WorldQuery;
  answer: Answer;
  context: QueryContext;
  iterations: number; // NeedsMoreInfo cycles
  executionTimeMs: number;
}
```

## Complete Query Execution Flow

```typescript
// 1. User submits query
const query = WorldQuery.create({
  worldId,
  userId,
  queryText: "Who leads the Fellowship?",
  config: DEFAULT_QUERY_CONFIG
});

// 2. Build initial context
query.startProcessing();
const semanticResults = await semanticSearch.search(
  worldId,
  queryText,
  { limit: 10 }
);
let context = QueryContext.create({
  worldId,
  entitySummaries: semanticResults.map(toSummary)
});

// 3. Get available capabilities
const capabilities = buildCapabilities(context);

// 4. Query LLM
let response = await llm.query(query.queryText, context, capabilities);

// 5. Loop while NeedsMoreInfo
while (isNeedsMoreInfo(response) && query.canRequestMoreInfo()) {
  query.recordInfoRequest();

  // Validate and fulfill each request
  for (const request of response.requests) {
    const capability = getCapabilityById(capabilities, request.capabilityId);
    const validation = validateInfoRequest(request, capability);

    if (!validation.valid) {
      // LLM violated constraints, force answer
      response = createForcedAnswer({...});
      break;
    }

    // Execute the request and add to context
    const results = await fulfillRequest(request, worldId);
    context.merge(results);
  }

  if (isNeedsMoreInfo(response)) {
    // Re-query with expanded context
    capabilities = buildCapabilities(context);  // Update capabilities
    response = await llm.query(query.queryText, context, capabilities);
  }
}

// 6. Finalize and return
query.complete();
return {
  query,
  answer: response,  // Now is Answer type
  context,
  iterations: query.infoRequestCount,
  executionTimeMs: Date.now() - query.createdAt
};
```

## Design Principles

### 1. Prevent LLM Hallucination

- All capabilities include constraints (valid IDs, enum values)
- Validation rejects requests with invalid parameters
- Forces answer on constraint violations

### 2. Progressive Context Building

- Start with lightweight summaries
- Expand to full entities only when needed
- Track which entities have been fully explored
- Monitor token usage with context statistics

### 3. Deterministic Limits

- `maxInfoRequests` prevents infinite loops
- Forced answer when limit reached (low confidence)
- All query configurations are persisted for reproducibility

### 4. Transparency and Traceability

- Answers include sources (which entities contributed)
- Suggested follow-ups for guided exploration
- Confidence levels indicate answer quality
- Query lifecycle tracked for analytics

### 5. Infrastructure Independence

- All data sources are ports (interfaces)
- Can swap semantic search, graph databases, LLM providers
- Domain layer doesn't depend on infrastructure details

## Future Extensions

### Capability System

- Custom capabilities per world
- User-defined domain-specific actions
- Capabilities for stored procedures or external APIs

### Context Optimization

- Caching of frequently accessed context
- Automatic context pruning for very large worlds
- Context serialization for resumable queries

### Multi-turn Conversations

- Session context carrying across multiple queries
- User preferences and interaction history
- Personalized capability sets based on user behavior

### Answer Generation Strategies

- Different strategies per query type (factual vs. exploratory)
- Chain-of-thought reasoning with intermediate steps
- Citation formatting (Markdown, plain text, structured)
