import type { WorldId, EntityId } from '../shared/ids';

/**
 * Semantic search result with relevance score
 */
export interface SemanticSearchResult {
  entityId: EntityId;
  /** Relevance score (0-1, higher is more relevant) */
  score: number;
  /** Matched content snippet */
  matchedContent: string;
}

/**
 * ISemanticSearchProvider - Port for semantic similarity search operations
 *
 * This port defines the contract for finding semantically similar content.
 * The domain layer uses this for RAG (Retrieval Augmented Generation)
 * to find relevant entities based on meaning similarity.
 *
 * Implementation may use vector embeddings, BM25, or other algorithms.
 * Example: VectorSemanticSearchProvider (pgvector), BM25SemanticSearchProvider
 */
export interface ISemanticSearchProvider {
  /**
   * Search for entities semantically similar to the query
   *
   * @param worldId - Scope search to this world
   * @param query - Natural language query text
   * @param options - Search options
   * @returns Ranked list of matching entities with scores
   */
  search(
    worldId: WorldId,
    query: string,
    options?: {
      /** Maximum results to return (default: 10) */
      limit?: number;
      /** Minimum similarity score threshold (0-1, default: 0.5) */
      minScore?: number;
      /** Exclude these entity IDs from results */
      excludeEntityIds?: EntityId[];
    }
  ): Promise<SemanticSearchResult[]>;

  /**
   * Find entities similar to a given entity
   * Useful for "related entities" features
   *
   * @param entityId - Find entities similar to this one
   * @param options - Search options
   */
  findSimilar(
    entityId: EntityId,
    options?: {
      limit?: number;
      minScore?: number;
      /** Restrict to same world (default: true) */
      sameWorld?: boolean;
    }
  ): Promise<SemanticSearchResult[]>;

  /**
   * Search within specific entity fields
   * More targeted than general search
   *
   * @param worldId - Scope search to this world
   * @param query - Search query
   * @param fields - Which fields to search (name, body, summary, properties)
   */
  searchFields(
    worldId: WorldId,
    query: string,
    fields: ('name' | 'body' | 'summary' | 'properties')[],
    options?: {
      limit?: number;
      minScore?: number;
    }
  ): Promise<SemanticSearchResult[]>;
}
