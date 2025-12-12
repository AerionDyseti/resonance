import type { InfoCapability, CapabilityId } from './info-capability';
import {
  createEntityIdParam,
  createEntityIdArrayParam,
  createStringParam,
  createEnumParam,
} from './info-capability';
import type { QueryContext } from './query-context';

/**
 * Build the EXPAND_ENTITY capability
 * Allows LLM to request full details of a single entity
 */
export function buildExpandEntityCapability(context: QueryContext): InfoCapability {
  const expandableIds = context.expandableEntityIds;

  return {
    id: 'EXPAND_ENTITY',
    name: 'Expand Entity',
    description:
      'Get full details of an entity including its body content, properties, and relationships. ' +
      'Use this when you need more information about a specific entity mentioned in the context.',
    parameters: [createEntityIdParam('entityId', 'The ID of the entity to expand', expandableIds)],
    example: expandableIds.length > 0 ? `{ "entityId": "${expandableIds[0]}" }` : undefined,
  };
}

/**
 * Build the EXPAND_ENTITIES capability
 * Allows LLM to request full details of multiple entities at once
 */
export function buildExpandEntitiesCapability(context: QueryContext): InfoCapability {
  const expandableIds = context.expandableEntityIds;

  return {
    id: 'EXPAND_ENTITIES',
    name: 'Expand Multiple Entities',
    description:
      'Get full details of multiple entities at once. More efficient than expanding one at a time. ' +
      'Use when you need details about several related entities.',
    parameters: [
      createEntityIdArrayParam(
        'entityIds',
        'Array of entity IDs to expand (max 5)',
        expandableIds,
        5
      ),
    ],
    example:
      expandableIds.length >= 2
        ? `{ "entityIds": ["${expandableIds[0]}", "${expandableIds[1]}"] }`
        : undefined,
  };
}

/**
 * Build the SEARCH_ENTITIES capability
 * Allows LLM to search for entities by text query
 */
export function buildSearchEntitiesCapability(): InfoCapability {
  return {
    id: 'SEARCH_ENTITIES',
    name: 'Search Entities',
    description:
      'Search for entities by name, content, or properties using semantic search. ' +
      'Use this when you need to find entities related to a topic not in the current context.',
    parameters: [
      createStringParam('query', 'Search query text', true, 200),
      {
        name: 'limit',
        description: 'Maximum number of results to return (default: 5, max: 10)',
        type: 'number',
        required: false,
        constraints: { min: 1, max: 10 },
      },
    ],
    example: '{ "query": "ancient artifacts", "limit": 5 }',
  };
}

/**
 * Build the GET_RELATIONSHIPS capability
 * Allows LLM to get relationships for specific entities
 */
export function buildGetRelationshipsCapability(context: QueryContext): InfoCapability {
  const entityIds = context.allEntityIds;

  return {
    id: 'GET_RELATIONSHIPS',
    name: 'Get Relationships',
    description:
      'Get all relationships (incoming and outgoing) for one or more entities. ' +
      'Use this to understand how entities are connected.',
    parameters: [
      createEntityIdArrayParam('entityIds', 'Entity IDs to get relationships for', entityIds, 5),
      {
        name: 'direction',
        description: 'Filter by relationship direction',
        type: 'enum',
        required: false,
        constraints: { enumValues: ['incoming', 'outgoing', 'both'] },
      },
    ],
    example:
      entityIds.length > 0
        ? `{ "entityIds": ["${entityIds[0]}"], "direction": "both" }`
        : undefined,
  };
}

/**
 * Build the GET_ENTITY_BY_NAME capability
 * Allows LLM to look up entity by name (exact or fuzzy match)
 */
export function buildGetEntityByNameCapability(): InfoCapability {
  return {
    id: 'GET_ENTITY_BY_NAME',
    name: 'Get Entity by Name',
    description:
      'Look up an entity by its name or alias. Use this when you know an entity name ' +
      'but it is not in the current context.',
    parameters: [
      createStringParam('name', 'Entity name or alias to search for', true, 100),
      {
        name: 'fuzzy',
        description: 'Allow fuzzy/partial name matching (default: true)',
        type: 'boolean',
        required: false,
      },
    ],
    example: '{ "name": "Gandalf", "fuzzy": true }',
  };
}

