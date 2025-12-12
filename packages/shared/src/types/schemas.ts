// Zod validation schemas for tRPC procedures and API validation
// These schemas are used for runtime validation of requests and responses

import { z } from 'zod';
import { PropertyType } from './domain.js';

// ========== World Schemas ==========

export const WorldSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateWorldInput = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

export const UpdateWorldInput = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
});

// ========== Entity Type Schemas ==========

export const EntityTypeSchema = z.object({
  id: z.string().uuid(),
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  propertyDefinitionIds: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEntityTypeInput = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  propertyDefinitionIds: z.array(z.string().uuid()).default([]),
});

export const UpdateEntityTypeInput = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  propertyDefinitionIds: z.array(z.string().uuid()).optional(),
});

// ========== Entity Schemas ==========

export const PropertyValueSchema: z.ZodType<string | number | boolean | string[] | null> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);

export const EntitySchema = z.object({
  id: z.string().uuid(),
  worldId: z.string().uuid(),
  typeId: z.string().uuid(),
  name: z.string().min(1).max(255),
  body: z.string().default(''),
  properties: z.record(z.string(), PropertyValueSchema),
  embedding: z.array(z.number()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEntityInput = z.object({
  worldId: z.string().uuid(),
  typeId: z.string().uuid(),
  name: z.string().min(1).max(255),
  body: z.string().default(''),
  properties: z.record(z.string(), PropertyValueSchema).default({}),
});

export const UpdateEntityInput = z.object({
  name: z.string().min(1).max(255).optional(),
  body: z.string().optional(),
  properties: z.record(z.string(), PropertyValueSchema).optional(),
});

// ========== Property Definition Schemas ==========

export const PropertyConstraintsSchema = z.object({
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  options: z.array(z.string()).optional(),
  referencedEntityTypeId: z.string().uuid().optional(),
});

export const PropertyDefinitionSchema = z.object({
  id: z.string().uuid(),
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.nativeEnum(PropertyType),
  description: z.string().max(1000).optional(),
  required: z.boolean(),
  defaultValue: PropertyValueSchema.optional(),
  constraints: PropertyConstraintsSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePropertyDefinitionInput = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.nativeEnum(PropertyType),
  description: z.string().max(1000).optional(),
  required: z.boolean().default(false),
  defaultValue: PropertyValueSchema.optional(),
  constraints: PropertyConstraintsSchema.optional(),
});

export const UpdatePropertyDefinitionInput = z.object({
  name: z.string().min(1).max(255).optional(),
  type: z.nativeEnum(PropertyType).optional(),
  description: z.string().max(1000).optional(),
  required: z.boolean().optional(),
  defaultValue: PropertyValueSchema.optional(),
  constraints: PropertyConstraintsSchema.optional(),
});

// ========== Relationship Schemas ==========

export const RelationshipSchema = z.object({
  id: z.string().uuid(),
  worldId: z.string().uuid(),
  fromEntityId: z.string().uuid(),
  toEntityId: z.string().uuid(),
  type: z.string().min(1),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateRelationshipInput = z.object({
  worldId: z.string().uuid(),
  fromEntityId: z.string().uuid(),
  toEntityId: z.string().uuid(),
  type: z.string().min(1),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateRelationshipInput = z.object({
  type: z.string().min(1).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ========== Query Input Schemas ==========

export const PaginationInput = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const SearchInput = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(100).default(10),
});
