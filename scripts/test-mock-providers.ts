#!/usr/bin/env bun
/**
 * Test script for mock providers
 *
 * Verifies that the test data loader and mock providers work correctly.
 */

import { join } from 'path';
import {
  initializeTestData,
  TEST_WORLD_ID,
  MockSemanticSearchProvider,
  MockRelationshipProvider,
} from '../packages/backend/src/infrastructure/testing';
import { entityId } from '../packages/backend/src/domain/shared/ids';

async function main() {
  console.log('Testing Mock Providers');
  console.log('======================\n');

  // Initialize test data
  const testDataDir = join(import.meta.dir, '..', 'test-data', 'world');
  console.log(`Loading test data from: ${testDataDir}`);
  const dataStore = initializeTestData(testDataDir);

  // Create mock providers
  const searchProvider = new MockSemanticSearchProvider(dataStore);
  const relationshipProvider = new MockRelationshipProvider(dataStore);

  // Test 1: Semantic Search
  console.log('\n--- Test 1: Semantic Search ---');
  console.log('Query: "paladin guild leader"');

  const searchResults = await searchProvider.search(TEST_WORLD_ID, 'paladin guild leader', {
    limit: 5,
  });

  console.log(`Found ${searchResults.length} results:`);
  for (const result of searchResults) {
    const entity = dataStore.getEntity(result.entityId);
    console.log(`  - ${entity?.name} (score: ${result.score.toFixed(3)})`);
  }

  // Test 2: Search for a location
  console.log('\n--- Test 2: Location Search ---');
  console.log('Query: "capital city empire"');

  const locationResults = await searchProvider.search(TEST_WORLD_ID, 'capital city empire', {
    limit: 5,
  });

  console.log(`Found ${locationResults.length} results:`);
  for (const result of locationResults) {
    const entity = dataStore.getEntity(result.entityId);
    console.log(`  - ${entity?.name} (score: ${result.score.toFixed(3)})`);
  }

  // Test 3: Get relationships for an entity
  console.log('\n--- Test 3: Relationships ---');
  const ladyJacquelineId = entityId('char-lady-jacqueline');
  const entity = dataStore.getEntity(ladyJacquelineId);

  if (entity) {
    console.log(`Getting relationships for: ${entity.name}`);

    const { relationships, relatedEntities } = await relationshipProvider.getRelationships(
      [ladyJacquelineId],
      { includeEntities: true, limit: 10 }
    );

    console.log(`Found ${relationships.length} relationships:`);
    for (const rel of relationships) {
      const sourceEntity = dataStore.getEntity(rel.sourceEntityId);
      const targetEntity = dataStore.getEntity(rel.targetEntityId);
      const testRel = dataStore.getRelationshipsForEntity(rel.sourceEntityId, 'both')
        .find(r => r.id === rel.id);
      console.log(`  - ${sourceEntity?.name} --[${testRel?.type}]--> ${targetEntity?.name}`);
    }
  }

  // Test 4: Get connected entities
  console.log('\n--- Test 4: Connected Entities ---');
  const luxId = entityId('loc-lux');
  const luxEntity = dataStore.getEntity(luxId);

  if (luxEntity) {
    console.log(`Getting connected entities for: ${luxEntity.name} (2 hops)`);

    const connected = await relationshipProvider.getConnectedEntities(luxId, {
      maxHops: 2,
      limit: 10,
    });

    console.log(`Found ${connected.length} connected entities:`);
    for (const entity of connected) {
      console.log(`  - ${entity.name}`);
    }
  }

  // Test 5: Relationship stats
  console.log('\n--- Test 5: Relationship Stats ---');
  const stats = await relationshipProvider.getRelationshipStats(TEST_WORLD_ID);

  console.log(`Total relationships: ${stats.totalRelationships}`);
  console.log('Relationships by type:');
  for (const type of stats.relationshipsByType.slice(0, 5)) {
    console.log(`  - ${type.definitionName}: ${type.count}`);
  }
  console.log('Most connected entities:');
  for (const entity of stats.mostConnectedEntities.slice(0, 5)) {
    console.log(`  - ${entity.entityName}: ${entity.connectionCount} connections`);
  }

  // Test 6: Find path between entities
  console.log('\n--- Test 6: Find Path ---');
  const paladinsGuildId = entityId('org-paladins-guild');

  if (entity && dataStore.getEntity(paladinsGuildId)) {
    console.log(`Finding path: Lady Jacqueline -> Paladin's Guild`);

    const path = await relationshipProvider.findPath(ladyJacquelineId, paladinsGuildId);

    if (path) {
      console.log(`Found path with ${path.length} hop(s):`);
      for (let i = 0; i < path.entities.length; i++) {
        console.log(`  ${i + 1}. ${path.entities[i].name}`);
        if (i < path.relationships.length) {
          console.log(`     --[${path.relationships[i].definitionName}]-->`);
        }
      }
    } else {
      console.log('No path found');
    }
  }

  console.log('\n=== All tests completed ===');
}

main().catch(console.error);
