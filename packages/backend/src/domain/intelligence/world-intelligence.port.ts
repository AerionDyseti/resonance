import type { WorldId, UserId, QueryId } from '../shared/ids';
import type { WorldQuery, QueryConfig } from './world-query';
import type { QueryResponse, Answer } from './query-response';
import type { QueryContext } from './query-context';
import type { InfoCapability } from './info-capability';

/**
 * Query execution options
 */
export interface QueryExecutionOptions {
  /** Override default query config */
  config?: Partial<QueryConfig>;
  /** Pre-built initial context (skip context building) */
  initialContext?: QueryContext;
  /** Callback for progress updates */
  onProgress?: (update: QueryProgressUpdate) => void;
}

/**
 * Progress update during query execution
 */
export interface QueryProgressUpdate {
  /** Current stage of execution */
  stage: 'building_context' | 'querying_llm' | 'fulfilling_info_request' | 'completed' | 'failed';
  /** Human-readable message */
  message: string;
  /** Current info request iteration (0 = initial, 1+ = after NeedsMoreInfo) */
  iteration: number;
  /** Timestamp */
  timestamp: Date;
}

/**
 * Full result of a query execution
 */
export interface QueryExecutionResult {
  /** The query that was executed */
  query: WorldQuery;
  /** The final answer */
  answer: Answer;
  /** Final context that was used */
  context: QueryContext;
  /** Number of info request iterations */
  iterations: number;
  /** Total execution time in ms */
  executionTimeMs: number;
}

/**
 * IWorldIntelligenceProvider - Port for LLM-powered world queries
 *
 * This is the main port for the World Intelligence system.
 * It orchestrates:
 * 1. Building initial context from the query
 * 2. Sending context + query to the LLM
 * 3. Handling NeedsMoreInfo responses (up to max iterations)
 * 4. Returning the final answer
 *
 * The implementation will use an LLM provider (Claude, GPT, etc.)
 * and coordinate with ISemanticSearchProvider and IGraphQueryProvider.
 * Example: ClaudeWorldIntelligenceProvider, OpenAIWorldIntelligenceProvider
 */
export interface IWorldIntelligenceProvider {
  /**
   * Execute a natural language query against a world
   *
   * This is the main entry point. It:
   * 1. Creates a WorldQuery to track the request
   * 2. Builds initial context using RAG
   * 3. Queries the LLM with context
   * 4. Handles NeedsMoreInfo loops (max 3 by default)
   * 5. Returns the final answer
   *
   * @param worldId - The world to query
   * @param userId - The user making the query
   * @param queryText - Natural language question
   * @param options - Execution options
   */
  executeQuery(
    worldId: WorldId,
    userId: UserId,
    queryText: string,
    options?: QueryExecutionOptions
  ): Promise<QueryExecutionResult>;

  /**
   * Get available capabilities for a given context
   * Used to inform the LLM what actions it can request
   */
  getAvailableCapabilities(context: QueryContext): InfoCapability[];

  /**
   * Build initial context for a query
   * Uses vector search and basic graph queries to gather relevant entities
   *
   * @param worldId - The world to query
   * @param queryText - The user's question (used for semantic search)
   * @param config - Query configuration
   */
  buildInitialContext(
    worldId: WorldId,
    queryText: string,
    config: QueryConfig
  ): Promise<QueryContext>;

  /**
   * Send a single query to the LLM with the given context
   * Returns either an Answer or NeedsMoreInfo
   *
   * This is a lower-level method - prefer executeQuery for full orchestration
   */
  queryLlm(
    query: WorldQuery,
    context: QueryContext,
    capabilities: InfoCapability[],
    forceAnswer?: boolean
  ): Promise<QueryResponse>;

  /**
   * Retrieve a previous query execution by ID
   */
  getQueryById(queryId: QueryId): Promise<WorldQuery | null>;

  /**
   * Get recent queries for a user in a world
   */
  getRecentQueries(
    worldId: WorldId,
    userId: UserId,
    options?: { limit?: number }
  ): Promise<WorldQuery[]>;
}
