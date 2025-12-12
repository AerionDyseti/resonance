// Intelligence domain - LLM query system

// World Query Model
export type { IWorldQuery, QueryConfig, QueryStatus } from './world-query';
export { WorldQuery, DEFAULT_QUERY_CONFIG } from './world-query';

// Query Response Types
export type {
  Answer,
  NeedsMoreInfo,
  QueryResponse,
  ConfidenceLevel,
  AnswerSource,
} from './query-response';
export {
  isAnswer,
  isNeedsMoreInfo,
  createAnswer,
  createNeedsMoreInfo,
  createForcedAnswer,
} from './query-response';

// Info Capabilities
export type {
  InfoCapability,
  InfoRequest,
  InfoRequestResult,
  CapabilityParameter,
  CapabilityId,
  ParameterType,
  ParameterConstraints,
} from './info-capability';
export {
  createEntityIdParam,
  createEntityIdArrayParam,
  createStringParam,
  createEnumParam,
  createInfoRequest,
  validateInfoRequest,
} from './info-capability';

// Query Context
export type { EntitySummary, RelationshipSummary, ContextStats } from './query-context';
export { QueryContext } from './query-context';

// Capability Definitions
export {
  buildCapabilities,
  buildExpandEntityCapability,
  buildExpandEntitiesCapability,
  buildSearchEntitiesCapability,
  buildGetRelationshipsCapability,
  buildGetEntityByNameCapability,
  buildListEntityDefinitionsCapability,
  buildGetEntitiesByDefinitionCapability,
  getCapabilityById,
  formatCapabilitiesForPrompt,
} from './capabilities';

// Ports
export type { ISemanticSearchProvider, SemanticSearchResult } from './semantic-search.port';
export type { IRelationshipProvider, RelationshipDirection, EntityPath } from './relationship.port';
export type {
  IWorldIntelligenceProvider,
  QueryExecutionOptions,
  QueryProgressUpdate,
  QueryExecutionResult,
} from './world-intelligence.port';
