import type { QueryId, WorldId, UserId } from '../shared/ids';
import { createQueryId } from '../shared/ids';

/**
 * Query configuration options that affect how the LLM processes the query
 */
export interface QueryConfig {
  /** Maximum number of NeedsMoreInfo loops before forcing an answer (default: 3) */
  maxInfoRequests: number;
  /** Maximum number of entities to include in initial context */
  maxInitialEntities: number;
  /** Whether to include relationship data in context */
  includeRelationships: boolean;
  /** Temperature for LLM responses (0-1) */
  temperature: number;
}

/**
 * Default query configuration
 */
export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  maxInfoRequests: 3,
  maxInitialEntities: 10,
  includeRelationships: true,
  temperature: 0.7,
};

/**
 * Query status tracking
 */
export type QueryStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * IWorldQuery - Public interface for WorldQuery data
 * Represents a natural language query against a world's knowledge base
 */
export interface IWorldQuery {
  readonly id: QueryId;
  readonly worldId: WorldId;
  readonly userId: UserId;
  readonly queryText: string;
  readonly config: QueryConfig;
  readonly status: QueryStatus;
  readonly infoRequestCount: number;
  readonly createdAt: Date;
  readonly completedAt: Date | null;
}

/**
 * WorldQuery - Domain model for LLM queries against a world
 *
 * A WorldQuery captures the user's question and manages the query lifecycle,
 * including tracking how many times the LLM has requested additional information
 * (NeedsMoreInfo responses) to prevent infinite loops.
 */
export class WorldQuery implements IWorldQuery {
  private constructor(
    public readonly id: QueryId,
    public readonly worldId: WorldId,
    public readonly userId: UserId,
    public readonly queryText: string,
    private _config: QueryConfig,
    private _status: QueryStatus,
    private _infoRequestCount: number,
    public readonly createdAt: Date,
    private _completedAt: Date | null
  ) {}

  private static validateQueryText(text: string): string {
    const trimmedQuery = text.trim();
    if (trimmedQuery.length === 0) {
      throw new Error('Query text cannot be empty');
    }
    if (trimmedQuery.length > 10000) {
      throw new Error('Query text cannot exceed 10000 characters');
    }
    return trimmedQuery;
  }

  /**
   * Create a new WorldQuery
   * Generates ID and timestamp, validates business rules
   */
  static create(params: {
    worldId: WorldId;
    userId: UserId;
    queryText: string;
    config?: Partial<QueryConfig>;
  }): WorldQuery {
    const config: QueryConfig = {
      ...DEFAULT_QUERY_CONFIG,
      ...params.config,
    };

    return new WorldQuery(
      createQueryId(),
      params.worldId,
      params.userId,
      WorldQuery.validateQueryText(params.queryText),
      config,
      'pending',
      0,
      new Date(),
      null
    );
  }

  /**
   * Reconstitute an existing WorldQuery from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IWorldQuery): WorldQuery {
    return new WorldQuery(
      data.id,
      data.worldId,
      data.userId,
      WorldQuery.validateQueryText(data.queryText),
      { ...data.config },
      data.status,
      data.infoRequestCount,
      data.createdAt,
      data.completedAt
    );
  }

  // ==================== Getters ====================

  get config(): QueryConfig {
    return { ...this._config };
  }

  get status(): QueryStatus {
    return this._status;
  }

  get infoRequestCount(): number {
    return this._infoRequestCount;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  // ==================== Domain Behavior ====================

  /**
   * Mark query as processing
   */
  startProcessing(): void {
    if (this._status !== 'pending') {
      throw new Error(`Cannot start processing query in ${this._status} status`);
    }
    this._status = 'processing';
  }

  /**
   * Record that an info request was made (NeedsMoreInfo response from LLM)
   * Returns whether more info requests are allowed
   */
  recordInfoRequest(): boolean {
    this._infoRequestCount++;
    return this.canRequestMoreInfo();
  }

  /**
   * Check if more info requests are allowed
   */
  canRequestMoreInfo(): boolean {
    return this._infoRequestCount < this._config.maxInfoRequests;
  }

  /**
   * Mark query as completed successfully
   */
  complete(): void {
    if (this._status !== 'processing') {
      throw new Error(`Cannot complete query in ${this._status} status`);
    }
    this._status = 'completed';
    this._completedAt = new Date();
  }

  /**
   * Mark query as failed
   */
  fail(): void {
    if (this._status === 'completed') {
      throw new Error('Cannot fail an already completed query');
    }
    this._status = 'failed';
    this._completedAt = new Date();
  }

  /**
   * Get remaining info requests
   */
  remainingInfoRequests(): number {
    return Math.max(0, this._config.maxInfoRequests - this._infoRequestCount);
  }
}
