// Branded/Nominal ID types for compile-time type safety
// These types ensure you can't accidentally pass a WorldId where an EntityId is expected

/**
 * Brand symbol for nominal typing
 * Using a unique symbol ensures brands can't collide
 */
declare const __brand: unique symbol;

/**
 * Branded type utility - creates a nominal type from a base type
 * The brand exists only at compile time and has zero runtime cost
 */
export type Brand<T, TBrand extends string> = T & { [__brand]: TBrand };

/**
 * Helper type to extract the base type from a branded type
 */
export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;

// ==================== Domain ID Types ====================

/** Unique identifier for a World */
export type WorldId = Brand<string, 'WorldId'>;

/** Unique identifier for an EntityDefinition (schema definition) */
export type EntityDefinitionId = Brand<string, 'EntityDefinitionId'>;

/** Unique identifier for a PropertyDefinition */
export type PropertyDefinitionId = Brand<string, 'PropertyDefinitionId'>;

/** Unique identifier for an Entity (instance) */
export type EntityId = Brand<string, 'EntityId'>;

/** Unique identifier for a Relationship */
export type RelationshipId = Brand<string, 'RelationshipId'>;

// ==================== ID Factory Functions ====================

/**
 * Creates a WorldId from a string
 * Use this when receiving IDs from external sources (DB, API, etc.)
 */
export function worldId(id: string): WorldId {
  return id as WorldId;
}

/**
 * Creates an EntityDefinitionId from a string
 */
export function entityDefinitionId(id: string): EntityDefinitionId {
  return id as EntityDefinitionId;
}

/**
 * Creates a PropertyDefinitionId from a string
 */
export function propertyDefinitionId(id: string): PropertyDefinitionId {
  return id as PropertyDefinitionId;
}

/**
 * Creates an EntityId from a string
 */
export function entityId(id: string): EntityId {
  return id as EntityId;
}

/**
 * Creates a RelationshipId from a string
 */
export function relationshipId(id: string): RelationshipId {
  return id as RelationshipId;
}

// ==================== Type Guards ====================

/**
 * Type guard to check if a value is a valid UUID format
 * Does not validate the ID type brand, only the format
 */
export function isValidUuid(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
