# Vector Semantic Search Strategy for Resonance

## Overview

Instead of PostgreSQL full-text search, we'll use vector embeddings for semantic search. This requires:

1. **Chunking strategy**: How to break entities into embedable pieces
2. **Embedding service**: Generate vectors from chunks
3. **Vector storage**: PostgreSQL pgvector for storage/retrieval
4. **OpenRouter integration**: Cost-effective LLM via OpenRouter

## Domain Analysis: Entity Chunking Strategy

Entities have multiple layers of information that need different chunking approaches:

### Entity Structure

```typescript
interface Entity {
  id: EntityId;
  name: string; // Always include
  slug: string;
  summary: string | null; // Short description
  body: string; // Freeform markdown
  properties: Property[]; // Key-value pairs
  aliases: string[];
  imageUrl?: string;
}
```

### Chunking Approach

We need to create multiple vector-searchable chunks from each entity:

#### 1. **Header Chunk** (Always created)

```
Type: "header"
Content: "{entity.name} - {entity.summary}"
Priority: high (included in all queries)
Size: 100-200 tokens
```

Example:

```
"Gandalf - A powerful wizard known for wisdom and protection"
```

**Why**: Ensures entity is discoverable by name + core description

#### 2. **Summary Chunk** (If summary exists)

```
Type: "summary"
Content: entity.summary
Priority: high
Size: 50-100 tokens
```

**Why**: Quick relevance indicator, lightweight

#### 3. **Body Chunks** (From markdown content)

```
Type: "body"
Content: entity.body split into semantic paragraphs
Priority: medium
Size: 200-500 tokens per chunk
Strategy: Split on double newlines (Markdown paragraph breaks)
         Fall back to sentence-based splitting if needed
```

Example:

```
Original:
"# Gandalf

A wizard from the West. Known for his staff and wisdom.

He journeyed through Middle-earth helping the Free Peoples."

Becomes:
Chunk 1: "Gandalf - A wizard from the West. Known for his staff and wisdom."
Chunk 2: "Gandalf - He journeyed through Middle-earth helping the Free Peoples."
```

**Why**: Body text often contains narrative details important for semantic search

#### 4. **Property Chunks** (For structured data)

```
Type: "property"
Content: "{propertyName}: {propertyValue}"
Priority: medium
Size: 50-150 tokens per property
```

Example:

```
"Gandalf - Aliases: Mithrandir, The Grey Pilgrim"
"Gandalf - Race: Istari (Wizard)"
"Gandalf - Status: Alive"
```

**Why**: Structured metadata is separately searchable

#### 5. **Relationship Context Chunks** (Optional, built at query time)

```
Type: "context"
Content: "Related entities and relationships"
Priority: low
Built: During query execution, not pre-computed
```

Example:

```
"Gandalf - Member of the Fellowship (relationship: member_of)"
"Gandalf - Knows: Frodo, Aragorn, Elrond (via connections)"
```

**Why**: Relationship context helps with "Who is connected to?" queries

### Chunking Algorithm

```typescript
interface VectorChunk {
  id: VectorChunkId;
  entityId: EntityId;
  type: 'header' | 'summary' | 'body' | 'property';
  content: string;           // Text to embed
  sourceProperty?: PropertyDefinitionId; // For property chunks
  metadata: {
    entityName: string;      // For display
    definition: EntityDefinitionId;
    worldId: WorldId;
    priority: 'high' | 'medium' | 'low';
    tokenEstimate: number;
  };
  embedding: Vector;         // 1536-dim from OpenAI (or compatible)
  createdAt: Date;
  updatedAt: Date;
}

function chunkEntity(entity: Entity): VectorChunk[] {
  const chunks: VectorChunk[] = [];

  // 1. Header chunk (always)
  chunks.push({
    type: 'header',
    content: `${entity.name}${entity.summary ? ' - ' + entity.summary : ''}`,
    priority: 'high'
  });

  // 2. Summary chunk (if exists)
  if (entity.summary?.trim()) {
    chunks.push({
      type: 'summary',
      content: entity.summary,
      priority: 'high'
    });
  }

  // 3. Body chunks (semantic splitting)
  if (entity.body?.trim()) {
    const bodyChunks = splitMarkdownParagraphs(entity.body);
    for (const paragraph of bodyChunks) {
      if (paragraph.trim().length > 20) { // Skip tiny fragments
        chunks.push({
          type: 'body',
          content: `${entity.name} - ${paragraph}`,
          priority: 'medium'
        });
      }
    }
  }

  // 4. Property chunks
  for (const property of entity.properties) {
    const propDef = /* get definition */;
    chunks.push({
      type: 'property',
      content: `${entity.name} - ${propDef.name}: ${formatPropertyValue(property.value)}`,
      sourceProperty: property.definitionId,
      priority: 'medium'
    });
  }

  // 5. Alias chunks
  for (const alias of entity.aliases) {
    chunks.push({
      type: 'property',
      content: `${entity.name} (also known as ${alias})`,
      priority: 'medium'
    });
  }

  return chunks;
}

function splitMarkdownParagraphs(text: string): string[] {
  // Split on double newlines (Markdown paragraphs)
  let paragraphs = text.split(/\n\n+/);

  // Split long paragraphs into sentences if > 500 tokens
  paragraphs = paragraphs.flatMap(para => {
    if (estimateTokens(para) > 500) {
      // Split on sentence boundaries
      return para.match(/[^.!?]+[.!?]+/g) || [para];
    }
    return [para];
  });

  return paragraphs.filter(p => p.trim().length > 0);
}
```

