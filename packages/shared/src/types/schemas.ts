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
  templateIds: z.array(z.string().uuid()),
  propertyIds: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEntityTypeInput = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  templateIds: z.array(z.string().uuid()).default([]),
  propertyIds: z.array(z.string().uuid()).default([]),
});

// ========== Entity Schemas ==========

export const PropertyValueSchema: z.ZodType<any> = z.union([
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

// ========== Property Schemas ==========

export const PropertyConstraintsSchema = z.object({
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  options: z.array(z.string()).optional(),
  relationshipType: z.string().optional(),
});

export const PropertySchema = z.object({
  id: z.string().uuid(),
  typeId: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.nativeEnum(PropertyType),
  description: z.string().max(1000).optional(),
  required: z.boolean(),
  defaultValue: PropertyValueSchema.optional(),
  constraints: PropertyConstraintsSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePropertyInput = z.object({
  typeId: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.nativeEnum(PropertyType),
  description: z.string().max(1000).optional(),
  required: z.boolean().default(false),
  defaultValue: PropertyValueSchema.optional(),
  constraints: PropertyConstraintsSchema.optional(),
});

// ========== Template Schemas ==========

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  propertyIds: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTemplateInput = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  propertyIds: z.array(z.string().uuid()).default([]),
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

// ========== Query Input Schemas ==========

export const PaginationInput = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const SearchInput = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(100).default(10),
});
