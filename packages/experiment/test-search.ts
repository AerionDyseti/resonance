#!/usr/bin/env bun
/**
 * Test the semantic search with LotR data
 */

import { join } from 'path';
import { initializeLotrData, LOTR_WORLD_ID } from './test-data-loader';
import { MockSemanticSearchProvider } from './mock-semantic-search.provider';

const lotrDataDir = join(import.meta.dir, '..', '..', '..', 'lotr-scraper', 'output');
const dataStore = initializeLotrData(lotrDataDir);

const searchProvider = new MockSemanticSearchProvider(dataStore);

console.log('\n=== Testing Semantic Search ===\n');

const testQueries = [
  'Frodo Baggins',
  'One Ring',
  'Battle of Five Armies',
  'Gandalf the Grey',
  'Moria',
];

for (const query of testQueries) {
  console.log(`Query: "${query}"`);
  const results = await searchProvider.search(LOTR_WORLD_ID, query, { limit: 3 });

  if (results.length === 0) {
    console.log('  ❌ No results found');
  } else {
    for (const result of results) {
      const entity = dataStore.getEntity(result.entityId);
      console.log(`  ✓ ${entity?.name} (score: ${result.score.toFixed(3)})`);
    }
  }
  console.log('');
}
