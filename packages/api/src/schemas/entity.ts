import { z } from 'zod';

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
  definitionId: z.string().uuid(),
  name: z.string().min(1).max(255),
  body: z.string().default(''),
  properties: z.record(z.string(), PropertyValueSchema),
  embedding: z.array(z.number()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEntityInput = z.object({
  worldId: z.string().uuid(),
  definitionId: z.string().uuid(),
  name: z.string().min(1).max(255),
  body: z.string().default(''),
  properties: z.record(z.string(), PropertyValueSchema).default({}),
});

export const UpdateEntityInput = z.object({
  name: z.string().min(1).max(255).optional(),
  body: z.string().optional(),
  properties: z.record(z.string(), PropertyValueSchema).optional(),
});
