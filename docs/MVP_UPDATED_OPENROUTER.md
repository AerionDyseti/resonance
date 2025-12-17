# MVP Updates: Vector Search + OpenRouter

## Change 1: Semantic Search Implementation

### Old Approach (Removed)

- PostgreSQL full-text search (simple but limited)

### New Approach

- **Vector embeddings** for semantic search
- **OpenRouter embeddings API** for free/cheap model access
- **pgvector** storage in PostgreSQL (already available)
- **Multi-chunk strategy** (5 chunk types per entity)

**New Port Implementation:**

- `ISemanticSearchProvider` → `OpenRouterVectorSearchProvider`
- New supporting port: `IEmbeddingService` → `OpenRouterEmbeddingService`
- New infrastructure: Vector chunk storage, indexing, deduplication

**Effort Impact:**

- Was: 4 hours (full-text search)
- Now: 6 hours (vector search + chunking)
- Δ: +2 hours

## Change 2: LLM Provider

### Old Approach (Removed)

- Anthropic Claude direct API (costly)

### New Approach

- **OpenRouter proxy API** (aggregates multiple LLM providers)
- Benefits: Cost aggregation, failover, model selection, billing consolidation
- Models available via OpenRouter:
  - Meta Llama 2 (cheap)
  - Mistral (balanced)
  - OpenAI models (via proxy)
  - Anthropic models (via proxy)

**New Port Implementation:**

- `IWorldIntelligenceProvider` → `OpenRouterLLMProvider`

**API Integration:**

```typescript
// OpenRouter endpoint: https://openrouter.ai/api/v1/chat/completions
// Free models available: yes
// Cost model: Pay-per-token via OpenRouter

async queryLlm(query, context, capabilities) {
  const response = await openRouterClient.post('/chat/completions', {
    model: 'meta-llama/llama-2-7b-chat', // Free option
    // or: 'mistralai/mistral-7b-instruct' (also free)
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 1000
  });

  return parseResponse(response);
}
```

**Effort Impact:**

- Was: 6 hours (Claude direct)
- Now: 6 hours (OpenRouter - similar complexity)
- Δ: No change (same orchestration logic)

**Cost Impact:**

- Was: $0.003 per 1K input tokens, $0.009 per 1K output tokens (Claude)
- Now: $0 to $0.001 per 1K tokens depending on model choice
- Savings: 70-90%

## Updated MVP Ports & Effort

### DATABASE REPOSITORIES (11 hours - unchanged)

- IEntityDefinitionRepository: 2h
- IPropertyDefinitionRepository: 2h
- IRelationshipDefinitionRepository: 2h
- IEntityRepository: 3h
- IRelationshipRepository: 2h

### INTELLIGENCE LAYER (NEW: 16 hours, was 14)

1. **IEmbeddingService** (NEW): 2 hours
   - OpenRouter embeddings API integration
   - Batch embedding logic
   - Chunk-to-vector pipeline

2. **ISemanticSearchProvider**: 6 hours (was 4)
   - Vector chunking strategy (header, summary, body, property)
   - pgvector schema & storage
   - Cosine similarity search
   - Deduplication by entity

3. **IRelationshipProvider**: 4 hours (unchanged)
   - SQL joins + recursive CTEs
   - No changes needed

4. **IWorldIntelligenceProvider**: 6 hours (unchanged)
   - OpenRouter instead of Claude, but same interface
   - LLM orchestration loop

### REVISED TOTAL: 27 hours (was 25)

- Difference: +2 hours for vector search sophistication
- Solo timeline: 3-4 weeks
- 2 developers: 1-2 weeks

## File Structure Updates

### NEW FILES FOR VECTOR SEARCH

```
src/domain/intelligence/
├── vector-chunk.ts              # VectorChunk domain model
└── vector-chunk.port.ts         # IVectorChunkService port

src/infrastructure/embedding/
├── openrouter-embedding.service.ts  # EmbeddingService impl
└── index.ts

src/infrastructure/database/schema/
├── vector-chunks.ts             # Drizzle schema for vectors

src/infrastructure/database/repositories/
├── drizzle-vector-chunk.repository.ts  # Vector storage
```

### UPDATED FILES

```
src/infrastructure/database/repositories/
└── drizzle-entity.repository.ts
    - Add: Call to vectorChunkService.generateAndStoreChunks()
    - Add: Call to vectorChunkService.deleteChunks() on entity delete

src/application/entity/
├── create-entity.ts (UPDATE)
    - After entity creation, trigger chunk generation
└── delete-entity.ts (UPDATE)
    - Delete associated vector chunks

src/infrastructure/intelligence/
├── openrouter-llm.provider.ts (REPLACES claude-intelligence.provider.ts)
    - OpenRouter API integration instead of Claude SDK
└── index.ts
```

## Integration Points

### When Entity is Created

```
1. CreateEntity use case creates entity
2. Repository.save(entity)
3. After save succeeds:
   a. generateChunks(entity) → VectorChunk[]
   b. embedService.embedChunks(chunks) → embedded
   c. vectorChunkRepository.store(embedded)
4. Return entity
```

### When Query Executes

