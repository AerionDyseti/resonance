/**
 * Mock Relationship Provider
 *
 * In-memory implementation for testing the intelligence system.
 * Traverses relationships loaded from test data.
 */

import type {
  IRelationshipProvider,
  RelationshipDirection,
  EntityPath,
} from '../backend/src/domain/intelligence/relationship.port';
import type {
  WorldId,
  EntityId,
  RelationshipDefinitionId,
} from '../backend/src/domain/shared/ids';
import type { IEntity } from '../backend/src/domain/world/entity';
import type { IRelationship } from '../backend/src/domain/world/relationship';
import type { EntitySummary, RelationshipSummary } from '../backend/src/domain/world';
import { TestDataStore } from './test-data-loader';

export class MockRelationshipProvider implements IRelationshipProvider {
  constructor(private readonly dataStore: TestDataStore) {}

  async getRelationships(
    entityIds: EntityId[],
    options?: {
      direction?: RelationshipDirection;
      definitionId?: RelationshipDefinitionId;
      includeEntities?: boolean;
      limit?: number;
    }
  ): Promise<{
    relationships: IRelationship[];
    relatedEntities?: IEntity[];
  }> {
    const direction = options?.direction ?? 'both';
    const limit = options?.limit ?? 50;

    const relationships: IRelationship[] = [];
    const relatedEntityIds = new Set<EntityId>();

    for (const entityId of entityIds) {
      const rels = this.dataStore.getRelationshipsForEntity(entityId, direction);

      for (const rel of rels) {
        // Filter by definition if specified
        if (options?.definitionId && rel.definitionId !== options.definitionId) {
          continue;
        }

        relationships.push(this.dataStore.toIRelationship(rel));

        // Track related entity IDs
        if (rel.sourceEntityId !== entityId) {
          relatedEntityIds.add(rel.sourceEntityId);
        }
        if (rel.targetEntityId !== entityId) {
          relatedEntityIds.add(rel.targetEntityId);
        }

        if (relationships.length >= limit) break;
      }

      if (relationships.length >= limit) break;
    }

    const result: { relationships: IRelationship[]; relatedEntities?: IEntity[] } = {
      relationships,
    };

    if (options?.includeEntities) {
      result.relatedEntities = Array.from(relatedEntityIds)
        .map(id => this.dataStore.getEntity(id))
        .filter((e): e is NonNullable<typeof e> => e !== undefined)
        .map(e => this.dataStore.toIEntity(e));
    }

    return result;
  }

  async getConnectedEntities(
    entityId: EntityId,
    options?: {
      maxHops?: number;
      definitionIds?: RelationshipDefinitionId[];
      limit?: number;
    }
  ): Promise<EntitySummary[]> {
    const maxHops = options?.maxHops ?? 2;
    const limit = options?.limit ?? 20;

    const visited = new Set<EntityId>();
    const result: EntitySummary[] = [];
    let currentLevel = new Set<EntityId>([entityId]);

    visited.add(entityId);

    for (let hop = 0; hop < maxHops && result.length < limit; hop++) {
      const nextLevel = new Set<EntityId>();

      for (const currentId of currentLevel) {
        const rels = this.dataStore.getRelationshipsForEntity(currentId, 'both');

        for (const rel of rels) {
          // Filter by definition IDs if specified
          if (options?.definitionIds && !options.definitionIds.includes(rel.definitionId)) {
            continue;
          }

          const connectedId = rel.sourceEntityId === currentId ? rel.targetEntityId : rel.sourceEntityId;

          if (!visited.has(connectedId)) {
            visited.add(connectedId);
            nextLevel.add(connectedId);

            const entity = this.dataStore.getEntity(connectedId);
            if (entity) {
              result.push(this.dataStore.toEntitySummary(entity));

              if (result.length >= limit) break;
            }
          }
        }

        if (result.length >= limit) break;
      }

      currentLevel = nextLevel;
    }

    return result;
  }

  async findPath(
    sourceId: EntityId,
    targetId: EntityId,
    options?: {
      maxHops?: number;
      definitionIds?: RelationshipDefinitionId[];
    }
  ): Promise<EntityPath | null> {
    const maxHops = options?.maxHops ?? 5;

    // BFS to find shortest path
    const visited = new Map<EntityId, { parent: EntityId | null; relationship: string | null }>();
    const queue: EntityId[] = [sourceId];
    visited.set(sourceId, { parent: null, relationship: null });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentDepth = this.getPathLength(visited, currentId);

      if (currentDepth >= maxHops) continue;

      if (currentId === targetId) {
        // Found path - reconstruct it
        return this.reconstructPath(visited, sourceId, targetId);
      }

      const rels = this.dataStore.getRelationshipsForEntity(currentId, 'both');

      for (const rel of rels) {
        // Filter by definition IDs if specified
        if (options?.definitionIds && !options.definitionIds.includes(rel.definitionId)) {
          continue;
        }

        const neighborId = rel.sourceEntityId === currentId ? rel.targetEntityId : rel.sourceEntityId;

        if (!visited.has(neighborId)) {
          visited.set(neighborId, { parent: currentId, relationship: rel.type });
          queue.push(neighborId);

          if (neighborId === targetId) {
            return this.reconstructPath(visited, sourceId, targetId);
          }
        }
      }
    }

