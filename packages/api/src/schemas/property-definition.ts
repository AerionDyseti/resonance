import { z } from 'zod';
import { PropertyType } from '@resonance/shared';

import { PropertyValueSchema } from './entity';

export const PropertyConstraintsSchema = z.object({
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  options: z.array(z.string()).optional(),
  referencedEntityDefinitionId: z.string().uuid().optional(),
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
