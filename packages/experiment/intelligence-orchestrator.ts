/**
 * Intelligence Orchestrator
 *
 * The core RAG loop for querying the world using LLM:
 * 1. User query comes in
 * 2. Semantic search to build initial context
 * 3. Format context + capabilities for LLM
 * 4. LLM returns Answer or NeedsMoreInfo
 * 5. If NeedsMoreInfo, fulfill requests and loop
 * 6. Return final answer
 */

import { OpenRouterClient, type ChatMessage } from './openrouter-client';
import {
  TestDataStore,
  MockSemanticSearchProvider,
  MockRelationshipProvider,
  TEST_WORLD_ID,
  LOTR_WORLD_ID,
} from './index';
import type { WorldId } from '../backend/src/domain/shared/ids';
import type { EntityId } from '../backend/src/domain/shared/ids';
import { entityId } from '../backend/src/domain/shared/ids';
import type { TestEntity } from './test-data-loader';
import { logContextExpansion } from './file-logger';

// ==================== Types ====================

export interface QueryResult {
  answer: string;
  confidence: 'high' | 'medium' | 'low';
  sources: Array<{ entityId: string; name: string; contribution: string }>;
  iterations: number;
  totalTokens: number;
}

export interface InfoRequest {
  capability: string;
  params: Record<string, unknown>;
  reason: string;
}

interface LLMResponse {
  type: 'answer' | 'needs_more_info';
  // For answers
  answer?: string;
  confidence?: 'high' | 'medium' | 'low';
  sources?: Array<{ entityId: string; contribution: string }>;
  // For needs_more_info
  reason?: string;
  requests?: InfoRequest[];
}

// ==================== System Prompt ====================

const SYSTEM_PROMPT = `You are an intelligent assistant that answers questions about a fictional world. You have access to a knowledge base of entities (characters, locations, organizations, artifacts, events) and their relationships.

## CRITICAL RULE: No Prior Knowledge
Pretend you know NOTHING about this world except what is shown in the "Current Context" section. Even if this world seems familiar, you must act as if you're encountering it for the first time. Your only source of facts is the provided context.

If the context is empty, you MUST use capabilities to search for information before answering.

## Your Task
Answer questions using the provided context. You ARE encouraged to:
- Make logical inferences from the context (e.g., if A is B's father and B is C's father, you can infer A is C's grandfather)
- Draw connections between entities in the context
- Extrapolate reasonable conclusions from stated facts
- Synthesize information from multiple entities
- Use common tropes, themes, and conventions from similar genres (fantasy, sci-fi, etc.) to inform your extrapolations when the context suggests them

You must NOT:
- State specific facts about THIS world that aren't in or inferable from the context
- Use prior knowledge about specific characters, places, or events from this world

## Response Format
Respond with valid JSON in one of these formats:

### When you can answer (fully or partially):
\`\`\`json
{
  "type": "answer",
  "answer": "Your detailed answer here...",
  "confidence": "high|medium|low",
  "sources": [
    { "entityId": "entity-id", "contribution": "What this entity contributed" }
  ]
}
\`\`\`

### When you need more information:
\`\`\`json
{
  "type": "needs_more_info",
  "reason": "What you need and why",
  "requests": [
    {
      "capability": "CAPABILITY_ID",
      "params": { "param1": "value1" },
      "reason": "Why you need this"
    }
  ]
}
\`\`\`

## Confidence Levels
- **high**: Answer is directly stated in the context
- **medium**: Answer requires inference or connecting multiple facts from context
- **low**: Partial answer - you found relevant info but it's incomplete

## Guidelines
- If context is empty or completely irrelevant, request more info first
- If you have SOME relevant information, give a partial answer with low/medium confidence
- A partial answer that explains what you found is ALWAYS better than "I couldn't find anything"
- When giving partial answers, explain what you DID find and what's missing
- Try SEARCH_ENTITIES with different terms if initial results are thin
- Cite sources with entity IDs for claims you make
- Make at most 3 info requests at a time
- Entities listed in context already have their FULL content included - don't re-request them`;

// ==================== Orchestrator ====================

export class IntelligenceOrchestrator {
  private llmClient: OpenRouterClient;
  private searchProvider: MockSemanticSearchProvider;
  private relationshipProvider: MockRelationshipProvider;
  private dataStore: TestDataStore;
  private worldId: WorldId;
  private maxIterations: number;

  constructor(params: {
    llmClient: OpenRouterClient;
    dataStore: TestDataStore;
    worldId?: WorldId;
    maxIterations?: number;
  }) {
    this.llmClient = params.llmClient;
    this.dataStore = params.dataStore;
    this.worldId = params.worldId ?? this.detectWorldId(params.dataStore);
    this.searchProvider = new MockSemanticSearchProvider(params.dataStore);
    this.relationshipProvider = new MockRelationshipProvider(params.dataStore);
    this.maxIterations = params.maxIterations ?? 3;
  }

  /**
   * Detect the world ID from loaded data
   */
  private detectWorldId(dataStore: TestDataStore): WorldId {
    const entities = dataStore.getAllEntities();
    if (entities.length > 0) {
      return entities[0].worldId;
    }
    return TEST_WORLD_ID;
  }