    return null; // No path found
  }

  private getPathLength(
    visited: Map<EntityId, { parent: EntityId | null; relationship: string | null }>,
    entityId: EntityId
  ): number {
    let length = 0;
    let current: EntityId | null = entityId;

    while (current) {
      const info = visited.get(current);
      if (!info || !info.parent) break;
      current = info.parent;
      length++;
    }

    return length;
  }

  private reconstructPath(
    visited: Map<EntityId, { parent: EntityId | null; relationship: string | null }>,
    sourceId: EntityId,
    targetId: EntityId
  ): EntityPath {
    const entityIds: EntityId[] = [];
    const relationshipTypes: string[] = [];

    let current: EntityId | null = targetId;
    while (current) {
      entityIds.unshift(current);
      const info = visited.get(current);
      if (!info) break;
      if (info.relationship) relationshipTypes.unshift(info.relationship);
      current = info.parent;
    }

    const entities: EntitySummary[] = entityIds
      .map(id => this.dataStore.getEntity(id))
      .filter((e): e is NonNullable<typeof e> => e !== undefined)
      .map(e => this.dataStore.toEntitySummary(e));

    const relationships: RelationshipSummary[] = relationshipTypes.map((type, i) => ({
      id: `path-rel-${i}` as any,
      sourceEntityId: entityIds[i],
      targetEntityId: entityIds[i + 1],
      definitionName: type,
      description: null,
    }));

    return {
      entities,
      relationships,
      length: relationships.length,
    };
  }

  async findRelatedBySharedConnections(
    entityId: EntityId,
    options?: {
      minShared?: number;
      limit?: number;
    }
  ): Promise<Array<{ entity: EntitySummary; sharedCount: number }>> {
    const minShared = options?.minShared ?? 1;
    const limit = options?.limit ?? 10;

    // Get direct connections of the source entity
    const sourceRels = this.dataStore.getRelationshipsForEntity(entityId, 'both');
    const sourceConnections = new Set<EntityId>();

    for (const rel of sourceRels) {
      const connectedId = rel.sourceEntityId === entityId ? rel.targetEntityId : rel.sourceEntityId;
      sourceConnections.add(connectedId);
    }

    // Find entities that share connections
    const sharedCounts = new Map<EntityId, number>();

    for (const connectedId of sourceConnections) {
      const connectedRels = this.dataStore.getRelationshipsForEntity(connectedId, 'both');

      for (const rel of connectedRels) {
        const otherId = rel.sourceEntityId === connectedId ? rel.targetEntityId : rel.sourceEntityId;

        if (otherId !== entityId && !sourceConnections.has(otherId)) {
          sharedCounts.set(otherId, (sharedCounts.get(otherId) || 0) + 1);
        }
      }
    }

    // Filter and sort by shared count
    const results: Array<{ entity: EntitySummary; sharedCount: number }> = [];

    for (const [id, count] of sharedCounts) {
      if (count >= minShared) {
        const entity = this.dataStore.getEntity(id);
        if (entity) {
          results.push({
            entity: this.dataStore.toEntitySummary(entity),
            sharedCount: count,
          });
        }
      }
    }

    results.sort((a, b) => b.sharedCount - a.sharedCount);
    return results.slice(0, limit);
  }

  async getRelationshipStats(worldId: WorldId): Promise<{
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
  }> {
    const allRels = this.dataStore.getAllRelationships();

    // Count by type
    const typeCounts = new Map<string, number>();
    for (const rel of allRels) {
      const type = rel.type;
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    }

    // Count connections per entity
    const entityCounts = new Map<EntityId, number>();
    for (const rel of allRels) {
      entityCounts.set(rel.sourceEntityId, (entityCounts.get(rel.sourceEntityId) || 0) + 1);
      entityCounts.set(rel.targetEntityId, (entityCounts.get(rel.targetEntityId) || 0) + 1);
    }

    // Sort entities by connection count
    const sortedEntities = Array.from(entityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalRelationships: allRels.length,
      relationshipsByType: Array.from(typeCounts.entries()).map(([type, count]) => ({
        definitionId: `reldef-${type}` as RelationshipDefinitionId,
        definitionName: type,
        count,
      })),
      mostConnectedEntities: sortedEntities.map(([id, count]) => {
        const entity = this.dataStore.getEntity(id);
        return {
          entityId: id,
          entityName: entity?.name || 'Unknown',
          connectionCount: count,
        };
      }),
    };
  }
}
