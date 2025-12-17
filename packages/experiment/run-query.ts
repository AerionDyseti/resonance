#!/usr/bin/env bun
/**
 * Interactive Intelligence Query Runner
 *
 * Run queries against your world data using the RAG system.
 *
 * Usage:
 *   bun run packages/experiment/run-query.ts "Your question here"
 *
 * Or run interactively:
 *   bun run packages/experiment/run-query.ts
 */

import { join } from 'path';
import { config } from 'dotenv';

// Load .env from experiment folder
config({ path: join(import.meta.dir, '.env') });

import { initializeTestData } from './test-data-loader';
import { createOrchestrator } from './intelligence-orchestrator';

async function main() {
  // Get query from command line or prompt
  let query = process.argv[2];

  if (!query) {
    console.log('Intelligence Query Runner');
    console.log('=========================\n');
    console.log('Usage: bun run packages/experiment/run-query.ts "Your question"');
    console.log('\nExample queries:');
    console.log('  "Tell me about Lady Jacqueline"');
    console.log('  "What is the Paladin\'s Guild?"');
    console.log('  "What locations are in Lux?"');
    console.log('  "Who are the members of the Council of Mages?"');
    console.log('  "What is the relationship between the Solaaran Empire and Lux?"');
    console.log('\nOr run with a query argument.');
    process.exit(0);
  }

  // Check for API key
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('Error: OPENROUTER_API_KEY not set.');
    console.error('Create a .env file in packages/experiment/ with your key:');
    console.error('  OPENROUTER_API_KEY=sk-or-v1-your-key-here');
    process.exit(1);
  }

  console.log('Loading test data...');
  const testDataDir = join(import.meta.dir, '..', '..', 'test-data', 'world');
  const dataStore = initializeTestData(testDataDir);

  console.log('Creating orchestrator...');
  const orchestrator = createOrchestrator(dataStore);

  console.log('\n' + '='.repeat(60));
  console.log(`Query: "${query}"`);
  console.log('='.repeat(60));

  try {
    const startTime = Date.now();
    const result = await orchestrator.query(query);
    const elapsed = Date.now() - startTime;

    console.log('\n' + '='.repeat(60));
    console.log('RESULT');
    console.log('='.repeat(60));
    console.log(`\nAnswer (${result.confidence} confidence):\n`);
    console.log(result.answer);

    if (result.sources.length > 0) {
      console.log('\nSources:');
      for (const source of result.sources) {
        console.log(`  - ${source.name} (${source.entityId}): ${source.contribution}`);
      }
    }

    console.log('\n---');
    console.log(`Iterations: ${result.iterations}`);
    console.log(`Total tokens: ${result.totalTokens}`);
    console.log(`Time: ${elapsed}ms`);
  } catch (error) {
    console.error('\nError:', error);
    process.exit(1);
  }
}

main();
