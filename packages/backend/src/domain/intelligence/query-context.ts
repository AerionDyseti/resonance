import type { EntityId, WorldId, EntityDefinitionId, RelationshipId } from '../shared/ids';
import type { IEntity } from '../world/entity';
import type { IRelationship } from '../world/relationship';
import type { IEntityDefinition } from '../meta/entity-definition';

/**
 * Entity summary for context - lighter weight than full IEntity
 * Used when we don't need all entity details
 */
export interface EntitySummary {
  id: EntityId;
  name: string;
  definitionId: EntityDefinitionId;
  summary: string | null;
}

/**
 * Relationship summary for context
 */
export interface RelationshipSummary {
  id: RelationshipId;
  sourceEntityId: EntityId;
  targetEntityId: EntityId;
  definitionName: string;
  description: string | null;
}

/**
 * Context statistics for logging and debugging
 */
export interface ContextStats {
  entityCount: number;
  expandedEntityCount: number;
  relationshipCount: number;
  totalTokenEstimate: number;
}

/**
 * QueryContext - Rich domain model for LLM context management
 *
 * Tracks all context data for a query including:
 * - Entities (full and summary)
 * - Relationships
 * - Which entities have been fully expanded
 * - Available entity definitions for the world
 *
 * Provides domain behavior for context manipulation:
 * - markExpanded(): Mark entities as fully expanded (all relationships loaded)
 * - merge(): Combine with additional context from InfoRequest fulfillment
 * - hasExpandableEntities(): Check if more context can be loaded
 */
export class QueryContext {
  private constructor(
    public readonly worldId: WorldId,
    private _entities: Map<EntityId, IEntity>,
    private _entitySummaries: Map<EntityId, EntitySummary>,
    private _relationships: Map<RelationshipId, IRelationship>,
    private _fullyExpandedEntityIds: Set<EntityId>,
    private _availableDefinitions: Map<EntityDefinitionId, IEntityDefinition>
  ) {}

  /**
   * Create an empty context for a world
   */
  static empty(worldId: WorldId): QueryContext {
    return new QueryContext(worldId, new Map(), new Map(), new Map(), new Set(), new Map());
  }

  /**
   * Create initial context with entities and relationships
   */
  static create(params: {
    worldId: WorldId;
    entities?: IEntity[];
    entitySummaries?: EntitySummary[];
    relationships?: IRelationship[];
    definitions?: IEntityDefinition[];
  }): QueryContext {
    const context = QueryContext.empty(params.worldId);

    if (params.entities) {
      for (const entity of params.entities) {
        context._entities.set(entity.id, entity);
      }
    }

    if (params.entitySummaries) {
      for (const summary of params.entitySummaries) {
        context._entitySummaries.set(summary.id, summary);
      }
    }

    if (params.relationships) {
      for (const rel of params.relationships) {
        context._relationships.set(rel.id, rel);
      }
    }

    if (params.definitions) {
      for (const def of params.definitions) {
        context._availableDefinitions.set(def.id, def);
      }
    }

    return context;
  }

  // ==================== Getters ====================

  /**
   * Get all full entities in context
   */
  get entities(): IEntity[] {
    return Array.from(this._entities.values());
  }

  /**
   * Get all entity summaries (excluding those with full entities)
   */
  get entitySummaries(): EntitySummary[] {
    return Array.from(this._entitySummaries.values()).filter((s) => !this._entities.has(s.id));
  }

  /**
   * Get all relationships
   */
  get relationships(): IRelationship[] {
    return Array.from(this._relationships.values());
  }

  /**
   * Get available entity definitions
   */
  get availableDefinitions(): IEntityDefinition[] {
    return Array.from(this._availableDefinitions.values());
  }

  /**
   * Get all entity IDs (full + summary)
   */
  get allEntityIds(): EntityId[] {
    const ids = new Set<EntityId>();
    for (const id of this._entities.keys()) ids.add(id);
    for (const id of this._entitySummaries.keys()) ids.add(id);
    return Array.from(ids);
  }

  /**
   * Get entity IDs that can be expanded (have summary but not full entity)
   */
  get expandableEntityIds(): EntityId[] {
    return Array.from(this._entitySummaries.keys()).filter(
      (id) => !this._entities.has(id) && !this._fullyExpandedEntityIds.has(id)
    );
  }

  // ==================== Domain Behavior ====================

  /**
   * Check if an entity exists in context (full or summary)
   */
  hasEntity(entityId: EntityId): boolean {
    return this._entities.has(entityId) || this._entitySummaries.has(entityId);
  }