/**
 * Build the LIST_ENTITY_DEFINITIONS capability
 * Allows LLM to see what types of entities exist in the world
 */
export function buildListEntityDefinitionsCapability(_context: QueryContext): InfoCapability {
  return {
    id: 'LIST_ENTITY_DEFINITIONS',
    name: 'List Entity Types',
    description:
      'Get a list of all entity types (definitions) available in this world. ' +
      'Use this to understand what kinds of entities exist.',
    parameters: [],
  };
}

/**
 * Build the GET_ENTITIES_BY_DEFINITION capability
 * Allows LLM to get entities of a specific type
 */
export function buildGetEntitiesByDefinitionCapability(context: QueryContext): InfoCapability {
  const definitionNames = context.availableDefinitions.map((d) => d.name);

  return {
    id: 'GET_ENTITIES_BY_DEFINITION',
    name: 'Get Entities by Type',
    description:
      'Get all entities of a specific type (entity definition). ' +
      'Use this to explore all characters, locations, items, etc.',
    parameters: [
      createEnumParam('definitionName', 'Name of the entity type to get', definitionNames, true),
      {
        name: 'limit',
        description: 'Maximum number of results (default: 10, max: 20)',
        type: 'number',
        required: false,
        constraints: { min: 1, max: 20 },
      },
    ],
    example:
      definitionNames.length > 0
        ? `{ "definitionName": "${definitionNames[0]}", "limit": 10 }`
        : undefined,
  };
}

/**
 * Build all capabilities for the current context
 * Capabilities are dynamically constrained based on what's in context
 */
export function buildCapabilities(context: QueryContext): InfoCapability[] {
  const capabilities: InfoCapability[] = [];

  // Always include search and name lookup
  capabilities.push(buildSearchEntitiesCapability());
  capabilities.push(buildGetEntityByNameCapability());

  // Include expand capabilities if there are expandable entities
  if (context.hasExpandableEntities()) {
    capabilities.push(buildExpandEntityCapability(context));
    if (context.expandableEntityIds.length > 1) {
      capabilities.push(buildExpandEntitiesCapability(context));
    }
  }

  // Include relationship capability if there are entities
  if (context.allEntityIds.length > 0) {
    capabilities.push(buildGetRelationshipsCapability(context));
  }

  // Include definition-based capabilities
  capabilities.push(buildListEntityDefinitionsCapability(context));
  if (context.availableDefinitions.length > 0) {
    capabilities.push(buildGetEntitiesByDefinitionCapability(context));
  }

  return capabilities;
}

/**
 * Get a capability by ID from the built capabilities
 */
export function getCapabilityById(
  capabilities: InfoCapability[],
  id: CapabilityId
): InfoCapability | undefined {
  return capabilities.find((c) => c.id === id);
}

/**
 * Format capabilities as a prompt section for the LLM
 */
export function formatCapabilitiesForPrompt(capabilities: InfoCapability[]): string {
  const lines: string[] = ['## Available Capabilities\n'];

  for (const cap of capabilities) {
    lines.push(`### ${cap.name} (${cap.id})`);
    lines.push(cap.description);

    if (cap.parameters.length > 0) {
      lines.push('\nParameters:');
      for (const param of cap.parameters) {
        const required = param.required ? ' (required)' : ' (optional)';
        let constraints = '';
        if (param.constraints?.enumValues) {
          constraints = ` - Valid values: ${param.constraints.enumValues.slice(0, 5).join(', ')}${param.constraints.enumValues.length > 5 ? '...' : ''}`;
        }
        lines.push(`- **${param.name}**${required}: ${param.description}${constraints}`);
      }
    }

    if (cap.example) {
      lines.push(`\nExample: \`${cap.example}\``);
    }

    lines.push('');
  }

  return lines.join('\n');
}