  async query(userQuery: string): Promise<QueryResult> {
    console.log(`\n[Query] "${userQuery}"`);

    // Build initial context via semantic search
    let context = await this.buildInitialContext(userQuery);
    let iterations = 0;
    let totalTokens = 0;

    while (iterations < this.maxIterations) {
      iterations++;
      console.log(`\n[Iteration ${iterations}]`);

      // Format context for LLM
      const contextText = this.formatContext(context);
      const capabilitiesText = this.formatCapabilities(context);

      // Build messages
      const messages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `## Current Context\n${contextText}\n\n## Available Capabilities\n${capabilitiesText}\n\n## User Question\n${userQuery}`,
        },
      ];

      // Call LLM
      console.log('[Calling LLM...]');
      const response = await this.llmClient.chat(messages, { temperature: 0.7 });
      totalTokens += response.usage.totalTokens;
      console.log(`[Tokens: ${response.usage.totalTokens}]`);

      // Parse response
      const parsed = this.parseResponse(response.content);

      if (parsed.type === 'answer') {
        console.log(`[Got answer with ${parsed.confidence} confidence]`);

        // Resolve source names
        const sources = (parsed.sources || []).map((s) => {
          const entity = this.dataStore.getEntity(entityId(s.entityId));
          return {
            entityId: s.entityId,
            name: entity?.name || 'Unknown',
            contribution: s.contribution,
          };
        });

        return {
          answer: parsed.answer || 'No answer provided',
          confidence: parsed.confidence || 'low',
          sources,
          iterations,
          totalTokens,
        };
      }