## Vector Embedding Pipeline

### Step 1: Create Chunks When Entity Changes

```typescript
async function updateEntityChunks(entity: Entity) {
  // Delete old chunks
  await vectorDb.deleteChunks({ entityId: entity.id });

  // Generate new chunks
  const chunks = chunkEntity(entity);

  // Embed chunks
  const embeddedChunks = await embeddingService.embedChunks(chunks);

  // Store in pgvector
  await vectorDb.storeChunks(embeddedChunks);
}
```

### Step 2: Embedding Service (via OpenRouter)

```typescript
interface EmbeddingService {
  embedChunks(chunks: VectorChunk[]): Promise<VectorChunk[]>;
  embedText(text: string): Promise<Vector>;
}

class OpenRouterEmbeddingService implements EmbeddingService {
  // Use a free/cheap embedding model via OpenRouter
  // Options:
  // - sentence-transformers/all-MiniLM-L6-v2 (free, 384-dim)
  // - thenlper/gte-large (cheap, 1024-dim)
  // - Or OpenAI's text-embedding-3-small via OpenRouter

  async embedChunks(chunks: VectorChunk[]): Promise<VectorChunk[]> {
    // Batch embed up to 50 chunks at once
    // OpenRouter API: POST /embeddings

    const batches = chunk(chunks, 50);
    const results: VectorChunk[] = [];

    for (const batch of batches) {
      const response = await openRouterApi.embeddings({
        model: 'sentence-transformers/all-MiniLM-L6-v2', // Free option
        input: batch.map((c) => c.content),
      });

      for (let i = 0; i < batch.length; i++) {
        batch[i].embedding = response.data[i].embedding;
        results.push(batch[i]);
      }
    }

    return results;
  }
}
```

### Step 3: Vector Storage in PostgreSQL

```typescript
// Drizzle schema for vector chunks

export const vectorChunks = pgTable('vector_chunks', {
  id: uuid('id').primaryKey(),
  entityId: uuid('entity_id').notNull(),
  worldId: uuid('world_id').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // header, summary, body, property
  content: text('content').notNull(), // Text version
  embedding: vector('embedding', { dimensions: 384 }), // pgvector
  metadata: jsonb('metadata').notNull(), // { entityName, priority, etc }
  sourcePropertyId: uuid('source_property_id'), // For property chunks
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Indexes for fast search
createIndex('idx_vector_chunks_entity_id').on(vectorChunks.entityId);
createIndex('idx_vector_chunks_world_id').on(vectorChunks.worldId);
createIndex('idx_vector_chunks_type').on(vectorChunks.type);
// pgvector distance index (IVFFLAT or HNSW for large scale)
```

### Step 4: Semantic Search Query

```typescript
async function semanticSearch(
  worldId: WorldId,
  query: string,
  options: { limit?: number; minScore?: number } = {}
): Promise<SemanticSearchResult[]> {
  // 1. Embed the query
  const queryEmbedding = await embeddingService.embedText(query);

  // 2. Search with pgvector similarity
  const results = await db
    .select({
      entityId: vectorChunks.entityId,
      entityName: vectorChunks.metadata['entityName'],
      chunkType: vectorChunks.type,
      content: vectorChunks.content,
      distance: sql`1 - (${vectorChunks.embedding} <=> ${queryEmbedding})`, // cosine similarity
    })
    .from(vectorChunks)
    .where(eq(vectorChunks.worldId, worldId))
    .orderBy(desc(sql`${vectorChunks.embedding} <=> ${queryEmbedding}`))
    .limit(options.limit ?? 10);

  // 3. Deduplicate by entityId (take best chunk per entity)
  const deduplicated = deduplicateByEntity(results);

  // 4. Filter by minScore
  return deduplicated.filter((r) => r.score >= (options.minScore ?? 0.5));
}

function deduplicateByEntity(results: SearchResult[]): SearchResult[] {
  const byEntity = new Map<EntityId, SearchResult>();
  for (const result of results) {
    if (
      !byEntity.has(result.entityId) ||
      result.distance > byEntity.get(result.entityId)!.distance
    ) {
      byEntity.set(result.entityId, result);
    }
  }
  return Array.from(byEntity.values());
}
```

