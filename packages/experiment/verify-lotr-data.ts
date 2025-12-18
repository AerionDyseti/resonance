#!/usr/bin/env bun
/**
 * Verify LotR data loading
 */

import { join } from 'path';
import { initializeLotrData } from './test-data-loader';

const lotrDataDir = join(import.meta.dir, '..', '..', '..', 'lotr-scraper', 'output');
const dataStore = initializeLotrData(lotrDataDir);

console.log('\n=== LotR Data Verification ===\n');

// Get all entities
const allEntities = dataStore.getAllEntities();
console.log(`Total entities: ${allEntities.length}`);

// Count by type
const byType: Record<string, number> = {};
for (const entity of allEntities) {
  const type = entity.definitionId;
  byType[type] = (byType[type] || 0) + 1;
}
console.log('\nBy type:');
for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

// Sample some key entities
console.log('\n=== Sample Key Entities ===\n');
const sampleNames = [
  'Frodo Baggins',
  'Gandalf',
  'One Ring',
  'Battle of Five Armies',
  'Moria',
  'Nazgûl',
  'Palantíri',
];

for (const name of sampleNames) {
  const entity = dataStore.getEntityByName(name);
  if (entity) {
    console.log(`✓ ${name}`);
    console.log(`  ID: ${entity.id}`);
    console.log(`  Type: ${entity.definitionId}`);
    console.log(`  Summary: ${entity.summary?.slice(0, 100)}...`);
    console.log('');
  } else {
    console.log(`✗ ${name} - NOT FOUND`);
  }
}

// Check relationships
const relationships = dataStore.getAllRelationships();
console.log(`\n=== Relationships ===`);
console.log(`Total: ${relationships.length}`);

if (relationships.length > 0) {
  console.log('\nSample relationships:');
  for (const rel of relationships.slice(0, 5)) {
    const source = dataStore.getEntity(rel.sourceEntityId);
    const target = dataStore.getEntity(rel.targetEntityId);
    console.log(`  ${source?.name || rel.sourceEntityId} --[${rel.type}]--> ${target?.name || rel.targetEntityId}`);
  }
}
