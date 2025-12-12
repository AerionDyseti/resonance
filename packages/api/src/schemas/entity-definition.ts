import { z } from 'zod';

export const EntityDefinitionSchema = z.object({
  id: z.string().uuid(),
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  propertyDefinitionIds: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEntityDefinitionInput = z.object({
  worldId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  propertyDefinitionIds: z.array(z.string().uuid()).default([]),
});

export const UpdateEntityDefinitionInput = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  propertyDefinitionIds: z.array(z.string().uuid()).optional(),
});