## Architecture: Full Flow

```
Entity created/updated
    ↓
chunkEntity() → VectorChunk[]
    ↓
embeddingService.embedChunks() → adds embeddings
    ↓
PostgreSQL pgvector stores
    ↓
[Later] User query
    ↓
embeddingService.embedText() → query vector
    ↓
pgvector distance search (cosine similarity)
    ↓
Deduplicate + rank by score
    ↓
Return to LLM for context
```

## Chunking Strategy Trade-offs

### Pros

- **Semantic understanding**: Captures meaning, not just keywords
- **Flexible search**: "wizard" finds entities about wizards, even if not in title
- **Context-aware**: Multiple chunks preserve different aspects of entity
- **Efficient**: Deduplicate by entity to avoid redundant retrieval

### Cons

- **Embedding cost**: Every entity change requires re-embedding all chunks
- **Storage overhead**: Multiple chunks per entity (estimate 5-10x entity count)
- **Latency**: Embedding API calls add 100-500ms per query
- **Model dependency**: Quality depends on embedding model choice

### Mitigation

- **Batch embedding**: Embed in batches of 50 on entity creation
- **Cache frequently searched**: LLM context often reused
- **Pruning old chunks**: Delete chunks for deleted entities
- **Quality tuning**: Monitor search relevance, adjust chunk size/splitting

## Embedding Model Choice for OpenRouter

### Option 1: sentence-transformers/all-MiniLM-L6-v2 (RECOMMENDED for MVP)

- **Dimensions**: 384
- **Cost**: FREE
- **Quality**: Good for semantic search
- **Speed**: Fast
- **Trade-off**: Smaller dimension = less precise but cheaper storage

### Option 2: thenlper/gte-large

- **Dimensions**: 1024
- **Cost**: Cheap (~$0.02 per 1M tokens)
- **Quality**: Better than MiniLM
- **Speed**: Slower than MiniLM

### Option 3: OpenAI's text-embedding-3-small via OpenRouter

- **Dimensions**: 1536
- **Cost**: ~$0.02 per 1M tokens
- **Quality**: Excellent
- **Speed**: Moderate

**MVP Recommendation**: Start with all-MiniLM-L6-v2 (free), upgrade later if needed

## Storage & Performance Estimates

For a 100-entity world with average 2KB body each:

```
Chunks per entity: 6-8 (header, summary, 3-5 body, 1-2 property)
Total chunks: 700 (100 entities × 7 avg)

Vector storage (384-dim, 4 bytes/float):
  700 chunks × 384 dims × 4 bytes = 1.1 MB (negligible)

Database overhead (with metadata):
  ~50 KB total (very small)

Typical query latency:
  Embedding query: 100-200ms
  pgvector search: 10-50ms
  Total: 110-250ms
```

Scales well to 10,000+ entities.

## Integration with MVP

### New Files

```
src/domain/intelligence/
├── vector-chunk.ts              # Domain model
└── vector-chunk.port.ts         # Port for chunk management

src/infrastructure/embedding/
├── openrouter-embedding.service.ts  # Embedding via OpenRouter
└── index.ts

src/infrastructure/database/schema/
├── vector-chunks.ts            # Drizzle schema
```

### Modified Files

```
src/infrastructure/database/repositories/
├── drizzle-entity.repository.ts (UPDATE)
  - Call vectorChunkService.updateChunks() on entity create/update/delete
```

### Use Case

```
src/application/entity/create-entity.ts (UPDATE)
  1. Create entity (existing)
  2. Generate chunks
  3. Embed chunks via OpenRouter
  4. Store chunks in pgvector
```

## Chunking Decisions for Resonance

| Aspect               | Decision                        | Reasoning                           |
| -------------------- | ------------------------------- | ----------------------------------- |
| **Chunk Types**      | header, summary, body, property | Multiple vectors = better coverage  |
| **Body Splitting**   | Markdown paragraphs             | Semantic boundaries                 |
| **Embedding Model**  | all-MiniLM-L6-v2 (free)         | Free MVP, upgrade path available    |
| **Deduplication**    | By entity, take best chunk      | Avoid entity duplication in results |
| **Vector Dimension** | 384 (from MiniLM)               | Balance precision vs storage        |
| **Min Similarity**   | 0.5 (cosine)                    | Empirically good for search         |
| **Chunk Batch Size** | 50                              | Balance API calls vs latency        |
| **Update Strategy**  | Regenerate all chunks on change | Simpler than delta updates          |