  /**
   * Check if entity has full data (not just summary)
   */
  hasFullEntity(entityId: EntityId): boolean {
    return this._entities.has(entityId);
  }

  /**
   * Get entity by ID (full or summary form)
   */
  getEntity(entityId: EntityId): IEntity | EntitySummary | undefined {
    return this._entities.get(entityId) || this._entitySummaries.get(entityId);
  }

  /**
   * Check if there are entities that can be expanded for more detail
   */
  hasExpandableEntities(): boolean {
    return this.expandableEntityIds.length > 0;
  }

  /**
   * Mark an entity as fully expanded (all its relationships loaded)
   * O(1) operation using Set
   */
  markExpanded(entityId: EntityId): void {
    this._fullyExpandedEntityIds.add(entityId);
  }

  /**
   * Mark multiple entities as expanded
   */
  markExpandedMany(entityIds: EntityId[]): void {
    for (const id of entityIds) {
      this._fullyExpandedEntityIds.add(id);
    }
  }

  /**
   * Check if entity is fully expanded
   */
  isExpanded(entityId: EntityId): boolean {
    return this._fullyExpandedEntityIds.has(entityId);
  }

  /**
   * Add a full entity to context (replaces summary if exists)
   */
  addEntity(entity: IEntity): void {
    this._entities.set(entity.id, entity);
  }

  /**
   * Add multiple entities
   */
  addEntities(entities: IEntity[]): void {
    for (const entity of entities) {
      this._entities.set(entity.id, entity);
    }
  }

  /**
   * Add an entity summary
   */
  addEntitySummary(summary: EntitySummary): void {
    // Don't overwrite full entities with summaries
    if (!this._entities.has(summary.id)) {
      this._entitySummaries.set(summary.id, summary);
    }
  }

  /**
   * Add multiple entity summaries
   */
  addEntitySummaries(summaries: EntitySummary[]): void {
    for (const summary of summaries) {
      this.addEntitySummary(summary);
    }
  }

  /**
   * Add a relationship
   */
  addRelationship(relationship: IRelationship): void {
    this._relationships.set(relationship.id, relationship);
  }

  /**
   * Add multiple relationships
   */
  addRelationships(relationships: IRelationship[]): void {
    for (const rel of relationships) {
      this._relationships.set(rel.id, rel);
    }
  }

  /**
   * Add entity definitions
   */
  addDefinitions(definitions: IEntityDefinition[]): void {
    for (const def of definitions) {
      this._availableDefinitions.set(def.id, def);
    }
  }

  /**
   * Merge another context into this one
   * Used when fulfilling InfoRequests adds more data
   */
  merge(other: QueryContext): void {
    // Merge entities (other takes precedence for same ID)
    for (const [id, entity] of other._entities) {
      this._entities.set(id, entity);
    }

    // Merge summaries (don't overwrite full entities)
    for (const [id, summary] of other._entitySummaries) {
      if (!this._entities.has(id)) {
        this._entitySummaries.set(id, summary);
      }
    }

    // Merge relationships
    for (const [id, rel] of other._relationships) {
      this._relationships.set(id, rel);
    }

    // Merge expanded set
    for (const id of other._fullyExpandedEntityIds) {
      this._fullyExpandedEntityIds.add(id);
    }

    // Merge definitions
    for (const [id, def] of other._availableDefinitions) {
      this._availableDefinitions.set(id, def);
    }
  }

  /**
   * Get statistics about the context
   */
  getStats(): ContextStats {
    const entityCount = this._entities.size + this._entitySummaries.size;
    const expandedCount = this._fullyExpandedEntityIds.size;
    const relCount = this._relationships.size;

    // Rough token estimate (very approximate)
    let tokenEstimate = 0;
    for (const entity of this._entities.values()) {
      tokenEstimate += (entity.name.length + (entity.body?.length || 0)) / 4;
    }
    for (const summary of this._entitySummaries.values()) {
      tokenEstimate += (summary.name.length + (summary.summary?.length || 0)) / 4;
    }

    return {
      entityCount,
      expandedEntityCount: expandedCount,
      relationshipCount: relCount,
      totalTokenEstimate: Math.ceil(tokenEstimate),
    };
  }

  /**
   * Create a shallow copy of this context
   */
  clone(): QueryContext {
    return new QueryContext(
      this.worldId,
      new Map(this._entities),
      new Map(this._entitySummaries),
      new Map(this._relationships),
      new Set(this._fullyExpandedEntityIds),
      new Map(this._availableDefinitions)
    );
  }
}