```
1. LLM receives query text
2. embedService.embedText(query) → queryVector
3. vectorSearchProvider.search(queryVector) → entities
4. Build context from top entities
5. Send to LLM via OpenRouter
6. Parse response (Answer or NeedsMoreInfo)
7. Validate + iterate if needed
```

## OpenRouter Setup

### 1. Get API Key

```bash
# Visit https://openrouter.ai
# Create account → Generate API key
# Set environment variable
export OPENROUTER_API_KEY="sk-or-..."
```

### 2. Choose Model

For MVP (cost-focused):

```
Model: meta-llama/llama-2-7b-chat
Cost: Free
Quality: Good for basic queries
Fallback: mistralai/mistral-7b-instruct (also free)
```

For better quality (still cheap):

```
Model: mistralai/mixtral-8x7b-instruct
Cost: ~$0.27 per 1M input tokens
Quality: Better reasoning
```

### 3. Configure in ENV

```env
# .env
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=meta-llama/llama-2-7b-chat
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### 4. Rate Limiting

```typescript
// Add to prevent costs spiraling
const rateLimiter = new RateLimiter({
  maxQueries: 10, // Per user
  windowMs: 3600 * 1000, // Per hour
  costLimit: 1.0, // Max $1/hour
});
```

## Cost Comparison

### Monthly Usage (Assumed 100 queries, 500 tokens avg per query)

**Old MVP (Anthropic Claude):**

- 100 queries × 500 input tokens × $0.003 = $0.15
- 100 queries × 200 output tokens × $0.009 = $0.18
- **Total: $0.33/month** (plus embeddings if added)

**New MVP (OpenRouter + MiniLM):**

- LLM: 100 queries × 700 tokens × $0 (free model) = $0
- Embeddings: 700 chunks × 2 embedding ops × $0 (free) = $0
- **Total: $0/month** (free tier)

**If scaling to 1000 queries/month:**

Old:

- Inputs: 1000 × 500 × $0.003 = $1.50
- Outputs: 1000 × 200 × $0.009 = $1.80
- Total: $3.30/month

New (free models):

- $0/month

New (Mixtral 8x7b):

- Inputs: 1000 × 700 × $0.00027 = $0.19
- Outputs: 1000 × 200 × $0.00081 = $0.16
- Total: $0.35/month

## Updated Success Criteria

When these work, MVP is complete:

✅ Create entity definition  
✅ Create property definition  
✅ Create entity with properties  
✅ Entity is chunked automatically  
✅ Chunks are embedded via OpenRouter  
✅ Chunks are stored in pgvector  
✅ Create relationship between entities  
✅ Ask LLM: "Tell me about [entity]" → LLM answers (via OpenRouter)  
✅ Ask LLM: "Who is related to [entity]?" → LLM explores relationships

## OpenRouter vs Other Options

| Provider   | Model            | Cost         | Quality   | Notes                |
| ---------- | ---------------- | ------------ | --------- | -------------------- |
| OpenRouter | Llama 2 7B       | Free         | Good      | Best for MVP         |
| OpenRouter | Mistral 7B       | Free         | Good      | Alternative free     |
| OpenRouter | Mixtral 8x7B     | $0.27/1M     | Better    | Recommended upgrade  |
| OpenAI     | GPT-4            | $30/1M input | Excellent | Via OpenRouter proxy |
| Anthropic  | Claude 3         | $3/1M input  | Excellent | Via OpenRouter proxy |
| Local      | Ollama + Llama 2 | $0           | Good      | If self-hosted       |

**Recommendation for MVP:** Start with OpenRouter free model, upgrade to Mixtral if needed.

## Testing Strategy (Updated)

### Unit Tests

- Chunking algorithm: paragraph splitting works
- Vector deduplication: correctly identifies best chunk per entity

### Integration Tests

- OpenRouter embedding API calls work
- Vector storage in pgvector works
- Cosine similarity search returns results

### E2E Tests

- Create entity → chunks generated → searchable via vector
- Query "wizard" → finds Gandalf entity
- Query "ring" → finds entities with related content

## Known Limitations & Mitigations

| Limitation                   | Impact                      | Mitigation                               |
| ---------------------------- | --------------------------- | ---------------------------------------- |
| **Free LLM quality**         | Reasoning limitations       | Start with free, upgrade if needed       |
| **Embedding API latency**    | 100-200ms per query         | Cache query embeddings, batch embed      |
| **Vector storage (384-dim)** | Precision vs cost trade-off | Can upgrade to 1536-dim later            |
| **Chunk deduplication**      | Might lose context          | Store multiple chunks, LLM sees best one |
| **OpenRouter API downtime**  | Service interruption        | Implement fallback LLM provider          |

## Next Steps

1. **Sign up for OpenRouter** (5 min)
2. **Create Drizzle schema for vector_chunks** (30 min)
3. **Implement chunk generation algorithm** (1 hour)
4. **Implement OpenRouter embedding service** (1.5 hours)
5. **Create vector search provider** (3 hours)
6. **Update entity repository to trigger chunking** (1 hour)
7. **Implement OpenRouter LLM provider** (2 hours)
8. **Test end-to-end** (2 hours)
