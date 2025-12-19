/**
 * Mock Semantic Search Provider
 *
 * Simple text-matching implementation for testing the intelligence system.
 * Uses basic string matching and scoring - not actual vector embeddings.
 */

import type {
  ISemanticSearchProvider,
  SemanticSearchResult,
} from '../backend/src/domain/intelligence/semantic-search.port';
import type { WorldId, EntityId } from '../backend/src/domain/shared/ids';
import { TestDataStore, type TestEntity } from './test-data-loader';

export class MockSemanticSearchProvider implements ISemanticSearchProvider {
  constructor(private readonly dataStore: TestDataStore) {}

  async search(
    worldId: WorldId,
    query: string,
    options?: {
      limit?: number;
      minScore?: number;
      excludeEntityIds?: EntityId[];
    }
  ): Promise<SemanticSearchResult[]> {
    const limit = options?.limit ?? 10;
    const minScore = options?.minScore ?? 0.1;
    const excludeIds = new Set(options?.excludeEntityIds ?? []);

    const entities = this.dataStore.getAllEntities();
    const results: Array<SemanticSearchResult & { entity: TestEntity }> = [];

    const queryTerms = this.tokenize(query.toLowerCase());

    for (const entity of entities) {
      if (excludeIds.has(entity.id)) continue;
      if (entity.worldId !== worldId) continue;

      const { score, matchedContent } = this.scoreEntity(entity, queryTerms);

      if (score >= minScore) {
        results.push({
          entityId: entity.id,
          score,
          matchedContent,
          entity,
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit).map(({ entityId, score, matchedContent }) => ({
      entityId,
      score,
      matchedContent,
    }));
  }

  async findSimilar(
    entityId: EntityId,
    options?: {
      limit?: number;
      minScore?: number;
      sameWorld?: boolean;
    }
  ): Promise<SemanticSearchResult[]> {
    const limit = options?.limit ?? 10;
    const minScore = options?.minScore ?? 0.1;

    const sourceEntity = this.dataStore.getEntity(entityId);
    if (!sourceEntity) return [];

    // Use entity name, summary, and body as the "query"
    const queryText = [sourceEntity.name, sourceEntity.summary || '', sourceEntity.body]
      .join(' ')
      .substring(0, 500);

    const results = await this.search(sourceEntity.worldId, queryText, {
      limit: limit + 1, // +1 to account for self
      minScore,
      excludeEntityIds: [entityId],
    });

    return results.slice(0, limit);
  }

  async searchFields(
    worldId: WorldId,
    query: string,
    fields: ('name' | 'body' | 'summary' | 'properties')[],
    options?: {
      limit?: number;
      minScore?: number;
    }
  ): Promise<SemanticSearchResult[]> {
    const limit = options?.limit ?? 10;
    const minScore = options?.minScore ?? 0.1;

    const entities = this.dataStore.getAllEntities();
    const results: SemanticSearchResult[] = [];

    const queryTerms = this.tokenize(query.toLowerCase());

    for (const entity of entities) {
      if (entity.worldId !== worldId) continue;

      const { score, matchedContent } = this.scoreEntityFields(entity, queryTerms, fields);

      if (score >= minScore) {
        results.push({
          entityId: entity.id,
          score,
          matchedContent,
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  private scoreEntity(
    entity: TestEntity,
    queryTerms: string[]
  ): { score: number; matchedContent: string } {
    const searchableText = [
      entity.name,
      entity.summary || '',
      entity.body,
      ...Object.values(entity.properties),
    ]
      .join(' ')
      .toLowerCase();

    return this.calculateScore(searchableText, queryTerms, entity.name);
  }

  private scoreEntityFields(
    entity: TestEntity,
    queryTerms: string[],
    fields: ('name' | 'body' | 'summary' | 'properties')[]
  ): { score: number; matchedContent: string } {
    const parts: string[] = [];

    if (fields.includes('name')) parts.push(entity.name);
    if (fields.includes('summary') && entity.summary) parts.push(entity.summary);
    if (fields.includes('body')) parts.push(entity.body);
    if (fields.includes('properties')) parts.push(...Object.values(entity.properties));

    const searchableText = parts.join(' ').toLowerCase();
    return this.calculateScore(searchableText, queryTerms, entity.name);
  }

  private calculateScore(
    searchableText: string,
    queryTerms: string[],
    entityName: string
  ): { score: number; matchedContent: string } {
    if (queryTerms.length === 0) {
      return { score: 0, matchedContent: '' };
    }

    let matchedTerms = 0;
    let totalWeight = 0;
    let matchedContent = '';

    const nameLower = entityName.toLowerCase();
    const searchableTokens = new Set(this.tokenize(searchableText));

    for (const term of queryTerms) {
      // Exact name match - highest weight
      if (nameLower === term || nameLower.includes(term)) {
        matchedTerms += 3;
        totalWeight += 3;
        matchedContent = entityName;
        continue;
      }

      // Check for term in searchable text
      if (searchableTokens.has(term) || searchableText.includes(term)) {
        matchedTerms += 1;
        totalWeight += 1;

        // Extract snippet around the match
        if (!matchedContent) {
          const idx = searchableText.indexOf(term);
          if (idx !== -1) {
            const start = Math.max(0, idx - 50);
            const end = Math.min(searchableText.length, idx + term.length + 50);
            matchedContent = searchableText.substring(start, end).trim();
          }
        }
      }
    }

    // Normalize score to 0-1 range
    const maxPossibleWeight = queryTerms.length * 3; // Assuming all could be name matches
    const score = totalWeight / maxPossibleWeight;

    return {
      score: Math.min(1, score),
      matchedContent: matchedContent || entityName,
    };
  }
}
