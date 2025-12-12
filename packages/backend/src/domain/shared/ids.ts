// Branded/Nominal ID types for compile-time type safety
// These types ensure you can't accidentally pass a WorldId where an EntityId is expected

import { randomUUID } from 'crypto';

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

/** Unique identifier for a User */
export type UserId = Brand<string, 'UserId'>;

/** Unique identifier for a World */
export type WorldId = Brand<string, 'WorldId'>;

/** Unique identifier for a Tag */
export type TagId = Brand<string, 'TagId'>;

/** Unique identifier for a Template (reusable property group) */
export type TemplateId = Brand<string, 'TemplateId'>;

/** Unique identifier for an EntityDefinition (schema definition) */
export type EntityDefinitionId = Brand<string, 'EntityDefinitionId'>;

/** Unique identifier for a PropertyDefinition */
export type PropertyDefinitionId = Brand<string, 'PropertyDefinitionId'>;

/** Unique identifier for an Entity (instance) */
export type EntityId = Brand<string, 'EntityId'>;

/** Unique identifier for a RelationshipDefinition (relationship schema) */
export type RelationshipDefinitionId = Brand<string, 'RelationshipDefinitionId'>;

/** Unique identifier for a Relationship */
export type RelationshipId = Brand<string, 'RelationshipId'>;

/** Unique identifier for a Property (instance of PropertyDefinition) */
export type PropertyId = Brand<string, 'PropertyId'>;

/** Unique identifier for an EmbeddingChunk */
export type BodySegmentId = Brand<string, 'EmbeddingChunkId'>;

/** Unique identifier for a WorldQuery (LLM query against a world) */
export type QueryId = Brand<string, 'QueryId'>;

// ==================== ID Factory Functions ====================

/**
 * Creates a UserId from a string
 * Use this when receiving IDs from external sources (DB, API, etc.)
 */
export function userId(id: string): UserId {
  return id as UserId;
}

/**
 * Creates a WorldId from a string
 */
export function worldId(id: string): WorldId {
  return id as WorldId;
}

/**
 * Creates a TagId from a string
 */
export function tagId(id: string): TagId {
  return id as TagId;
}

/**
 * Creates a TemplateId from a string
 */
export function templateId(id: string): TemplateId {
  return id as TemplateId;
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
 * Creates a RelationshipDefinitionId from a string
 */
export function relationshipDefinitionId(id: string): RelationshipDefinitionId {
  return id as RelationshipDefinitionId;
}

/**
 * Creates a RelationshipId from a string
 */
export function relationshipId(id: string): RelationshipId {
  return id as RelationshipId;
}

/**
 * Creates a PropertyId from a string
 */
export function propertyId(id: string): PropertyId {
  return id as PropertyId;
}

/**
 * Creates an EmbeddingChunkId from a string
 */
export function embeddingChunkId(id: string): BodySegmentId {
  return id as BodySegmentId;
}

/**
 * Creates a QueryId from a string
 */
export function queryId(id: string): QueryId {
  return id as QueryId;
}

// ==================== ID Generation Functions ====================

/**
 * Generates a new UserId with a fresh UUID
 */
export function createUserId(): UserId {
  return randomUUID() as UserId;
}

/**
 * Generates a new WorldId with a fresh UUID
 */
export function createWorldId(): WorldId {
  return randomUUID() as WorldId;
}

/**
 * Generates a new TagId with a fresh UUID
 */
export function createTagId(): TagId {
  return randomUUID() as TagId;
}

/**
 * Generates a new TemplateId with a fresh UUID
 */
export function createTemplateId(): TemplateId {
  return randomUUID() as TemplateId;
}

/**
 * Generates a new EntityDefinitionId with a fresh UUID
 */
export function createEntityDefinitionId(): EntityDefinitionId {
  return randomUUID() as EntityDefinitionId;
}

/**
 * Generates a new PropertyDefinitionId with a fresh UUID
 */
export function createPropertyDefinitionId(): PropertyDefinitionId {
  return randomUUID() as PropertyDefinitionId;
}

/**
 * Generates a new EntityId with a fresh UUID
 */
export function createEntityId(): EntityId {
  return randomUUID() as EntityId;
}

/**
 * Generates a new RelationshipDefinitionId with a fresh UUID
 */
export function createRelationshipDefinitionId(): RelationshipDefinitionId {
  return randomUUID() as RelationshipDefinitionId;
}

/**
 * Generates a new RelationshipId with a fresh UUID
 */
export function createRelationshipId(): RelationshipId {
  return randomUUID() as RelationshipId;
}

/**
 * Generates a new PropertyId with a fresh UUID
 */
export function createPropertyId(): PropertyId {
  return randomUUID() as PropertyId;
}

/**
 * Generates a new EmbeddingChunkId with a fresh UUID
 */
export function createEmbeddingChunkId(): BodySegmentId {
  return randomUUID() as BodySegmentId;
}

/**
 * Generates a new QueryId with a fresh UUID
 */
export function createQueryId(): QueryId {
  return randomUUID() as QueryId;
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
