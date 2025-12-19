/**
 * Test Data Loader
 *
 * Loads frontmatter markdown files from test-data/world/ into memory
 * for use by mock providers.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import {
  entityId,
  worldId,
  entityDefinitionId,
  relationshipId,
  relationshipDefinitionId,
  type EntityId,
  type WorldId,
  type EntityDefinitionId,
  type RelationshipId,
  type RelationshipDefinitionId,
} from '../backend/src/domain/shared/ids';

export type DataSource = 'homebrew' | 'lotr';
import type { IEntity } from '../backend/src/domain/world/entity';
import type { IRelationship } from '../backend/src/domain/world/relationship';
import type { EntitySummary } from '../backend/src/domain/world/entity-summary';

// Default world ID for test data
export const TEST_WORLD_ID = worldId('test-world-enym');
export const LOTR_WORLD_ID = worldId('lotr-middle-earth');

/**
 * Parsed entity from frontmatter markdown
 */
export interface TestEntity {
  id: EntityId;
  worldId: WorldId;
  definitionId: EntityDefinitionId;
  name: string;
  slug: string;
  summary: string | null;
  body: string;
  properties: Record<string, string>;
  relationships: Array<{ type: string; target: string }>;
  tags: string[];
}

/**
 * Parsed relationship from test data
 */
export interface TestRelationship {
  id: RelationshipId;
  worldId: WorldId;
  definitionId: RelationshipDefinitionId;
  sourceEntityId: EntityId;
  targetEntityId: EntityId;
  type: string;
}

/**
 * Test data store - singleton that holds all loaded test data
 */
export class TestDataStore {
  private static instance: TestDataStore | null = null;

  private entities = new Map<EntityId, TestEntity>();
  private relationships: TestRelationship[] = [];
  private entitiesByType = new Map<string, Set<EntityId>>();
  private entitiesByName = new Map<string, EntityId>();
  private relationshipsByEntity = new Map<EntityId, TestRelationship[]>();

  private constructor() {}

  static getInstance(): TestDataStore {
    if (!TestDataStore.instance) {
      TestDataStore.instance = new TestDataStore();
    }
    return TestDataStore.instance;
  }

  static reset(): void {
    TestDataStore.instance = null;
  }

  /**
   * Load test data from a directory containing entity type subdirectories
   */
  loadFromDirectory(baseDir: string, customWorldId?: WorldId): void {
    const entityTypes = ['characters', 'locations', 'organizations', 'artifacts', 'events'];
    const worldIdToUse = customWorldId || TEST_WORLD_ID;

    for (const entityType of entityTypes) {
      const typeDir = join(baseDir, entityType);
      if (!existsSync(typeDir)) continue;

      const files = readdirSync(typeDir).filter(f => f.endsWith('.md'));

      for (const file of files) {
        const filePath = join(typeDir, file);
        const entity = this.parseMarkdownFile(filePath, entityType, worldIdToUse);
        if (entity) {
          this.addEntity(entity);
        }
      }
    }

    // Build relationships from entity data
    this.buildRelationships();

    console.log(`Loaded ${this.entities.size} entities, ${this.relationships.length} relationships`);
  }

  private parseMarkdownFile(filePath: string, entityType: string, worldIdToUse: WorldId): TestEntity | null {
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!frontmatterMatch) return null;

      const frontmatter = this.parseYAML(frontmatterMatch[1]);
      const body = frontmatterMatch[2].trim();

      if (!frontmatter.id || !frontmatter.name) return null;

      // Map entity type (plural directory name) to definition ID
      // Strip trailing 's' to get singular form
      const singularType = entityType.endsWith('s') ? entityType.slice(0, -1) : entityType;
      const definitionIdMap: Record<string, string> = {
        character: 'def-character',
        location: 'def-location',
        organization: 'def-organization',
        artifact: 'def-artifact',
        event: 'def-event',
      };