      // Handle needs_more_info
      if (parsed.type === 'needs_more_info' && parsed.requests) {
        console.log(`[Needs more info: ${parsed.reason}]`);
        console.log(`[Fulfilling ${parsed.requests.length} request(s)...]`);

        // Fulfill requests and expand context
        for (const request of parsed.requests) {
          const newEntities = await this.fulfillRequest(request, context);
          const addedEntities: TestEntity[] = [];

          // Add new entities to context
          for (const entity of newEntities) {
            if (!context.entities.has(entity.id)) {
              context.entities.set(entity.id, entity);
              addedEntities.push(entity);
            }
          }

          // Log context expansion
          if (addedEntities.length > 0) {
            const entityNames = addedEntities.map((e) => e.name).join(', ');
            console.log(`    Added: ${entityNames}`);
            logContextExpansion(iterations, request.capability, request.params, addedEntities.length);
          } else {
            console.log(`    No new entities added`);
          }
        }
      }
    }

    // Max iterations reached - force an answer
    console.log('[Max iterations reached, forcing answer]');
    return {
      answer: 'I was unable to find enough information to fully answer your question.',
      confidence: 'low',
      sources: [],
      iterations,
      totalTokens,
    };
  }

  private async buildInitialContext(query: string): Promise<ContextMap> {
    console.log('[Building initial context...]');

    const searchResults = await this.searchProvider.search(this.worldId, query, { limit: 5 });

    const context: ContextMap = {
      entities: new Map(),
      relationships: new Map(),
    };

    for (const result of searchResults) {
      const entity = this.dataStore.getEntity(result.entityId);
      if (entity) {
        context.entities.set(entity.id, entity);
      }
    }

    const entityCount = context.entities.size;
    if (entityCount > 0) {
      const entityNames = Array.from(context.entities.values())
        .map((e) => e.name)
        .join(', ');
      console.log(`[Initial context: ${entityNames}]`);
      logContextExpansion(0, 'SEARCH_ENTITIES', { query, limit: 5 }, entityCount);
    } else {
      console.log(`[No initial entities found]`);
    }

    return context;
  }

  private formatContext(context: ContextMap): string {
    const lines: string[] = [];

    if (context.entities.size === 0) {
      return 'No entities in context yet. Use capabilities to find relevant information.';
    }

    lines.push(`### Entities (${context.entities.size})\n`);

    for (const entity of context.entities.values()) {
      lines.push(`#### ${entity.name} [${entity.id}]`);
      lines.push(`Type: ${entity.definitionId}`);

      if (entity.summary) {
        lines.push(`Summary: ${entity.summary}`);
      }

      // Include relationships from entity data
      if (entity.relationships.length > 0) {
        lines.push('Relationships:');
        for (const rel of entity.relationships) {
          const targetEntity = this.dataStore.getEntity(entityId(rel.target));
          const targetName = targetEntity?.name || rel.target;
          lines.push(`  - ${rel.type}: ${targetName}`);
        }
      }

      // Include full body content
      if (entity.body) {
        lines.push(`\nContent (complete):\n${entity.body}`);
      }

      lines.push('');
    }

    return lines.join('\n');
  }

  private formatCapabilities(context: ContextMap): string {
    const expandedIds = Array.from(context.entities.keys());
    const expandedNames = Array.from(context.entities.values()).map((e) => e.name);

    const alreadyExpandedSection =
      expandedNames.length > 0
        ? `\n**IMPORTANT: The following entities are ALREADY in context with full details. Do NOT request EXPAND_ENTITY for these:**\n- Names: ${expandedNames.join(', ')}\n- IDs: ${expandedIds.join(', ')}`
        : '';

    return `
### SEARCH_ENTITIES
Search for entities by text query.
Parameters: { "query": "search text", "limit": 5 }
Example: { "query": "vampire lord", "limit": 5 }

### EXPAND_ENTITY
Get full details of an entity by ID. Only use this for entities NOT already in context.
Parameters: { "entityId": "entity-id" }${alreadyExpandedSection}

### GET_ENTITY_BY_NAME
Look up an entity by exact name.
Parameters: { "name": "Entity Name" }

### GET_RELATIONSHIPS
Get relationships for entities.
Parameters: { "entityIds": ["id1", "id2"], "direction": "both" }

### LIST_ENTITIES_BY_TYPE
Get all entities of a type.
Parameters: { "type": "character|location|organization", "limit": 10 }
`;
  }

  private parseResponse(content: string): LLMResponse {
    // Extract JSON from response
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn('[Could not parse LLM response as JSON]');
      return {
        type: 'answer',
        answer: content,
        confidence: 'low',
        sources: [],
      };
    }

    try {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      return parsed as LLMResponse;
    } catch (e) {
      console.warn('[JSON parse error]', e);
      return {
        type: 'answer',
        answer: content,
        confidence: 'low',
        sources: [],
      };
    }
  }

  private async fulfillRequest(request: InfoRequest, context: ContextMap): Promise<TestEntity[]> {
    // Format parameters for display
    const paramsDisplay = this.formatParamsForDisplay(request.capability, request.params);
    console.log(`  [${request.capability}] ${paramsDisplay}`);
    console.log(`    Reason: ${request.reason}`);

    switch (request.capability) {
      case 'SEARCH_ENTITIES': {
        const query = request.params.query as string;
        const limit = (request.params.limit as number) || 5;
        const results = await this.searchProvider.search(this.worldId, query, { limit });

        return results
          .map((r) => this.dataStore.getEntity(r.entityId))
          .filter((e): e is TestEntity => e !== undefined);
      }

      case 'EXPAND_ENTITY': {
        const id = entityId(request.params.entityId as string);

        // Check if already in context - prevent duplicate expansions
        if (context.entities.has(id)) {
          const entityName = context.entities.get(id)?.name || id;
          console.warn(`    Warning: Entity "${entityName}" (${id}) is already in context, skipping duplicate expansion`);
          return [];
        }

        const entity = this.dataStore.getEntity(id);
        return entity ? [entity] : [];
      }

      case 'GET_ENTITY_BY_NAME': {
        const name = request.params.name as string;
        const entity = this.dataStore.getEntityByName(name);
        return entity ? [entity] : [];
      }

      case 'GET_RELATIONSHIPS': {
        const ids = (request.params.entityIds as string[]).map((id) => entityId(id));
        const result = await this.relationshipProvider.getRelationships(ids, {
          includeEntities: true,
        });

        // Add related entities to context
        const relatedEntities: TestEntity[] = [];
        for (const rel of result.relationships) {
          const source = this.dataStore.getEntity(rel.sourceEntityId);
          const target = this.dataStore.getEntity(rel.targetEntityId);
          if (source && !context.entities.has(source.id)) relatedEntities.push(source);
          if (target && !context.entities.has(target.id)) relatedEntities.push(target);
        }
        return relatedEntities;
      }

      case 'LIST_ENTITIES_BY_TYPE': {
        const type = request.params.type as string;
        const limit = (request.params.limit as number) || 10;
        const defId = `def-${type}` as any;
        const entities = this.dataStore.getEntitiesByType(defId);
        return entities.slice(0, limit);
      }

      default:
        console.warn(`  [Unknown capability: ${request.capability}]`);
        return [];
    }
  }

  private formatParamsForDisplay(capability: string, params: Record<string, unknown>): string {
    switch (capability) {
      case 'SEARCH_ENTITIES':
        return `query="${params.query}", limit=${params.limit || 5}`;
      case 'EXPAND_ENTITY':
        return `entityId="${params.entityId}"`;
      case 'GET_ENTITY_BY_NAME':
        return `name="${params.name}"`;
      case 'GET_RELATIONSHIPS':
        return `entityIds=[${(params.entityIds as string[])?.join(', ')}], direction=${params.direction || 'both'}`;
      case 'LIST_ENTITIES_BY_TYPE':
        return `type="${params.type}", limit=${params.limit || 10}`;
      default:
        return JSON.stringify(params);
    }
  }
}

// Simple context map for the experiment
interface ContextMap {
  entities: Map<EntityId, TestEntity>;
  relationships: Map<string, unknown>;
}

/**
 * Create an orchestrator with default configuration
 */
export function createOrchestrator(dataStore: TestDataStore): IntelligenceOrchestrator {
  const llmClient = new OpenRouterClient();
  return new IntelligenceOrchestrator({ llmClient, dataStore });
}
