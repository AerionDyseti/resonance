/**
 * Parameter types that capabilities can accept
 */
export type ParameterType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'entity_id'
  | 'entity_id_array'
  | 'enum';

/**
 * Constraint options for capability parameters
 * These prevent LLM hallucination by limiting valid values
 */
export interface ParameterConstraints {
  /** For enum type: valid values */
  enumValues?: string[];
  /** For entity_id/entity_id_array: valid entity IDs from current context */
  validEntityIds?: string[];
  /** For string: max length */
  maxLength?: number;
  /** For number: min value */
  min?: number;
  /** For number: max value */
  max?: number;
  /** For entity_id_array: max items */
  maxItems?: number;
}

/**
 * CapabilityParameter - Defines a parameter that a capability accepts
 * Includes type information and constraints for LLM guidance
 */
export interface CapabilityParameter {
  /** Parameter name */
  name: string;
  /** Human-readable description for LLM */
  description: string;
  /** Data type */
  type: ParameterType;
  /** Whether this parameter is required */
  required: boolean;
  /** Constraints to prevent invalid values */
  constraints?: ParameterConstraints;
}

/**
 * Capability identifiers - what actions the LLM can request
 */
export type CapabilityId =
  | 'EXPAND_ENTITY'
  | 'EXPAND_ENTITIES'
  | 'SEARCH_ENTITIES'
  | 'GET_RELATIONSHIPS'
  | 'GET_ENTITY_BY_NAME'
  | 'LIST_ENTITY_DEFINITIONS'
  | 'GET_ENTITIES_BY_DEFINITION';

/**
 * InfoCapability - Describes what information retrieval the LLM can request
 *
 * Capabilities are dynamically constrained based on current context.
 * For example, EXPAND_ENTITY includes validEntityIds from the context,
 * preventing the LLM from requesting expansion of non-existent entities.
 */
export interface InfoCapability {
  /** Unique identifier for this capability */
  id: CapabilityId;
  /** Human-readable name */
  name: string;
  /** Description of what this capability does (for LLM) */
  description: string;
  /** Parameters this capability accepts */
  parameters: CapabilityParameter[];
  /** Example usage for LLM guidance */
  example?: string;
}

/**
 * InfoRequest - A specific request from the LLM to use a capability
 * This is what comes back in a NeedsMoreInfo response
 */
export interface InfoRequest {
  /** Which capability to invoke */
  capabilityId: CapabilityId;
  /** Parameter values for the capability */
  params: Record<string, unknown>;
  /** LLM's reason for this request (helps debugging and transparency) */
  reason: string;
}

/**
 * InfoRequestResult - The result of fulfilling an InfoRequest
 */
export interface InfoRequestResult {
  /** The original request */
  request: InfoRequest;
  /** Whether the request was successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Number of items returned (for logging/metrics) */
  itemCount?: number;
}

// ==================== Factory Functions ====================

/**
 * Create a capability parameter with entity ID constraints
 * Constrains the LLM to only reference entities currently in context
 */
export function createEntityIdParam(
  name: string,
  description: string,
  validEntityIds: string[],
  required = true
): CapabilityParameter {
  return {
    name,
    description,
    type: 'entity_id',
    required,
    constraints: {
      validEntityIds,
      enumValues: validEntityIds, // Also provide as enum for LLM
    },
  };
}

/**
 * Create a capability parameter for multiple entity IDs
 */
export function createEntityIdArrayParam(
  name: string,
  description: string,
  validEntityIds: string[],
  maxItems = 10,
  required = true
): CapabilityParameter {
  return {
    name,
    description,
    type: 'entity_id_array',
    required,
    constraints: {
      validEntityIds,
      enumValues: validEntityIds,
      maxItems,
    },
  };
}

/**
 * Create a string parameter
 */
export function createStringParam(
  name: string,
  description: string,
  required = true,
  maxLength = 500
): CapabilityParameter {
  return {
    name,
    description,
    type: 'string',
    required,
    constraints: { maxLength },
  };
}

/**
 * Create an enum parameter
 */
export function createEnumParam(
  name: string,
  description: string,
  values: string[],
  required = true
): CapabilityParameter {
  return {
    name,
    description,
    type: 'enum',
    required,
    constraints: { enumValues: values },
  };
}

/**
 * Create an InfoRequest
 */
export function createInfoRequest(
  capabilityId: CapabilityId,
  params: Record<string, unknown>,
  reason: string
): InfoRequest {
  return {
    capabilityId,
    params,
    reason: reason.trim(),
  };
}

// ==================== Validation ====================

/**
 * Validate that an InfoRequest has valid parameters for its capability
 */
export function validateInfoRequest(
  request: InfoRequest,
  capability: InfoCapability
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required parameters
  for (const param of capability.parameters) {
    if (param.required && !(param.name in request.params)) {
      errors.push(`Missing required parameter: ${param.name}`);
      continue;
    }

    const value = request.params[param.name];
    if (value === undefined) continue;

    // Validate entity_id against valid IDs
    if (param.type === 'entity_id' && param.constraints?.validEntityIds) {
      if (!param.constraints.validEntityIds.includes(value as string)) {
        errors.push(`Invalid entity ID for ${param.name}: ${value}`);
      }
    }

    // Validate entity_id_array
    if (param.type === 'entity_id_array' && Array.isArray(value)) {
      const validIds = param.constraints?.validEntityIds || [];
      for (const id of value) {
        if (!validIds.includes(id as string)) {
          errors.push(`Invalid entity ID in ${param.name}: ${id}`);
        }
      }
      if (param.constraints?.maxItems && value.length > param.constraints.maxItems) {
        errors.push(
          `Too many items in ${param.name}: ${value.length} > ${param.constraints.maxItems}`
        );
      }
    }

    // Validate enum values
    if (param.type === 'enum' && param.constraints?.enumValues) {
      if (!param.constraints.enumValues.includes(value as string)) {
        errors.push(
          `Invalid value for ${param.name}: ${value}. Must be one of: ${param.constraints.enumValues.join(', ')}`
        );
      }
    }

    // Validate string length
    if (param.type === 'string' && typeof value === 'string') {
      if (param.constraints?.maxLength && value.length > param.constraints.maxLength) {
        errors.push(
          `Value for ${param.name} exceeds max length: ${value.length} > ${param.constraints.maxLength}`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