      return {
        id: entityId(frontmatter.id),
        worldId: worldIdToUse,
        definitionId: entityDefinitionId(definitionIdMap[singularType] || `def-${singularType}`),
        name: frontmatter.name,
        slug: frontmatter.slug || frontmatter.id,
        summary: frontmatter.summary || null,
        body,
        properties: frontmatter.properties || {},
        relationships: frontmatter.relationships || [],
        tags: frontmatter.tags || [],
      };
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return null;
    }
  }

  private parseYAML(yaml: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const lines = yaml.split('\n');
    let currentKey = '';
    let currentArray: unknown[] | null = null;
    let currentObject: Record<string, unknown> | null = null;
    let inProperties = false;

    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;

      // Check for top-level key
      const keyMatch = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (keyMatch) {
        // Save previous array/object if any
        if (currentArray && currentKey) {
          result[currentKey] = currentArray;
        }
        if (currentObject && currentKey) {
          result[currentKey] = currentObject;
        }

        currentKey = keyMatch[1];
        const value = keyMatch[2].trim();

        if (value) {
          // Inline value
          result[currentKey] = this.parseValue(value);
          currentArray = null;
          currentObject = null;
          inProperties = false;
        } else {
          // Start of array or object
          currentArray = null;
          currentObject = null;
          inProperties = currentKey === 'properties';
        }
        continue;
      }

      // Check for array item
      const arrayItemMatch = line.match(/^\s+-\s*$/);
      if (arrayItemMatch) {
        if (!currentArray) currentArray = [];
        currentObject = {};
        continue;
      }

      // Check for array item with inline value
      const arrayInlineMatch = line.match(/^\s+-\s+(.+)$/);
      if (arrayInlineMatch) {
        if (!currentArray) currentArray = [];
        currentArray.push(this.parseValue(arrayInlineMatch[1]));
        continue;
      }

      // Check for nested key-value in object
      const nestedMatch = line.match(/^\s+([a-zA-Z_\s]+):\s*(.*)$/);
      if (nestedMatch) {
        const nestedKey = nestedMatch[1].trim();
        const nestedValue = nestedMatch[2].trim();

        if (currentObject) {
          currentObject[nestedKey] = this.parseValue(nestedValue);
        } else if (inProperties) {
          if (!result[currentKey]) result[currentKey] = {};
          (result[currentKey] as Record<string, unknown>)[nestedKey] = this.parseValue(nestedValue);
        }
        continue;
      }

      // Push completed object to array
      if (currentObject && Object.keys(currentObject).length > 0 && currentArray) {
        currentArray.push(currentObject);
        currentObject = {};
      }
    }

    // Save final array/object
    if (currentArray && currentKey) {
      if (currentObject && Object.keys(currentObject).length > 0) {
        currentArray.push(currentObject);
      }
      result[currentKey] = currentArray;
    }
    if (currentObject && currentKey && !currentArray) {
      result[currentKey] = currentObject;
    }

    return result;
  }

  private parseValue(value: string): string {
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  }

  private addEntity(entity: TestEntity): void {
    this.entities.set(entity.id, entity);
    this.entitiesByName.set(entity.name.toLowerCase(), entity.id);

    const type = entity.definitionId;
    if (!this.entitiesByType.has(type)) {
      this.entitiesByType.set(type, new Set());
    }
    this.entitiesByType.get(type)!.add(entity.id);
  }

  private buildRelationships(): void {
    let relIndex = 0;

    for (const entity of this.entities.values()) {
      for (const rel of entity.relationships) {
        // Try to resolve target
        const targetId = entityId(rel.target);
        const targetExists = this.entities.has(targetId);

        if (targetExists) {
          const relationship: TestRelationship = {
            id: relationshipId(`rel-${relIndex++}`),
            worldId: TEST_WORLD_ID,
            definitionId: relationshipDefinitionId(`reldef-${rel.type}`),
            sourceEntityId: entity.id,
            targetEntityId: targetId,
            type: rel.type,
          };

          this.relationships.push(relationship);

          // Index by source entity
          if (!this.relationshipsByEntity.has(entity.id)) {
            this.relationshipsByEntity.set(entity.id, []);
          }
          this.relationshipsByEntity.get(entity.id)!.push(relationship);

          // Index by target entity (for incoming relationships)
          if (!this.relationshipsByEntity.has(targetId)) {
            this.relationshipsByEntity.set(targetId, []);
          }
          this.relationshipsByEntity.get(targetId)!.push(relationship);
        }
      }
    }
  }

  // Query methods

  getEntity(id: EntityId): TestEntity | undefined {
    return this.entities.get(id);
  }

  getEntityByName(name: string): TestEntity | undefined {
    const id = this.entitiesByName.get(name.toLowerCase());
    return id ? this.entities.get(id) : undefined;
  }

  getAllEntities(): TestEntity[] {
    return Array.from(this.entities.values());
  }

  getEntitiesByType(definitionId: EntityDefinitionId): TestEntity[] {
    const ids = this.entitiesByType.get(definitionId);
    if (!ids) return [];
    return Array.from(ids).map(id => this.entities.get(id)!);
  }

  getRelationshipsForEntity(
    id: EntityId,
    direction: 'incoming' | 'outgoing' | 'both' = 'both'
  ): TestRelationship[] {
    const rels = this.relationshipsByEntity.get(id) || [];

    if (direction === 'both') return rels;
    if (direction === 'outgoing') return rels.filter(r => r.sourceEntityId === id);
    if (direction === 'incoming') return rels.filter(r => r.targetEntityId === id);

    return rels;
  }

  getAllRelationships(): TestRelationship[] {
    return this.relationships;
  }

  // Convert to domain model format

  toIEntity(entity: TestEntity): IEntity {
    return {
      id: entity.id,
      worldId: entity.worldId,
      definitionId: entity.definitionId,
      name: entity.name,
      slug: entity.slug,
      aliases: [],
      summary: entity.summary,
      body: entity.body,
      imageUrl: null,
      properties: [],
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  toEntitySummary(entity: TestEntity): EntitySummary {
    return {
      id: entity.id,
      name: entity.name,
      definitionId: entity.definitionId,
      summary: entity.summary,
    };
  }

  toIRelationship(rel: TestRelationship): IRelationship {
    return {
      id: rel.id,
      worldId: rel.worldId,
      definitionId: rel.definitionId,
      sourceEntityId: rel.sourceEntityId,
      targetEntityId: rel.targetEntityId,
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

/**
 * Initialize test data store from the default location
 */
export function initializeTestData(baseDir?: string): TestDataStore {
  const store = TestDataStore.getInstance();
  const testDataDir = baseDir || join(__dirname, '..', '..', '..', '..', '..', 'test-data', 'world');
  store.loadFromDirectory(testDataDir);
  return store;
}

/**
 * Initialize test data store with LotR data
 */
export function initializeLotrData(lotrDataDir?: string): TestDataStore {
  const store = TestDataStore.getInstance();
  // Default to the lotr-scraper output directory
  const dataDir = lotrDataDir || join(__dirname, '..', '..', '..', '..', '..', '..', 'lotr-scraper', 'output');
  store.loadFromDirectory(dataDir, LOTR_WORLD_ID);
  return store;
}

/**
 * Initialize test data store from a named data source
 */
export function initializeDataSource(source: DataSource): TestDataStore {
  TestDataStore.reset(); // Clear any existing data

  if (source === 'lotr') {
    return initializeLotrData();
  } else {
    return initializeTestData();
  }
}
