/**
 * Intelligence Experiment
 *
 * Mock implementations and orchestration for testing the Intelligence system.
 */

// Test data
export {
  TestDataStore,
  initializeTestData,
  initializeLotrData,
  initializeDataSource,
  TEST_WORLD_ID,
  LOTR_WORLD_ID,
} from './test-data-loader';
export type { TestEntity, TestRelationship, DataSource } from './test-data-loader';

// Mock providers
export { MockSemanticSearchProvider } from './mock-semantic-search.provider';
export { MockRelationshipProvider } from './mock-relationship.provider';

// LLM client
export { OpenRouterClient, createOpenRouterClient } from './openrouter-client';
export type { ChatMessage, ChatCompletionOptions, ChatCompletionResponse } from './openrouter-client';

// Intelligence orchestrator
export { IntelligenceOrchestrator, createOrchestrator } from './intelligence-orchestrator';
export type { QueryResult, InfoRequest } from './intelligence-orchestrator';
