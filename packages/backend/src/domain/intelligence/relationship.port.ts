import type { WorldId, EntityId, RelationshipDefinitionId } from '../shared/ids';
import type { IEntity } from '../world/entity';
import type { IRelationship } from '../world/relationship';
import type { EntitySummary, RelationshipSummary } from './query-context';

/**
 * Direction filter for relationship queries
 */
export type RelationshipDirection = 'incoming' | 'outgoing' | 'both';

/**
 * Graph path between two entities
 */
export interface EntityPath {
  /** Entities in the path (in order) */
  entities: EntitySummary[];
  /** Relationships connecting them */
  relationships: RelationshipSummary[];
  /** Total path length (number of hops) */
  length: number;
}

/**
 * IRelationshipProvider - Port for entity relationship operations
 *
 * This port defines the contract for querying and traversing entity relationships.
 * Used to understand how entities are connected within a world.
 *
 * Implementation may use recursive CTEs in PostgreSQL or a graph database.
 * Example: PostgresRelationshipProvider, Neo4jRelationshipProvider
 */
export interface IRelationshipProvider {
  /**
   * Get all relationships for one or more entities
   *
   * @param entityIds - Entities to get relationships for
   * @param options - Query options
   */
  getRelationships(
    entityIds: EntityId[],
    options?: {
      /** Filter by direction (default: 'both') */
      direction?: RelationshipDirection;
      /** Filter by relationship type */
      definitionId?: RelationshipDefinitionId;
      /** Include the related entities (not just IDs) */
      includeEntities?: boolean;
      /** Maximum relationships per entity (default: 50) */
      limit?: number;
    }
  ): Promise<{
    relationships: IRelationship[];
    /** Related entities if includeEntities was true */
    relatedEntities?: IEntity[];
  }>;

  /**
   * Find entities connected to the given entity within N hops
   *
   * @param entityId - Starting entity
   * @param maxHops - Maximum traversal depth (default: 2)
   */
  getConnectedEntities(
    entityId: EntityId,
    options?: {
      maxHops?: number;
      /** Filter by relationship types */
      definitionIds?: RelationshipDefinitionId[];
      /** Maximum entities to return (default: 20) */
      limit?: number;
    }
  ): Promise<EntitySummary[]>;

  /**
   * Find the shortest path between two entities
   *
   * @param sourceId - Starting entity
   * @param targetId - Target entity
   * @param maxHops - Maximum path length to search (default: 5)
   */
  findPath(
    sourceId: EntityId,
    targetId: EntityId,
    options?: {
      maxHops?: number;
      /** Filter by relationship types */
      definitionIds?: RelationshipDefinitionId[];
    }
  ): Promise<EntityPath | null>;

  /**
   * Get entities that share relationships with the given entity
   * (Entities that have relationships to the same targets)
   *
   * @param entityId - Reference entity
   */
  findRelatedBySharedConnections(
    entityId: EntityId,
    options?: {
      /** Minimum shared connections (default: 1) */
      minShared?: number;
      limit?: number;
    }
  ): Promise<Array<{ entity: EntitySummary; sharedCount: number }>>;

  /**
   * Get relationship statistics for a world
   * Useful for understanding the knowledge graph structure
   */
  getRelationshipStats(worldId: WorldId): Promise<{
    totalRelationships: number;
    relationshipsByType: Array<{
      definitionId: RelationshipDefinitionId;
      definitionName: string;
      count: number;
    }>;
    mostConnectedEntities: Array<{
      entityId: EntityId;
      entityName: string;
      connectionCount: number;
    }>;
  }>;
}
